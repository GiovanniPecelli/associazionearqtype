import React from 'react';

export function WorkflowBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[#020617] overflow-hidden">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] opacity-80" />

            {/* Moving Spotlights - "More Light Play" */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-cyan-900/30 blur-[150px] rounded-full mix-blend-screen animate-float-1" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-fuchsia-900/30 blur-[150px] rounded-full mix-blend-screen animate-float-2" />
            <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen animate-float-3" />

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay brightness-100 contrast-150"></div>
        </div>
    );
}
