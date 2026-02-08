import { useGamification } from '../../context/GamificationContext';
import { motion } from 'framer-motion';
import { Icons } from '../common/Icons';

export function GamificationHUD() {
    const { stats } = useGamification();

    // Calculate progress percentage
    const progress = Math.min((stats.xp / stats.nextLevelXp) * 100, 100);

    const isElite = ['president', 'secretary', 'treasurer', 'counselor', 'host elite'].includes(stats.roleLevel?.toLowerCase());

    return (
        <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-300 ${isElite
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-400/50 shadow-sm'
            : 'bg-white border border-gray-200 hover:border-primary-300'
            }`}>
            {/* Level Badge */}
            <div className="relative flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${isElite
                    ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white'
                    : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                    }`}>
                    {isElite ? <Icons.Crown className="w-5 h-5" /> : stats.level}
                </div>
                {/* Glow effect for elite */}
                {isElite && (
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm -z-10 animate-pulse" />
                )}
            </div>

            {/* Stats Info */}
            <div className="flex flex-col min-w-[110px]">
                {/* Role and VP */}
                <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide truncate max-w-[60px] ${isElite
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600'
                        : 'text-gray-700'
                        }`}>
                        {stats.roleLevel}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isElite
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-purple-100 text-purple-700'
                        }`}>
                        {stats.impactPoints} IP
                    </span>
                </div>

                {/* XP Bar with Label */}
                <div className="space-y-0.5">
                    <div className="flex justify-between items-center">
                        <span className={`text-[9px] font-semibold ${isElite ? 'text-amber-700' : 'text-gray-600'}`}>
                            Lv.{stats.level}
                        </span>
                        <span className={`text-[9px] font-semibold ${isElite ? 'text-amber-700' : 'text-gray-600'}`}>
                            {stats.xp}/{stats.nextLevelXp}
                        </span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden ${isElite
                        ? 'bg-gradient-to-r from-yellow-200 to-amber-200'
                        : 'bg-gray-200'
                        }`}>
                        <motion.div
                            className={`h-full ${isElite
                                ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500'
                                : 'bg-gradient-to-r from-primary-500 to-primary-600'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
