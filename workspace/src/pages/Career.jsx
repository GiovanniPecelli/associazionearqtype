import { motion } from 'framer-motion';
import { useGamification } from '../context/GamificationContext';
import SEO from '../components/common/SEO';
import PageTransition from '../components/common/PageTransition';
import { Icons } from '../components/common/Icons';

const CAREER_LEVELS = [
    {
        level: 1,
        role: 'Collaborator L1',
        requirements: 'Basic Training + 3 Simple Tasks',
        unlocks: ['Basic Access', 'Level 1 Store'],
        color: 'from-blue-400 to-blue-600',
        icon: <Icons.Seed className="w-8 h-8" />,
        cardBg: 'from-blue-900/40 to-blue-800/40 border-blue-500/50',
        iconBg: 'from-blue-500 to-blue-600'
    },
    {
        level: 2,
        role: 'Collaborator L2',
        requirements: 'L2 Training + 5 Simple + 5 Medium Tasks',
        unlocks: ['Level 2 Store', 'Badge "Rising Star"'],
        color: 'from-cyan-400 to-blue-500',
        icon: <Icons.Star className="w-8 h-8" />,
        cardBg: 'from-cyan-900/40 to-blue-900/40 border-cyan-500/50',
        iconBg: 'from-cyan-400 to-blue-500'
    },
    {
        level: 3,
        role: 'Collaborator L3',
        requirements: 'L3 Training + 10 Medium Tasks',
        unlocks: ['Level 3 Store', 'Advanced Community Access'],
        color: 'from-purple-400 to-indigo-600',
        icon: <Icons.Diamond className="w-8 h-8" />,
        cardBg: 'from-purple-900/40 to-indigo-900/40 border-purple-500/50',
        iconBg: 'from-purple-400 to-indigo-600'
    },
    {
        level: 4,
        role: 'Collaborator L4',
        requirements: 'L4 Training + 15 Medium Tasks',
        unlocks: ['Level 4 Store', 'Advanced Community Access'],
        color: 'from-pink-400 to-purple-600',
        icon: <Icons.Rocket className="w-8 h-8" />,
        cardBg: 'from-pink-900/40 to-purple-900/40 border-pink-500/50',
        iconBg: 'from-pink-400 to-purple-600'
    },
    {
        level: 5,
        role: 'Collaborator L5',
        requirements: 'Workflow Proposal',
        unlocks: ['Can propose Workflows', 'If approved → Become Coordinator'],
        color: 'from-orange-400 to-red-500',
        icon: <Icons.Target className="w-8 h-8" />,
        cardBg: 'from-orange-900/40 to-red-900/40 border-orange-500/50',
        iconBg: 'from-orange-400 to-red-500'
    },
    {
        level: 6,
        role: 'Coordinator L1',
        requirements: '1 Approved Workflow',
        unlocks: ['Workflow Creation', 'Coordinator Store', 'HR Access'],
        warning: 'If no workflow approved for a period → Demotion to Collaborator L4',
        color: 'from-yellow-400 to-orange-500',
        icon: <Icons.Building className="w-8 h-8" />,
        cardBg: 'from-yellow-900/40 to-orange-900/40 border-yellow-500/50',
        iconBg: 'from-yellow-400 to-orange-500'
    },
    {
        level: 7,
        role: 'Coordinator L2',
        requirements: '3 Approved Workflows + 1 Generating Income',
        unlocks: ['DIRECT contact with Board', 'Elite Store', 'Status "ARQTYPE Image"'],
        color: 'from-purple-500 to-pink-600', // Swapped from Gold to Purple
        icon: <Icons.Lightning className="w-8 h-8" />, // Lightning theme
        cardBg: 'from-purple-900/40 to-pink-900/40 border-purple-500/50',
        iconBg: 'from-purple-500 to-pink-600'
    },
    {
        level: 8,
        role: 'Referent',
        requirements: 'Specific Application',
        unlocks: ['Collaborator Manager', 'Coordinator Manager', 'Sales Department'],
        color: 'from-emerald-400 to-green-600',
        icon: <Icons.Medal className="w-8 h-8" />,
        cardBg: 'from-emerald-900/40 to-green-900/40 border-emerald-500/50',
        iconBg: 'from-emerald-400 to-green-600'
    },
    {
        level: 9,
        role: 'Leadership',
        requirements: 'Association Board Role (President, Secretary, Treasurer, Counselor)',
        unlocks: ['Full Platform Access', 'All Administrative Powers', 'Elite Status'],

        color: 'from-amber-300 to-yellow-600', // Swapped from Purple to Gold
        icon: <Icons.Crown className="w-8 h-8" />, // Crown
        cardBg: 'from-amber-900/40 to-yellow-900/40 border-yellow-500/50',
        iconBg: 'from-amber-300 to-yellow-600'
    }
];

