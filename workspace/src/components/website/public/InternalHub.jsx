import React from 'react';
import { motion } from 'framer-motion';
import { Users, Share2, Heart, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all hover:bg-white/[0.07] group"
    >
        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
);

const InternalHub = () => {
    return (
        <section id="hub" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-indigo-900/10 rounded-full blur-[50px] md:blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
                            Community Hub
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Il Cuore Pulsante <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                della Nostra Community
                            </span>
                        </h2>
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
                            ARQtype non è solo un'associazione, è un ecosistema digitale.
                            Il nostro <strong>Hub Interno</strong> è lo spazio dove i membri si incontrano, collaborano e danno vita a nuove idee.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/login" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-center">
                                Accedi all'Hub
                            </Link>
                            <Link to="/statuto" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-center">
                                Come Partecipare
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FeatureCard
                            icon={Users}
                            title="Networking"
                            description="Connettiti con professionisti, sviluppatori e creativi che condividono la tua passione per il digitale."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Share2}
                            title="Condivisione"
                            description="Uno spazio per scambiare conoscenze, risorse e competenze. Cresciamo insieme condividendo il sapere."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={Rocket}
                            title="Progetti"
                            description="Partecipa allo sviluppo di strumenti open-source e iniziative digitali collaborative."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Heart}
                            title="No-Profit"
                            description="Promuoviamo iniziative sociali e culturali senza scopo di lucro per il bene della comunità."
                            delay={0.4}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InternalHub;
