import React from 'react';

export function DynamicBackground({ variant = 'default' }) {
    // Configurations for each variant
    const variants = {
        default: (
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#c0672a]/5 blur-[120px] mix-blend-multiply" />
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1a2b4b]/5 blur-[150px] mix-blend-multiply" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/50 blur-[150px] mix-blend-multiply" />
            </>
        ),
        workflows: (
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 opacity-90" />
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1a2b4b]/5 blur-[150px] rounded-full mix-blend-multiply animate-float-1" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#c0672a]/5 blur-[150px] rounded-full mix-blend-multiply animate-float-2" />
                <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full mix-blend-multiply animate-float-3" />
            </>
        ),
        documents: ( // "Web Source"
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-gray-50 opacity-90" />
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-100/40 blur-[130px] rounded-full mix-blend-multiply animate-float-1" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-teal-100/30 blur-[130px] rounded-full mix-blend-multiply animate-float-2" />
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-blue-50/50 blur-[100px] rounded-full mix-blend-multiply animate-float-3" />
            </>
        ),
        career: ( // "Career"
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-gray-50 opacity-90" />
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#c0672a]/10 blur-[140px] rounded-full mix-blend-multiply animate-float-1" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1a2b4b]/5 blur-[140px] rounded-full mix-blend-multiply animate-float-2" />
                <div className="absolute top-[40%] left-[30%] w-[50%] h-[50%] bg-amber-100/30 blur-[120px] rounded-full mix-blend-multiply animate-float-3" />
            </>
        ),
        landing: (
            // Ultra-lightweight variant for mobile performance
            <div className="absolute inset-0 bg-white">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-80" />
            </div>
        )
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-0 bg-gray-50 overflow-hidden">
            {/* Active Variant */}
            {variants[variant] || variants.default}

            {/* Global Noise Texture - Reduced opacity for light mode */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay brightness-100 contrast-125"></div>
        </div>
    );
}
