import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useCompetencies } from '../../hooks/useCompetencies';
import { CompetencyBadge } from './CompetencyBadge';
import Button from '../common/Button';
import PageTransition from '../common/PageTransition';

export default function CompetencyManager() {
    const { user, isHost } = useAuth();
    const { allCompetencies, fetchUserCompetencies, assignCompetency, removeCompetency } = useCompetencies();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userCompetencies, setUserCompetencies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            loadUserCompetencies();
        }
    }, [selectedUser]);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('display_name', { ascending: true });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const loadUserCompetencies = async () => {
        if (!selectedUser) return;
        const comps = await fetchUserCompetencies(selectedUser.id);
        setUserCompetencies(comps);
    };

    const handleAssign = async (competencyId) => {
        if (!selectedUser) return;
        setLoading(true);
        const result = await assignCompetency(selectedUser.id, competencyId, 'verified');
        if (result.success) {
            await loadUserCompetencies();
        } else {
            alert('Errore: ' + result.error);
        }
        setLoading(false);
    };

    const handleRemove = async (competencyId) => {
        if (!selectedUser || !confirm('Rimuovere questa competenza?')) return;
        setLoading(true);
        const result = await removeCompetency(selectedUser.id, competencyId);
        if (result.success) {
            await loadUserCompetencies();
        } else {
            alert('Errore: ' + result.error);
        }
        setLoading(false);
    };

    if (!isHost) {
        return (
            <PageTransition className="max-w-4xl mx-auto p-6">
                <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 text-center backdrop-blur-sm">
                    <p className="text-red-300 font-medium">Accesso negato. Solo gli amministratori possono gestire le competenze.</p>
                </div>
            </PageTransition>
        );
    }

    const userCompIds = new Set(userCompetencies.map(uc => uc.competency_id));

    return (
        <PageTransition className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestione Competenze</h1>
                    <p className="text-gray-400 mt-1">Assegna e gestisci le competenze del team</p>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/30 font-semibold">
                    HOST ONLY
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Selection */}
                <div className="lg:col-span-1 bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-4">
                    <h2 className="text-lg font-bold text-white mb-4">Seleziona Utente</h2>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {users.map(u => (
                            <button
                                key={u.id}
                                onClick={() => setSelectedUser(u)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedUser?.id === u.id
                                    ? 'bg-primary-900/40 border-2 border-primary-500 shadow-md shadow-primary-500/10'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <p className={`font-medium ${selectedUser?.id === u.id ? 'text-primary-300' : 'text-gray-200'}`}>{u.display_name || u.email}</p>
                                <p className="text-xs text-gray-500">Lv. {u.level} • {u.current_role_level}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Competency Management */}
                <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-6">
                    {!selectedUser ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>Seleziona un utente per gestire le sue competenze</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="border-b border-white/10 pb-4">
                                <h2 className="text-xl font-bold text-white">{selectedUser.display_name || selectedUser.email}</h2>
                                <p className="text-sm text-gray-400">
                                    {userCompetencies.length} competenze acquisite
                                </p>
                            </div>

                            {/* Competencies by Category */}
                            {['business', 'technical', 'design', 'management', 'general'].map(category => {
                                const categoryComps = allCompetencies.filter(c => c.category === category);
                                if (categoryComps.length === 0) return null;

                                return (
                                    <div key={category} className="space-y-3">
                                        <h3 className="font-bold text-gray-300 capitalize">{category}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {categoryComps.map(comp => {
                                                const hasComp = userCompIds.has(comp.id);
                                                return (
                                                    <div key={comp.id} className="flex items-center gap-1">
                                                        <CompetencyBadge
                                                            competency={comp}
                                                            acquired={hasComp}
                                                            size="md"
                                                        />
                                                        {hasComp ? (
                                                            <button
                                                                onClick={() => handleRemove(comp.id)}
                                                                disabled={loading}
                                                                className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 bg-red-900/20 rounded border border-red-500/30 hover:border-red-500/50 transition-colors"
                                                                title="Rimuovi"
                                                            >
                                                                ✕
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleAssign(comp.id)}
                                                                disabled={loading}
                                                                className="text-green-400 hover:text-green-300 text-xs font-bold px-2 py-1 bg-green-900/20 rounded border border-green-500/30 hover:border-green-500/50 transition-colors"
                                                                title="Assegna"
                                                            >
                                                                +
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
