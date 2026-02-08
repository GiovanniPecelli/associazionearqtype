import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const PresenceContext = createContext(null);

export function PresenceProvider({ children }) {
    const { user, profile } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState({});

    useEffect(() => {
        if (!user || !profile) return;

        // Channel for tracking presence - separate from chat channels
        const channel = supabase.channel('online-users');

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState();
                const users = {};

                // Flatten presence state
                Object.keys(newState).forEach(key => {
                    newState[key].forEach(presence => {
                        users[presence.user_id] = presence;
                    });
                });

                setOnlineUsers(users);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                // Optional: Toast/Sound for user online? (Maybe too noisy)
                // console.log('User joined:', newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                // console.log('User left:', leftPresences);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: user.id,
                        email: user.email,
                        display_name: profile.display_name || user.email?.split('@')[0],
                        role: profile.role || 'user',
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [user, profile]);

    return (
        <PresenceContext.Provider value={{ onlineUsers }}>
            {children}
        </PresenceContext.Provider>
    );
}

export function usePresence() {
    const context = useContext(PresenceContext);
    if (!context) {
        throw new Error('usePresence must be used within a PresenceProvider');
    }
    return context;
}
