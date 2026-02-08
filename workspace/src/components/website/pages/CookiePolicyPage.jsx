import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Server, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../public/SEO';

const CookiePolicyPage = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <SEO
                title="Cookie Policy"
                description="Informativa sull'uso dei cookie dell'Associazione ARQtype. Uso esclusivo di cookie tecnici."
                canonical="/cookie-policy"
            />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-white transition-colors mb-8 group bg-white/5 pl-2 pr-4 py-2 rounded-full border border-white/5 hover:border-white/20">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Torna alla Home</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-8 md:p-12 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl"
                >
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Cookie Policy</h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
                        <p className="mt-6 text-indigo-200/60 font-mono text-sm uppercase tracking-widest">Informativa sull'uso dei cookie</p>
                    </div>

                    <div className="space-y-12 text-gray-300 leading-relaxed text-lg font-light">

                        <div className="text-xl font-light leading-relaxed text-center text-white/90">
                            <p>
                                Questa informativa spiega cosa sono i cookie e come li utilizziamo.
                                In breve: utilizziamo <strong>solo ed esclusivamente</strong> cookie tecnici necessari.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                                <div className="mb-4 text-emerald-400 p-3 bg-emerald-400/10 rounded-full">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="text-white font-bold mb-2">Solo Tecnici</h3>
                                <p className="text-sm text-gray-400">Usiamo solo cookie strettamente necessari per far funzionare il sito.</p>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                                <div className="mb-4 text-indigo-400 p-3 bg-indigo-400/10 rounded-full">
                                    <Server size={32} />
                                </div>
                                <h3 className="text-white font-bold mb-2">No Profilazione</h3>
                                <p className="text-sm text-gray-400">Non tracciamo le tue abitudini di navigazione per scopi commerciali.</p>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                                <div className="mb-4 text-rose-400 p-3 bg-rose-400/10 rounded-full">
                                    <Ban size={32} />
                                </div>
                                <h3 className="text-white font-bold mb-2">Zero Marketing</h3>
                                <p className="text-sm text-gray-400">Niente pubblicità o cookie di terze parti invasivi.</p>
                            </div>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Cosa sono i cookie?</h2>
                            <p className="text-gray-400 text-justify">
                                I cookie sono piccoli file di testo salvati sul tuo dispositivo quando visiti un sito.
                                Servono a ricordare le tue azioni e preferenze (come il login o la lingua) per un certo periodo di tempo,
                                così non devi reinserirle ogni volta.
                            </p>
                        </section>

                        <section className="bg-white/5 p-8 rounded-2xl border border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <ShieldCheck size={120} />
                            </div>
                            <h2 className="text-2xl font-bold text-indigo-400 mb-6 relative z-10">Dettaglio Cookie Utilizzati</h2>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                        Cookie Tecnici / Essenziali
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-300">
                                        Questi cookie sono indispensabili per navigare nel sito e utilizzare le sue funzionalità.
                                        Senza di essi, il sito web non potrebbe funzionare correttamente.
                                        <br /><span className="text-xs text-indigo-300/70 mt-2 block font-mono">Base giuridica: Esecuzione del contratto / Legittimo interesse.</span>
                                    </p>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div>
                                    <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
                                        Cookie di Terze Parti
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-300">
                                        Non utilizziamo servizi di terze parti che installano cookie di profilazione o marketing (es. Facebook Pixel).
                                        Eventuali embed (es. Google Maps) sono configurati per minimizzare il tracciamento ove possibile.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Gestione delle Preferenze</h2>
                            <p className="mb-4">
                                Poiché utilizziamo solo cookie tecnici, non è richiesto un banner di consenso preventivo.
                                Tuttavua, puoi sempre disabilitare i cookie dalle impostazioni del tuo browser:
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm mt-6">
                                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors border border-indigo-500/30 px-4 py-2 rounded-lg hover:bg-white/5">Chrome</a>
                                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors border border-indigo-500/30 px-4 py-2 rounded-lg hover:bg-white/5">Firefox</a>
                                <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-white transition-colors border border-indigo-500/30 px-4 py-2 rounded-lg hover:bg-white/5">Safari</a>
                            </div>
                        </section>

                        <p className="text-xs text-center text-gray-600 pt-12 mt-12 border-t border-white/5">
                            Ultimo aggiornamento: 03/01/2026
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CookiePolicyPage;
