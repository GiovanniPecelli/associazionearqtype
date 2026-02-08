import React from 'react';
import { motion } from 'framer-motion';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { Icons } from '../components/common/Icons';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const SystemSettings = () => {
    const { isHost, loading } = useAuth();
    const { signupEnabled, toggleSignup } = useSystemSettings();

    // Double-check Host access (redundant to ProtectedRoute but safe)
    if (!loading && !isHost) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 md:p-12 pt-32 md:pt-40">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                        <Icons.Settings className="w-6 h-6" /> {/* Using Settings icon, mapped to Cog/Adjustments */}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">System Settings</h1>
                        <p className="text-gray-400 mt-1">Global configuration and access controls</p>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid gap-6">
                    {/* Public Access Control Card */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 pr-8">
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Icons.Users className="w-5 h-5 text-indigo-400" />
                                    Public Registration
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    Control whether new users can create accounts via the public sign-up page.
                                    When disabled, the sign-up form is blocked and buttons on the landing page show a "Closed" status.
                                </p>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${signupEnabled
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                    {signupEnabled ? 'Currently Active' : 'Currently Disabled'}
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                onClick={() => toggleSignup(!signupEnabled)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black ${signupEnabled ? 'bg-green-500' : 'bg-zinc-700'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition shadow-lg ${signupEnabled ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Placeholder for future settings */}
                    <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-8 opacity-50 cursor-not-allowed">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-500 mb-2 flex items-center gap-2">
                                    <Icons.Lock className="w-5 h-5" />
                                    Maintenance Mode
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Templated for future use. prevent all non-admin access.
                                </p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gray-800 text-gray-500 text-xs font-bold border border-gray-700">
                                Coming Soon
                            </div>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default SystemSettings;
