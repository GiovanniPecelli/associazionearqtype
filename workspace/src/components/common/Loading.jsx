import React from 'react';

export const Loading = ({ fullScreen = true, message = "Loading..." }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
        : "w-full h-full min-h-[50vh] flex flex-col items-center justify-center";

    return (
        <div className={containerClasses}>
            <div className="relative">
                {/* Simplified Spinner */}
                <div className="w-12 h-12 border-4 border-violet-500/10 border-t-violet-500 rounded-full animate-spin"></div>
            </div>

            {message && (
                <div className="mt-8 text-violet-200/50 text-sm font-medium tracking-widest uppercase animate-pulse">
                    {message}
                </div>
            )}
        </div>
    );
};
