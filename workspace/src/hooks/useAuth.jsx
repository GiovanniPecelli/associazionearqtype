import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Fetch user profile with timeout
    const fetchProfile = async (userId) => {
      // Create a timeout promise to prevent indefinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 3000);
      });

      // Create the fetch promise
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      try {
        // Race between fetch and timeout
        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) {
          if (error.code === 'PGRST116') {
            console.warn('Profile not found - signing out');
            await supabase.auth.signOut();
            if (mounted) {
              setUser(null);
              setProfile(null);
            }
          }
          return;
        }

        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        // Continue anyway - user can still be logged in without profile
      }
    };

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // ANY event stops loading IMMEDIATELY
        setLoading(false);

        if (session?.user) {
          setUser(session.user);
          // Fetch profile in background - don't wait
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Aggressive timeout - stop loading after 2 seconds NO MATTER WHAT
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // Check if user has host/admin privileges (Case Insensitive)
  // Roles with full access: host, dev, hr, founder, management, agent, admin
  const normalizedRole = profile?.role?.toLowerCase();

  const isHost = normalizedRole === 'host' ||
    normalizedRole === 'president' ||
    normalizedRole === 'secretary' ||
    normalizedRole === 'treasurer' ||
    normalizedRole === 'counselor' ||
    normalizedRole === 'founder' ||
    normalizedRole === 'dev' ||
    normalizedRole === 'hr' ||
    normalizedRole === 'management' ||
    normalizedRole === 'agent' ||
    normalizedRole === 'admin' ||
    normalizedRole === 'owner';

  const isArchitect = normalizedRole === 'architect' || normalizedRole === 'coordinator';
  const isTasker = normalizedRole === 'tasker' || normalizedRole === 'collaborator';

  // Elite roles have highest privileges
  const isEliteRole = normalizedRole === 'founder' ||
    normalizedRole === 'dev' ||
    normalizedRole === 'hr' ||
    normalizedRole === 'management' ||
    normalizedRole === 'agent';

  const canManageTeam = isHost; // All elite roles are considered "host" level,

  const value = {
    user,
    profile,
    isHost,
    isArchitect,
    isTasker,
    isEliteRole,
    canManageTeam,
    isApproved: profile?.is_approved,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}