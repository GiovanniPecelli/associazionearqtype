import React from 'react';
import { ShieldCheck, Server, Ban } from 'lucide-react';
import SEO from './SEO';

const CookiePolicy = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-arq-accent selection:text-white">
            <SEO
                title="Cookie Policy"
                description="Informativa sull'uso dei cookie dell'Associazione ARQtype. Uso esclusivo di cookie tecnici."
                canonical="/cookie-policy"
            />
            <div className="container mx-auto px-6 pt-36 pb-20 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-arq-accent leading-tight">Cookie Policy</h1>

                <div className="space-y-12 text-gray-300 leading-relaxed text-lg">

                    <div className="text-xl font-light leading-relaxed">
                        <p>
                            Questa informativa spiega cosa sono i cookie e come li utilizziamo.
                            In breve: utilizziamo <strong>solo ed esclusivamente</strong> cookie tecnici necessari.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                            <div className="mb-4 text-green-400">
                                <ShieldCheck size={40} />
                            </div>
                            <h3 className="text-white font-bold mb-2">Solo Tecnici</h3>
                            <p className="text-sm text-gray-400">Usiamo solo cookie strettamente necessari per far funzionare il sito.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                            <div className="mb-4 text-gray-400">
                                <Server size={40} />
                            </div>
                            <h3 className="text-white font-bold mb-2">No Profilazione</h3>
                            <p className="text-sm text-gray-400">Non tracciamo le tue abitudini di navigazione per scopi commerciali.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                            <div className="mb-4 text-red-400">
                                <Ban size={40} />
                            </div>
                            <h3 className="text-white font-bold mb-2">Zero Marketing</h3>
                            <p className="text-sm text-gray-400">Niente pubblicità o cookie di terze parti invasivi.</p>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Cosa sono i cookie?</h2>
                        <p className="text-gray-400">
                            I cookie sono piccoli file di testo salvati sul tuo dispositivo quando visiti un sito.
                            Servono a ricordare le tue azioni e preferenze (come il login o la lingua) per un certo periodo di tempo,
                            così non devi reinserirle ogni volta.
                        </p>
                    </section>

                    <section className="bg-arq-glass p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold text-arq-accent mb-6">Dettaglio Cookie Utilizzati</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Cookie Tecnici / Essenziali
                                </h3>
                                <p className="mt-2 text-sm text-gray-300">
                                    Questi cookie sono indispensabili per navigare nel sito e utilizzare le sue funzionalità.
                                    Senza di essi, il sito web non potrebbe funzionare correttamente.
                                    <br /><span className="text-xs opacity-70 mt-1 block">Base giuridica: Esecuzione del contratto / Legittimo interesse.</span>
                                </p>
                            </div>
                            <div className="h-px bg-white/10"></div>
                            <div>
                                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
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
                            Tuttavia, puoi sempre disabilitare i cookie dalle impostazioni del tuo browser:
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-arq-accent hover:underline">Chrome</a>
                            <span className="text-gray-600">•</span>
                            <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noreferrer" className="text-arq-accent hover:underline">Firefox</a>
                            <span className="text-gray-600">•</span>
                            <a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer" className="text-arq-accent hover:underline">Safari</a>
                        </div>
                    </section>

                    <p className="text-xs text-center text-gray-600 pt-12 mt-12 border-t border-white/5">
                        Ultimo aggiornamento: 03/01/2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
