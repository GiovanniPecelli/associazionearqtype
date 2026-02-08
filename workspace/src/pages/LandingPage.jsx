import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Workflows, Chat, Trophy, Target, Shield, Chart } from '../components/common/Icons';
import LandingNavbar from '../components/layout/LandingNavbar';

const LandingPage = () => {
    // Scroll Progress for subtle parallax
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const heroY = useTransform(scrollY, [0, 300], [0, 100]);

    return (
        <div className="relative min-h-screen bg-[#030303] text-white font-sans overflow-hidden w-full flex flex-col selection:bg-fuchsia-500/30">

            {/* Background Effects: Deep Atmospheric Lab Vibe */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Mobile Optimized Background (Simple Gradient) */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505] md:hidden" />

                {/* Subtle Grid - "Blueprint" feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 md:opacity-100" />

                {/* Palette Glows: Indigo/Fuchsia (Desktop Only) */}
                <div className="hidden md:block absolute top-[-20%] left-[20%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="hidden md:block absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-fuchsia-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow delay-1000" />
            </div>

            {/* HUD Header - Fixed "Command Deck" Style */}
            <LandingNavbar />

            {/* Main Content Area - Centered Hub Presentation */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center pt-44 pb-12 px-6 w-full max-w-7xl mx-auto">

                {/* Hero Section */}
                <motion.div
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="text-center w-full max-w-4xl mb-24"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-tight text-white pb-4">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white pr-2">
                                Associazione ARQtype
                            </span>
                        </h1>

                        <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-fuchsia-500 mx-auto rounded-full mb-8" />

                        <p className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-2xl mx-auto leading-relaxed mb-10">
                            Advanced Workflows. Specialized Laboratories. <br className="hidden md:block" />
                            A closed-loop ecosystem for high-precision execution.
                        </p>

                        <Link to="/signup">
                            <button className="px-8 py-4 bg-white text-black font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform duration-300 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                Enter System
                            </button>
                        </Link>

                        <p className="mt-6 text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-500/30 hover:decoration-indigo-400 transition-colors">
                                Log In
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>

                {/* Interface Preview Grid - App-like Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <AppModule
                        title="WORKFLOW ENGINE"
                        subtitle="Kanban & Task Management"
                        icon={<Workflows />}
                        gradient="from-indigo-500/20 to-blue-500/5"
                    />
                    <AppModule
                        title="COMM-LINK"
                        subtitle="Encrypted Real-time Uplink"
                        icon={<Chat />}
                        gradient="from-fuchsia-500/20 to-purple-500/5"
                    />
                    <AppModule
                        title="PROGRESSION"
                        subtitle="Clearance & Reputation"
                        icon={<Trophy />}
                        gradient="from-emerald-500/20 to-teal-500/5"
                    />
                </div>

            </main>

            {/* EXPANDED CONTENT: SYSTEM FILES */}
            <section className="relative z-10 w-full pb-32 px-6 max-w-7xl mx-auto space-y-32">

                {/* 1. MISSION OBJECTIVE (DATA FILE) */}
                <DataFile
                    id="001"
                    title="MISSION_OBJECTIVE"
                    subtitle="Operational Precision Protocol"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-indigo-400" />
                                    The Problem
                                </h3>
                                <p className="text-gray-400 leading-relaxed font-light text-sm">
                                    Standard freelance models are noisy. Variable quality, endless negotiation, and administrative lag degrade the final output.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                    The Solution
                                </h3>
                                <p className="text-gray-400 leading-relaxed font-light text-sm">
                                    <span className="text-indigo-400">Associazione ARQtype</span> is a <strong>Closed Operational Economy</strong>. We don't just match talent; we engineer the entire workflow for zero-loss execution.
                                </p>
                            </div>
                        </div>

                        {/* Visual Efficiency Monitor */}
                        <div className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <Chart className="w-12 h-12 text-white/5" />
                            </div>

                            <h4 className="text-xs font-mono text-gray-500 mb-6 tracking-widest uppercase">System Efficiency Comparison</h4>

                            <div className="space-y-6">
                                {/* Standard Model */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500">Standard Market Noise</span>
                                        <span className="text-red-400">High Latency</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500/20 w-[80%]" />
                                    </div>
                                </div>

                                {/* Associazione ARQtype Model */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white font-bold">Associazione ARQtype Precision</span>
                                        <span className="text-indigo-400">Optimized</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "95%" }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                                <div className="text-xs font-mono text-emerald-500 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    SYSTEM_OPTIMIZED
                                </div>
                                <span className="text-2xl font-bold text-white tracking-tighter">300% <span className="text-xs font-normal text-gray-500">EFFICIENCY</span></span>
                            </div>
                        </div>
                    </div>
                </DataFile>

                {/* 2. INTERNAL STRUCTURE (BLUEPRINT) */}
                <DataFile
                    id="002"
                    title="SYSTEM_ARCHITECTURE"
                    subtitle="Hierarchical Execution Flow"
                >
                    <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                        <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-xl">
                            <h4 className="text-fuchsia-400 font-bold mb-2">01. ARCHITECTS</h4>
                            <p className="text-xs text-gray-500 mb-4">STRATEGY & DESIGN</p>
                            <p className="text-sm text-gray-300">
                                Maintainers of the Vision. They define project parameters, set bounties, and validate final output.
                            </p>
                        </div>

                        <div className="flex items-center justify-center text-gray-700 hidden md:flex">
                            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>

                        <div className="p-6 bg-[#0a0a0a] border border-white/5 rounded-xl">
                            <h4 className="text-indigo-400 font-bold mb-2">02. OPERATORS</h4>
                            <p className="text-xs text-gray-500 mb-4">EXECUTION & DEPLOYMENT</p>
                            <p className="text-sm text-gray-300">
                                Specialized units. Selected for specific domain expertise. They execute bounties with autonomy and precision.
                            </p>
                        </div>
                    </div>
                </DataFile>

                {/* 3. GAMIFICATION (INCENTIVE LAYER) */}
                <DataFile
                    id="003"
                    title="INCENTIVE_LAYER"
                    subtitle="Meritocratic Ascension Algorithms"
                >
                    <div className="space-y-8">
                        <p className="text-xl md:text-2xl font-light text-white text-center max-w-2xl mx-auto">
                            "Contribution is the only currency."
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBlock label="XP GAIN" value="Automated" desc="Per Task Completion" />
                            <StatBlock label="CLEARANCE" value="Lvl 1++" desc="Access Sensitive Labs" />
                            <StatBlock label="BOUNTIES" value="Exclusive" desc="High-Value Unlocks" />
                            <StatBlock label="REPUTATION" value="Immutable" desc="On-Chain Logic" />
                        </div>
                    </div>
                </DataFile>

            </section>

            {/* FINAL CTA: READY TO EXECUTE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative z-10 pb-32 flex flex-col items-center text-center px-6"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 relative z-10">
                    Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Execute ?</span>
                </h2>

                <Link to="/signup" className="relative z-10">
                    <button className="group relative px-12 py-6 bg-white text-black font-bold text-lg md:text-xl tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform duration-300 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 opacity-20 group-hover:opacity-40 transition-opacity duration-300 animate-gradient-x" />
                        <span className="relative z-10 flex items-center gap-3">
                            INITIATE PROTOCOL
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </span>
                    </button>
                </Link>

                <p className="mt-8 text-gray-500 font-mono text-xs relative z-10">
                    SYSTEM ACCESS REQUIRES VERIFICATION
                </p>
            </motion.div>

            {/* Bottom Status Bar - Replaces Footer */}


        </div>
    );
};

// "App Module" Card - Looks like an internal tool widget
const AppModule = ({ title, subtitle, icon, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="group relative h-64 p-8 rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden flex flex-col justify-between hover:border-white/10 transition-all duration-300"
    >
        {/* Subtle Gradient Back */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative z-10">
            <div className="w-10 h-10 mb-6 rounded-lg bg-white/5 flex items-center justify-center text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 transition-all duration-300 whitespace-nowrap">{title}</h3>
            <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-white/10 group-hover:bg-white/30 transition-colors" />
    </motion.div>
);

// "System File" Layout Component
const DataFile = ({ id, title, subtitle, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="border-l-2 border-white/10 pl-4 md:pl-12 relative"
    >
        <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#050505] border-2 border-white/20" />

        <div className="mb-8">
            <span className="text-xs font-mono text-gray-600 mb-2 block tracking-widest">MODULE_{id}</span>
            <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase">{title}</h2>
            <p className="text-indigo-400 font-mono text-sm tracking-wider">{subtitle}</p>
        </div>

        <div className="prose prose-invert max-w-none">
            {children}
        </div>
    </motion.div>
);

const StatBlock = ({ label, value, desc }) => (
    <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-center transition-colors hover:bg-white/10">
        <p className="text-xs font-mono text-gray-500 mb-2">{label}</p>
        <p className="text-xl font-bold text-white mb-1">{value}</p>
        <p className="text-[10px] text-gray-400">{desc}</p>
    </div>
);

export default LandingPage;
