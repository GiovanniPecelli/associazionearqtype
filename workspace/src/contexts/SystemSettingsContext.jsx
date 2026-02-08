import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const SystemSettingsContext = createContext(null);

export function SystemSettingsProvider({ children }) {
    // Default to TRUE (open) if loading or error, so we don't accidentally lock everyone out
    const [signupEnabled, setSignupEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const { isHost } = useAuth();

    // Fetch initial settings
    useEffect(() => {
        fetchSettings();

        // Optional: Real-time subscription to settings changes
        const subscription = supabase
            .channel('system_settings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'system_settings' }, (payload) => {
                if (payload.new && typeof payload.new.signup_enabled !== 'undefined') {
                    setSignupEnabled(payload.new.signup_enabled);
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchSettings = async () => {
        try {
            // We assume a table 'system_settings' with a single row or key-value pairs
            // For simplicity, let's look for a row where id=1 or key='global_config'
            const { data, error } = await supabase
                .from('system_settings')
                .select('signup_enabled')
                .single();

            if (error) {
                // If table doesn't exist or is empty, we default to TRUE
                console.warn('System settings fetch error (using defaults):', error.message);
                setSignupEnabled(true);
            } else if (data) {
                setSignupEnabled(data.signup_enabled);
            }
        } catch (err) {
            console.error('Unexpected error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleSignup = async (newValue) => {
        if (!isHost) return; // Only hosts can change this

        // Optimistic update
        const oldValue = signupEnabled;
        setSignupEnabled(newValue);

        try {
            // Upsert the setting. We assume a single row config pattern, e.g. id: 1
            const { error } = await supabase
                .from('system_settings')
                .upsert({ id: 1, signup_enabled: newValue });

            if (error) throw error;
        } catch (err) {
            console.error('Error updating signup setting:', err);
            // Revert on error
            setSignupEnabled(oldValue);

            // User Feedback
            alert(`Failed to update setting: ${err.message}. \n\nPlease ensure you have run the 'supabase_setup.sql' script in your Supabase SQL Editor.`);

            throw err;
        }
    };

    return (
        <SystemSettingsContext.Provider value={{ signupEnabled, toggleSignup, loading }}>
            {children}
        </SystemSettingsContext.Provider>
    );
}

export function useSystemSettings() {
    const context = useContext(SystemSettingsContext);
    if (!context) {
        throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
    }
    return context;
}
