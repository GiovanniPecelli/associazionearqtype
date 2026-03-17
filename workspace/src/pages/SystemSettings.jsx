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
        <div className="min-h-screen bg-[#f8fafc] text-[#1a2b4b] p-8 md:p-12 pt-32 md:pt-40">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="flex items-center gap-6 mb-12 border-b border-gray-200 pb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#c0672a]/10 flex items-center justify-center border border-[#c0672a]/20 text-[#c0672a] shadow-sm">
                        <Icons.Settings className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[#1a2b4b] tracking-tight">Impostazioni di Sistema</h1>
                        <p className="text-gray-500 mt-1">Configurazione globale e controlli di accesso</p>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid gap-6">
                    {/* Public Access Control Card */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 pr-8">
                                <h3 className="text-2xl font-black text-[#1a2b4b] mb-4 flex items-center gap-3">
                                    <Icons.Users className="w-6 h-6 text-[#c0672a]" />
                                    Registrazione Pubblica
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                    Control whether new users can create accounts via the public sign-up page.
                                    When disabled, the sign-up form is blocked and buttons on the landing page show a "Closed" status.
                                </p>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${signupEnabled
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    }`}>
                                    {signupEnabled ? 'Attualmente Attivo' : 'Attualmente Disabilitato'}
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                onClick={() => toggleSignup(!signupEnabled)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#c0672a] focus:ring-offset-2 focus:ring-offset-[#f8fafc] ${signupEnabled ? 'bg-[#c0672a]' : 'bg-gray-300'
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
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm opacity-50 cursor-not-allowed">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-400 mb-2 flex items-center gap-2">
                                    <Icons.Lock className="w-5 h-5" />
                                    Modalità Manutenzione
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Presto disponibile: impedisce l'accesso ai non-admin.
                                </p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold border border-gray-200 uppercase tracking-wider">
                                In Arrivo
                            </div>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default SystemSettings;
