import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0a0a0a]">
            {/* Background Effects: Brighter & Alive */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Main Light Source (Top Left) */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[120px]" />

                {/* Secondary Light Source (Bottom Right) */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px]" />

                {/* Center Accent Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-radial from-indigo-500/5 via-transparent to-transparent blur-3xl" />

                {/* Grid Texture */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-lg tracking-widest mb-8 text-indigo-300 backdrop-blur-sm shadow-lg shadow-indigo-500/10">
                        Associazione Culturale ARQtype
                    </span>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-tight text-white drop-shadow-2xl">
                        Costruiamo il Futuro <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
                            Digitale Consapevole
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                        Promuoviamo una cultura critica, etica e pratica delle tecnologie emergenti e dell'intelligenza artificiale.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/statuto" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Leggi lo Statuto
                        </Link>
                        <a href="#attivita" className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2">
                            Scopri le Attività
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
