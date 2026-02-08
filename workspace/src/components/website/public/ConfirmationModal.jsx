import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-arq-bg border border-arq-glassBorder rounded-2xl p-8 max-w-md w-full shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="text-yellow-500" size={32} />
                        </div>

                        <h3 className="text-2xl font-bold mb-4">Attenzione</h3>

                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Stai per lasciare il sito dell'Associazione e verrai reindirizzato alla piattaforma <strong>ARQtype App</strong>.
                        </p>

                        <p className="text-sm text-gray-400 mb-8 bg-white/5 p-4 rounded-lg border border-white/10">
                            ⚠️ Nota: Questo è un sito esterno diverso. Non sarà possibile tornare direttamente alla vetrina dell'Associazione tramite navigazione interna.
                        </p>

                        <div className="flex w-full gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors font-medium text-gray-300"
                            >
                                Annulla
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 px-6 py-3 rounded-lg bg-arq-accent hover:bg-arq-accent/80 transition-colors font-bold text-white shadow-lg shadow-arq-accent/20"
                            >
                                Procedi
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
