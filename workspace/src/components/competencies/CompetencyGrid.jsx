import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CompetencyBadge } from './CompetencyBadge';
import { Icons } from '../common/Icons';

export function CompetencyGrid({ userCompetencies = [], allCompetencies = [], showLocked = true }) {
    const [filter, setFilter] = useState('all');
    const [filteredCompetencies, setFilteredCompetencies] = useState([]);

    const userCompetencyIds = useMemo(
        () => new Set(userCompetencies.map(uc => uc.competency_id)),
        [userCompetencies]
    );

    useEffect(() => {
        let filtered = allCompetencies;

        if (filter !== 'all') {
            filtered = filtered.filter(c => c.category === filter);
        }

        if (!showLocked) {
            filtered = filtered.filter(c => userCompetencyIds.has(c.id));
        }

        setFilteredCompetencies(filtered);
    }, [filter, allCompetencies, showLocked, userCompetencyIds]);

    const categories = [
        { value: 'all', label: 'Tutte', icon: <Icons.Star className="w-4 h-4" /> },
        { value: 'technical', label: 'Tecniche', icon: <Icons.Code className="w-4 h-4" /> },
        { value: 'design', label: 'Design', icon: <Icons.Palette className="w-4 h-4" /> },
        { value: 'management', label: 'Management', icon: <Icons.Chart className="w-4 h-4" /> },
        { value: 'general', label: 'Generali', icon: <Icons.Lightning className="w-4 h-4" /> }
    ];

    const acquiredCount = allCompetencies.filter(c => userCompetencyIds.has(c.id)).length;

    return (
        <div className="space-y-4">
            {/* Stats */}
            <div className="bg-gradient-to-r from-primary-900/40 to-purple-900/40 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">Le Tue Competenze</h3>
                        <p className="text-sm text-gray-400">
                            {acquiredCount} di {allCompetencies.length} competenze acquisite
                        </p>
                    </div>
                    <div className="text-3xl font-bold text-primary-600">
                        {Math.round((acquiredCount / allCompetencies.length) * 100)}%
                    </div>
                </div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                        style={{ width: `${(acquiredCount / allCompetencies.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setFilter(cat.value)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${filter === cat.value
                            ? 'bg-primary-900/50 text-white border-2 border-primary-500 shadow-lg shadow-primary-500/20'
                            : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/30 hover:bg-white/10'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Competencies Grid */}
            {filteredCompetencies.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-gray-400">Nessuna competenza trovata</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {filteredCompetencies.map(competency => {
                        const userComp = userCompetencies.find(uc => uc.competency_id === competency.id);
                        const acquired = !!userComp;

                        return (
                            <div key={competency.id} className="group relative">
                                <CompetencyBadge
                                    competency={competency}
                                    acquired={acquired}
                                    size="md"
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs shadow-lg">
                                        <p className="font-bold">{competency.name}</p>
                                        <p className="text-gray-300 mt-1">{competency.description}</p>
                                        {acquired && userComp && (
                                            <p className="text-gray-400 mt-1 text-[10px]">
                                                Acquisita: {new Date(userComp.acquired_at).toLocaleDateString()} ({userComp.acquired_via})
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

CompetencyGrid.propTypes = {
    userCompetencies: PropTypes.arrayOf(PropTypes.shape({
        competency_id: PropTypes.string.isRequired,
        acquired_at: PropTypes.string,
        acquired_via: PropTypes.string
    })),
    allCompetencies: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string,
        category: PropTypes.string
    })),
    showLocked: PropTypes.bool
};