export default function Career() {
    const { stats } = useGamification();

    // Determine current level config for dynamic styling
    // Try to match by level number first, then fallback to role matching
    const currentLevelConfig = CAREER_LEVELS.find(l => l.level === stats.level) ||
        CAREER_LEVELS.find(l => l.role === stats.roleLevel) ||
        CAREER_LEVELS[0];

    // Check if user is in an Elite role that maps to Leadership (Level 9)
    const isElite = ['president', 'secretary', 'treasurer', 'counselor', 'host elite'].includes(stats.roleLevel?.toLowerCase());
    // If elite, force Level 9 styling, otherwise use the found level config
    const activeConfig = isElite ? CAREER_LEVELS.find(l => l.level === 9) : currentLevelConfig;

    return (
        <PageTransition className="min-h-screen bg-transparent py-6 sm:py-12 px-4">
            <SEO
                title="Career Path"
                description="Level up your career from Tasker to Elite roles. Clear path for growth and rewards."
            />
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent mb-3">
                            YOUR CAREER PATH
                        </h1>
                        <p className="text-base sm:text-xl text-gray-400">
                            Level up to unlock new powers and rewards
                        </p>
                    </motion.div>

                    {/* Current Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`mt-6 inline-block rounded-2xl shadow-lg p-4 sm:p-6 border backdrop-blur-sm bg-gradient-to-br ${activeConfig.cardBg}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-lg bg-gradient-to-br text-white ${activeConfig.iconBg}`}>
                                {activeConfig.icon}
                            </div>
                            <div className="text-left">
                                <div className="text-xs sm:text-sm font-semibold text-gray-400 uppercase">Current Level</div>
                                <div className={`text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${activeConfig.color}`}>
                                    {stats.roleLevel}
                                </div>
                                <div className="text-xs sm:text-sm text-primary-400 font-medium mt-1">
                                    {stats.xp} / {stats.nextLevelXp} XP
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical Line - Hidden on mobile, shown on desktop */}
                    <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200 rounded-full" />

                    <div className="space-y-4 sm:space-y-6">
                        {CAREER_LEVELS.map((level, index) => {
                            const isUnlocked = stats.level >= level.level;
                            const isCurrent = stats.level === level.level;
                            const isNext = stats.level + 1 === level.level;

                            return (
                                <motion.div
                                    key={level.level}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative"
                                >
                                    {/* Mobile & Desktop Layout */}
                                    <div className="flex gap-3 sm:gap-6">
                                        {/* Level Badge */}
                                        <div className="flex-shrink-0 relative">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCurrent
                                                ? 'bg-gray-900 border-4 border-primary-500 scale-110 shadow-[0_0_30px_rgba(14,165,233,0.4)]'
                                                : isUnlocked
                                                    ? `bg-gradient-to-br ${level.color} border-4 border-white/10 shadow-lg`
                                                    : isNext
                                                        ? 'bg-white/5 border-4 border-dashed border-white/20 shadow-sm'
                                                        : 'bg-black/20 border-4 border-white/5 opacity-50'
                                                }`}>
                                                {isUnlocked ? (
                                                    <div className="text-white">{level.icon}</div>
                                                ) : isNext ? (
                                                    <div className="opacity-50 grayscale">{level.icon}</div>
                                                ) : (
                                                    <Icons.Lock className="w-8 h-8 opacity-30" />
                                                )}
                                            </div>
                                            {isCurrent && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <Icons.Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Card */}
                                        <div className={`flex-1 rounded-2xl p-4 sm:p-6 transition-all duration-300 ${isCurrent
                                            ? 'bg-gray-900/80 border-2 border-primary-500 shadow-xl shadow-primary-500/10 ring-4 ring-primary-500/20 backdrop-blur-xl'
                                            : isUnlocked
                                                ? 'bg-gray-900/60 border border-white/10 shadow-lg hover:shadow-xl backdrop-blur-sm'
                                                : isNext
                                                    ? 'bg-white/5 border border-dashed border-white/10 shadow-sm'
                                                    : 'bg-black/20 border border-white/5 opacity-60'
                                            }`}>
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className={`text-xl sm:text-2xl font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'
                                                        }`}>
                                                        {level.role}
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            Level {level.level}
                                                        </span>
                                                        {isCurrent && (
                                                            <span className="px-2 py-0.5 bg-primary-900/50 text-primary-300 border border-primary-500/30 text-xs font-bold rounded-full">
                                                                CURRENT
                                                            </span>
                                                        )}
                                                        {isNext && (
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                                NEXT
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Requirements */}
                                            <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-gray-400 uppercase">Requirements</span>
                                                    {isUnlocked && <Icons.Check className="w-4 h-4 text-green-400" />}
                                                </div>
                                                <p className="text-sm sm:text-base text-gray-300 font-medium">
                                                    {level.requirements}
                                                </p>
                                            </div>

                                            {/* Unlocks */}
                                            <div className="mb-3">
                                                <span className="text-xs font-bold text-gray-400 uppercase block mb-2">
                                                    🔓 Unlocks
                                                </span>
                                                <ul className="space-y-1.5">
                                                    {level.unlocks.map((unlock, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                                                            <span className="text-primary-500 mt-0.5">•</span>
                                                            <span className={`font-medium ${isUnlocked ? 'text-primary-300' : 'text-gray-500'
                                                                }`}>
                                                                {unlock}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Warning */}
                                            {level.warning && (
                                                <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                                                    <div className="flex items-start gap-2">
                                                        <Icons.Exclamation className="w-4 h-4 text-red-400 mt-0.5" />
                                                        <p className="text-xs sm:text-sm text-red-300 font-medium">
                                                            {level.warning}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 text-center p-6 sm:p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-white/10"
                >
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Keep Grinding! <Icons.Trophy className="w-6 h-6 inline-block text-yellow-500 ml-2" /></h3>
                    <p className="text-sm sm:text-base text-gray-200">
                        Complete tasks and training to level up faster
                    </p>
                </motion.div>
            </div>
        </PageTransition>
    );
}
