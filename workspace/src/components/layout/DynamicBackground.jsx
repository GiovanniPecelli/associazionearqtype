import React from 'react';

export function DynamicBackground({ variant = 'default' }) {
    // Configurations for each variant
    const variants = {
        default: (
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c14] via-[#0f0e16] to-[#050505]" />
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-slate-400/5 blur-[120px] mix-blend-overlay" />
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-violet-900/10 blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-950/20 blur-[150px] mix-blend-screen" />
            </>
        ),
        workflows: (
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] opacity-80" />
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/30 blur-[150px] rounded-full mix-blend-screen animate-float-1" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-fuchsia-900/30 blur-[150px] rounded-full mix-blend-screen animate-float-2" />
                <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen animate-float-3" />
            </>
        ),
        documents: ( // "Web Source" - Knowledge/Data Theme (Teal/Emerald)
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#022c22] via-[#020617] to-[#020617] opacity-90" />
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 blur-[130px] rounded-full mix-blend-screen animate-float-1" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-teal-900/20 blur-[130px] rounded-full mix-blend-screen animate-float-2" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-sky-800/20 blur-[100px] rounded-full mix-blend-screen animate-float-3" />
            </>
        ),
        career: ( // "Career" - Growth/Success Theme (Amber/Blue)
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#020617] opacity-90" />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/10 blur-[140px] rounded-full mix-blend-screen animate-float-1" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/30 blur-[140px] rounded-full mix-blend-screen animate-float-2" />
                <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen animate-float-3" />
            </>
        )
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-0 bg-[#020617] overflow-hidden">
            {/* Active Variant */}
            {variants[variant] || variants.default}

            {/* Global Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay brightness-100 contrast-150"></div>
        </div>
    );
}
