import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const Hero = () => {
    const [showModal, setShowModal] = useState(false);

    const handleExternalLink = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const proceedToExternal = () => {
        window.open('https://arqtype.netlify.app/', '_blank', 'noopener,noreferrer');
        setShowModal(false);
    };

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-arq-bg">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-arq-primary/20 rounded-full blur-3xl filter opacity-50 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-arq-accent/10 rounded-full blur-3xl filter opacity-30" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-arq-glass border border-arq-glassBorder text-xs tracking-widest uppercase mb-6 text-arq-accent">
                        Associazione ARQtype
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
                        ARQ<span className="text-gradient">type</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
                        Promuoviamo una cultura critica, etica e consapevole delle tecnologie digitali e dell'intelligenza artificiale.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/statuto" className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                            Leggi lo Statuto
                        </Link>
                        <button onClick={handleExternalLink} className="px-8 py-4 glass text-white font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            Vai alla App ARQtype <span className="text-xl">↗</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={proceedToExternal}
            />
        </section>
    );
};

export default Hero;
