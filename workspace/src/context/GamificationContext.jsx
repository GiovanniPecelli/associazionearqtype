import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
    const { user, profile } = useAuth();
    const [stats, setStats] = useState({
        level: 1,
        impactPoints: 0,
        xp: 0,
        roleLevel: 'Tasker L1',
        nextLevelXp: 1000 // Example threshold
    });
    const [showLevelUp, setShowLevelUp] = useState(false);

    useEffect(() => {
        if (profile) {
            // ALL Board Roles are technically HOSTs
            const hostRoles = ['host', 'president', 'secretary', 'treasurer', 'counselor', 'founder', 'host elite', 'admin', 'owner'];
            const adminRoles = [...hostRoles, 'dev', 'hr', 'management', 'agent'];

            let displayRole = profile.current_role_level || 'Tasker L1';

            if (adminRoles.includes(profile.role?.toLowerCase())) {
                // If it's a Board Role (President, Secretary, etc.), IT IS HOST ELITE
                if (hostRoles.includes(profile.role?.toLowerCase())) {
                    // Show specific role title instead of generic "Host Elite"
                    if (profile.role === 'host elite') displayRole = 'Host Elite';
                    else if (profile.role === 'host') displayRole = 'Host';
                    else displayRole = profile.role.charAt(0).toUpperCase() + profile.role.slice(1);
                } else {
                    // Other admin roles
                    displayRole = profile.role === 'dev' ? 'Lead Developer' :
                        profile.role === 'hr' ? 'Head of HR' :
                            profile.role === 'management' ? 'Executive' :
                                profile.role === 'agent' ? 'Elite Agent' : 'Host Elite';
                }
            }

            setStats({
                level: profile.level || 1,
                // ... keep specific levels for non-host ...
                roleLevel: displayRole, // This will be 'Host Elite' for all board members
                // ...
                impactPoints: profile.vibe_points || 0,
                xp: profile.xp || 0,
                nextLevelXp: (profile.level || 1) * 1000
            });
        }
    }, [profile]);

    // Subscribe to realtime changes for instant updates
    useEffect(() => {
        if (!user) return;

        const subscription = supabase
            .channel('gamification_updates')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
            }, (payload) => {
                const newProfile = payload.new;

                // Check for level up
                if (newProfile.level > stats.level) {
                    setShowLevelUp(true);
                    // Play sound here if implemented
                }

                const adminRoles = ['host', 'dev', 'hr', 'founder', 'management', 'agent'];
                let displayRole = newProfile.current_role_level;

                if (adminRoles.includes(newProfile.role)) {
                    displayRole = newProfile.role === 'dev' ? 'Lead Developer' :
                        newProfile.role === 'hr' ? 'Head of HR' :
                            newProfile.role === 'founder' ? 'The Founder' :
                                newProfile.role === 'management' ? 'Executive' :
                                    newProfile.role === 'agent' ? 'Elite Agent' :
                                        'Host Elite';
                }

                setStats({
                    level: newProfile.level,
                    impactPoints: newProfile.vibe_points,
                    xp: newProfile.xp,
                    roleLevel: displayRole,
                    nextLevelXp: newProfile.level * 1000
                });
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [user, stats.level]);

    const value = {
        stats,
        showLevelUp,
        closeLevelUp: () => setShowLevelUp(false)
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
}
