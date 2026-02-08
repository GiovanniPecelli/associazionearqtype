import React, { useEffect } from 'react';
import { statuteData } from '../data/statuteData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatutePage = () => {
    useEffect(() => {
        document.title = "Statuto Sociale | ARQtype";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects (Same as Hero) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-white transition-colors mb-8 group bg-white/5 pl-2 pr-4 py-2 rounded-full border border-white/5 hover:border-white/20">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Torna alla Home</span>
                </Link>

                <div className="p-8 md:p-12 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl animate-fade-in-up">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Statuto Sociale</h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
                        <p className="mt-6 text-indigo-200/60 font-mono text-sm uppercase tracking-widest">Documento Ufficiale • Versione Integrale</p>
                    </div>

                    <div className="space-y-8 text-gray-300 leading-relaxed font-light text-lg">
                        {statuteData.map((paragraph, index) => {
                            // Enhanced heuristic
                            const isArt = paragraph.trim().startsWith('Art.');
                            const isTitle = paragraph === paragraph.toUpperCase() && paragraph.length < 100 && paragraph.length > 5;

                            if (isArt) {
                                return (
                                    <div key={index} className="pt-8 pb-2">
                                        <h3 className="text-xl text-white font-bold border-l-4 border-indigo-500 pl-4">{paragraph}</h3>
                                    </div>
                                );
                            }

                            if (isTitle) {
                                return <h4 key={index} className="text-lg text-white font-semibold pt-4 text-center opacity-90">{paragraph}</h4>;
                            }

                            return <p key={index} className="text-gray-400 leading-8">{paragraph}</p>;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatutePage;
