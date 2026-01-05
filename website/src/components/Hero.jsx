import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
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
                    <span className="inline-block py-1 px-3 rounded-full bg-arq-glass border border-arq-glassBorder text-sm tracking-widest mb-6 text-arq-accent">
                        Associazione Culturale ARQtype
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight py-2 pr-2">
                        Associazione ARQ<span className="text-gradient">type</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
                        Promuoviamo una cultura critica, etica e consapevole delle tecnologie digitali e dell'intelligenza artificiale.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/statuto" className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                            Leggi lo Statuto
                        </Link>
                        <button onClick={() => document.getElementById('attivita').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 glass text-white font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            Scopri le Attività
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
