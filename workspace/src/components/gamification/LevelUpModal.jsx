import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../context/GamificationContext';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

export function LevelUpModal() {
    const { showLevelUp, closeLevelUp, stats } = useGamification();
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!showLevelUp) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />

                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={closeLevelUp}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.5, opacity: 0, y: 50 }}
                    className="relative bg-gray-900 border-2 border-primary-500 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl overflow-hidden"
                >
                    {/* Glow Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-500/20 blur-3xl rounded-full pointer-events-none"></div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg border-4 border-white/10"
                    >
                        <span className="text-4xl font-black text-white">{stats.level}</span>
                    </motion.div>

                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-wider">
                        Level Up!
                    </h2>
                    <p className="text-gray-300 mb-6 text-lg">
                        Congratulations! You've reached <span className="text-primary-400 font-bold">{stats.roleLevel}</span>.
                    </p>

                    <div className="bg-gray-800/50 rounded-lg p-4 mb-8 border border-gray-700">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">New Unlocks</h3>
                        <ul className="text-left space-y-2">
                            <li className="flex items-center text-gray-200">
                                <span className="mr-2 text-green-400">✓</span> New Training Modules
                            </li>
                            <li className="flex items-center text-gray-200">
                                <span className="mr-2 text-green-400">✓</span> Store Items
                            </li>
                            <li className="flex items-center text-gray-200">
                                <span className="mr-2 text-green-400">✓</span> +500 Impact Points Bonus
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={closeLevelUp}
                        className="w-full py-3 px-6 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                    >
                        Awesome!
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
