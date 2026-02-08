import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';

export function useCompetencies() {
    const [allCompetencies, setAllCompetencies] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllCompetencies = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('competencies')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;
            setAllCompetencies(data || []);
        } catch (error) {
            console.error('Error fetching competencies:', error);
            setAllCompetencies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllCompetencies();
    }, [fetchAllCompetencies]);

    const fetchUserCompetencies = useCallback(async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_competencies')
                .select(`
                    *,
                    competencies (*)
                `)
                .eq('user_id', userId);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching user competencies:', error);
            return [];
        }
    }, []);

    const assignCompetency = useCallback(async (userId, competencyId, acquiredVia = 'manual') => {
        try {
            const { data, error } = await supabase
                .from('user_competencies')
                .insert({
                    user_id: userId,
                    competency_id: competencyId,
                    acquired_via: acquiredVia
                })
                .select();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error assigning competency:', error);
            return { success: false, error: error.message };
        }
    }, []);

    const removeCompetency = useCallback(async (userId, competencyId) => {
        try {
            const { error } = await supabase
                .from('user_competencies')
                .delete()
                .eq('user_id', userId)
                .eq('competency_id', competencyId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error removing competency:', error);
            return { success: false, error: error.message };
        }
    }, []);

    const checkTaskAccess = useCallback(async (task, userId) => {
        try {
            // If no competencies required, access granted
            if (!task.required_competencies || task.required_competencies.length === 0) {
                return { hasAccess: true, missingCompetencies: [] };
            }

            // Get user's competencies
            const userComps = await fetchUserCompetencies(userId);
            const userCompIds = userComps.map(uc => uc.competency_id);

            // Check if user has all required competencies
            const requiredIds = task.required_competencies;
            const missingIds = requiredIds.filter(id => !userCompIds.includes(id));

            if (missingIds.length === 0) {
                return { hasAccess: true, missingCompetencies: [] };
            }

            // Get missing competency details
            const { data: missingComps } = await supabase
                .from('competencies')
                .select('*')
                .in('id', missingIds);

            return { hasAccess: false, missingCompetencies: missingComps || [] };
        } catch (error) {
            console.error('Error checking task access:', error);
            return { hasAccess: false, missingCompetencies: [] };
        }
    }, [fetchUserCompetencies]);

    const autoAssignBaseCompetencies = useCallback(async (userId) => {
        try {
            // Get base competencies (general category)
            const { data: baseComps, error: fetchError } = await supabase
                .from('competencies')
                .select('id')
                .eq('category', 'general')
                .limit(5);

            if (fetchError) throw fetchError;

            // Assign each base competency
            const promises = baseComps.map(comp =>
                assignCompetency(userId, comp.id, 'auto')
            );

            await Promise.all(promises);
            return { success: true };
        } catch (error) {
            console.error('Error auto-assigning base competencies:', error);
            return { success: false, error: error.message };
        }
    }, [assignCompetency]);

    return {
        allCompetencies,
        loading,
        fetchUserCompetencies,
        assignCompetency,
        removeCompetency,
        checkTaskAccess,
        autoAssignBaseCompetencies,
        refreshCompetencies: fetchAllCompetencies
    };
}
