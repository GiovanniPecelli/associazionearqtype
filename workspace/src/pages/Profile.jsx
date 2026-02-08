import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCompetencies } from '../hooks/useCompetencies';
import { CompetencyGrid } from '../components/competencies/CompetencyGrid';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';
import { Icons } from '../components/common/Icons';

const CAREER_LEVELS = [
    { level: 1, role: 'Collaborator L1', color: 'from-blue-400 to-blue-600', icon: <Icons.Seed className="w-8 h-8" /> },
    { level: 2, role: 'Collaborator L2', color: 'from-cyan-400 to-blue-500', icon: <Icons.Star className="w-8 h-8" /> },
    { level: 3, role: 'Collaborator L3', color: 'from-purple-400 to-indigo-600', icon: <Icons.Diamond className="w-8 h-8" /> },
    { level: 4, role: 'Collaborator L4', color: 'from-pink-400 to-purple-600', icon: <Icons.Rocket className="w-8 h-8" /> },
    { level: 5, role: 'Collaborator L5', color: 'from-orange-400 to-red-500', icon: <Icons.Target className="w-8 h-8" /> },
    { level: 6, role: 'Coordinator L1', color: 'from-yellow-400 to-orange-500', icon: <Icons.Building className="w-8 h-8" /> },
    { level: 7, role: 'Coordinator L2', color: 'from-purple-500 to-pink-600', icon: <Icons.Lightning className="w-8 h-8" /> },
    { level: 8, role: 'Referent', color: 'from-emerald-400 to-green-600', icon: <Icons.Medal className="w-8 h-8" /> },
    { level: 9, role: 'Leadership', color: 'from-amber-300 to-yellow-600', icon: <Icons.Crown className="w-8 h-8" /> }
];

export default function Profile() {
    const { user, profile } = useAuth();
    const { allCompetencies, fetchUserCompetencies } = useCompetencies();
    const [userCompetencies, setUserCompetencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadUserCompetencies = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const comps = await fetchUserCompetencies(user.id);
            setUserCompetencies(comps);
        } catch (error) {
            console.error('Error loading competencies:', error);
            setUserCompetencies([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id, fetchUserCompetencies]);

    useEffect(() => {
        loadUserCompetencies();
    }, [loadUserCompetencies]);

    // Determine current level data
    const currentLevel = CAREER_LEVELS.find(l => l.level === (profile?.level || 1)) || CAREER_LEVELS[0];

    return (
        <PageTransition className="max-w-4xl mx-auto space-y-6">
            <SEO title="My Profile" description="Manage your profile, skills, and view your gamification progress." />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
            </div>

            {/* Profile Info Card */}
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-6 relative overflow-hidden">
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${currentLevel.color} opacity-10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2`}></div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                    {/* Unique Level Avatar/Badge */}
                    <div className="relative">
                        <div className={`h-32 w-32 rounded-2xl bg-gradient-to-br ${currentLevel.color} p-1 shadow-lg shadow-primary-500/20`}>
                            <div className="h-full w-full bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center flex-col border border-white/10">
                                <div className="mb-1 text-white">{currentLevel.icon}</div>
                                <span className="text-xs font-bold text-white/50 uppercase">Level</span>
                                <span className="text-2xl font-black text-white">{profile?.level || 1}</span>
                            </div>
                        </div>
                        {/* Initials Badge Overlay */}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                            {profile?.display_name ? profile.display_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {profile?.display_name || 'User'}
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base break-all mb-4">{user?.email}</p>

                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r ${currentLevel.color} text-white shadow-lg`}>
                                {currentLevel.role}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900/50 text-purple-200 border border-purple-500/30">
                                {profile?.current_role_level || 'Member'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                    <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">About Me</h3>
                    {profile?.bio ? (
                        <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                    ) : (
                        <p className="text-gray-500 italic">No bio available. Go to settings to add one.</p>
                    )}
                </div>

                {/* Skills Section */}
                <div className="mt-6 relative z-10">
                    <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">Skills</h3>
                    {profile?.skills ? (
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.split(',').map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-white/5 text-gray-200 text-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                    {skill.trim()}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No skills listed.</p>
                    )}
                </div>
            </div>

            {/* Gamification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-6 group hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Impact Points</p>
                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-1">{profile?.vibe_points || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <Icons.Diamond className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-6 group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Experience</p>
                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-1">{profile?.xp || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Icons.Star className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-6 group hover:border-green-500/30 transition-all">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-400">Tasks Completed</p>
                            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mt-1">
                                {(profile?.tasks_completed_simple || 0) + (profile?.tasks_completed_medium || 0) + (profile?.tasks_completed_hard || 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                            <Icons.Check className="w-6 h-6 text-green-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Competencies Section */}
            <div className="bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-lg border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Competencies</h3>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading competencies...</p>
                    </div>
                ) : allCompetencies.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">
                            <Icons.Info className="w-5 h-5 inline mr-2 align-middle text-gray-500" /> Competency system is not available yet.
                            <br />
                            <span className="text-sm text-gray-500">Please migrate the database to enable it.</span>
                        </p>
                    </div>
                ) : (
                    <CompetencyGrid
                        userCompetencies={userCompetencies}
                        allCompetencies={allCompetencies}
                        showLocked={true}
                    />
                )}
            </div>
        </PageTransition>
    );
}
