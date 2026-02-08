import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from '../common/Icons';
import Button from '../common/Button';

const LandingNavbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <header
                className="fixed top-0 left-0 w-full z-[100] px-6 md:px-[48px] flex justify-between items-center h-[80px] bg-[#050505]/20 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/20"
            >
                {/* Logo & Branding */}
                <a href="https://arqtype.it" className="flex items-center gap-[12px] hover:opacity-80 transition-opacity">
                    <img
                        src="/arqtype_logo.png"
                        alt="Associazione ARQtype"
                        fetchpriority="high"
                        width="128"
                        height="36"
                        className="h-[36px] w-auto opacity-90 object-contain"
                    />

                    {/* Vertical Divider */}
                    <div className="h-6 w-px bg-white/20" />

                    {/* Project Name */}
                    <span className="text-lg font-light tracking-[0.2em] text-white/80">
                        Associazione ARQtype
                    </span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <a
                        href="https://arqtype.it"
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    >
                        <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold text-white tracking-wider">Back to ARQtype</span>
                    </a>

                    {/* Separator */}
                    <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

                    <Link to="/login">
                        <span className="text-xs font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer">
                            Log In
                        </span>
                    </Link>
                    <Link to="/signup">
                        <Button className="bg-white text-black hover:bg-gray-200 border-none font-bold text-xs px-6 py-2.5 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all transform hover:scale-105 active:scale-95 tracking-wide uppercase">
                            Initialize
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-36 px-6 md:hidden flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-4">
                            <a
                                href="https://arqtype.it"
                                className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 border border-white/10 active:scale-95 transition-transform"
                            >
                                <ArrowLeft className="w-5 h-5 text-indigo-400" />
                                <span className="text-lg font-bold text-white tracking-wider">Back to ARQtype</span>
                            </a>

                            <div className="h-px w-full bg-white/10 my-2" />

                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <div className="w-full px-6 py-4 rounded-xl text-center text-gray-300 hover:text-white hover:bg-white/5 transition-all text-lg font-medium tracking-wide border border-transparent hover:border-white/10">
                                    LOG IN
                                </div>
                            </Link>

                            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full px-6 py-4 rounded-xl bg-white text-black font-bold text-lg tracking-widest uppercase shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 transition-transform">
                                    INITIALIZE SYSTEM
                                </button>
                            </Link>
                        </div>

                        {/* Decorative bottom element */}
                        <div className="mt-auto mb-12 flex justify-center opacity-30">
                            <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;
