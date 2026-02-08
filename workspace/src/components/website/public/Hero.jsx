import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-[80vh] flex items-center justify-center pt-20 bg-[#050505] border-b border-white/5">

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-sm tracking-widest mb-8 text-indigo-300">
                        Associazione Culturale ARQtype
                    </span>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-tight text-white">
                        Costruiamo il Futuro <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">
                            Digitale Consapevole
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Promuoviamo una cultura critica, etica e pratica delle tecnologie emergenti e dell'intelligenza artificiale.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/statuto" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                            Leggi lo Statuto
                        </Link>
                        <a href="#attivita" className="w-full sm:w-auto px-8 py-4 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                            Scopri le Attività
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
