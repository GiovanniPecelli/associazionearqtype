import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
    useEffect(() => {
        document.title = "Privacy Policy | ARQtype";
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20 relative overflow-hidden">
            {/* Background Effects */}
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
                        <h1 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Privacy Policy</h1>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
                        <p className="mt-6 text-indigo-200/60 font-mono text-sm uppercase tracking-widest">Informativa sul trattamento dei dati (GDPR)</p>
                    </div>

                    <div className="space-y-12 text-gray-300 leading-relaxed text-lg font-light">
                        {/* Intro */}
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <p className="font-medium text-white">Informativa sul trattamento dei dati personali (Art. 13 Reg. UE 2016/679 - GDPR)</p>
                        </div>

                        {/* Sezione 1 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">1</span>
                                Titolare del Trattamento
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2">
                                <p className="mb-2">Il Titolare del trattamento è l'<strong>Associazione ARQtype</strong></p>
                                <ul className="list-none space-y-1 text-gray-400 text-base mt-4">
                                    <li>Sede legale: Galleria del Corso 7, 05100 Terni (TR)</li>
                                    <li>Codice Fiscale: 91088550552</li>
                                    <li>Email di contatto: <a href="mailto:associazionearqtype@protonmail.com" className="text-indigo-400 hover:text-white transition-colors underline decoration-indigo-400/30 hover:decoration-white">associazionearqtype@protonmail.com</a></li>
                                </ul>
                            </div>
                        </section>

                        {/* Sezione 2 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">2</span>
                                Finalità del Trattamento
                            </h2>
                            <div className="pl-11 space-y-4 border-l border-white/5 ml-4 py-2">
                                <p>I dati personali forniti dagli utenti attraverso questo sito o via email sono trattati esclusivamente per le seguenti finalità istituzionali:</p>
                                <ul className="grid gap-3 mt-4">
                                    {[
                                        "Gestione delle richieste di informazioni inviate volontariamente dagli utenti.",
                                        "Gestione delle procedure di ammissione a socio e del libro soci.",
                                        "Comunicazioni relative alle attività culturali ed educative dell'Associazione.",
                                        "Adempimento di obblighi legali e fiscali per gli enti del Terzo Settore."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Sezione 3 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">3</span>
                                Base Giuridica
                            </h2>
                            <div className="pl-11 grid md:grid-cols-2 gap-4 border-l border-white/5 ml-4 py-2">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-colors">
                                    <h3 className="text-white font-bold mb-2 text-lg">Consenso</h3>
                                    <p className="text-xs font-mono text-indigo-400 mb-2">Art. 6.1.a GDPR</p>
                                    <p className="text-sm text-gray-400">Per l'invio di richieste di contatto volontarie.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-colors">
                                    <h3 className="text-white font-bold mb-2 text-lg">Contratto</h3>
                                    <p className="text-xs font-mono text-indigo-400 mb-2">Art. 6.1.b GDPR</p>
                                    <p className="text-sm text-gray-400">Per le richieste di adesione all'associazione.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 md:col-span-2 hover:border-indigo-500/30 transition-colors">
                                    <h3 className="text-white font-bold mb-2 text-lg">Obbligo Legale</h3>
                                    <p className="text-xs font-mono text-indigo-400 mb-2">Art. 6.1.c GDPR</p>
                                    <p className="text-sm text-gray-400">Per la tenuta dei registri obbligatori e adempimenti fiscali.</p>
                                </div>
                            </div>
                        </section>

                        {/* Sezione 4 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">4</span>
                                Conservazione e Sicurezza
                            </h2>
                            <div className="pl-11 text-justify border-l border-white/5 ml-4 py-2">
                                <p>
                                    Il trattamento è svolto con strumenti informatici e cartacei, osservando adeguate misure di sicurezza per prevenire la perdita dei dati, usi illeciti o accessi non autorizzati.
                                    I dati <strong>non saranno diffusi</strong> né ceduti a terzi per scopi commerciali. Saranno conservati solo per il tempo necessario a conseguire gli scopi per cui sono stati raccolti.
                                </p>
                            </div>
                        </section>

                        {/* Sezione 5 */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">5</span>
                                Diritti degli Interessati
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2">
                                <p className="mb-6">
                                    Gli utenti hanno diritto di chiedere al Titolare l'accesso ai dati, la rettifica, la cancellazione, la limitazione del trattamento o di opporsi al trattamento (artt. 15-22 GDPR).
                                </p>
                                <a href="mailto:associazionearqtype@protonmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1">
                                    <span>Esercita i tuoi diritti via Email</span>
                                </a>
                            </div>
                        </section>

                        <p className="text-xs text-center text-gray-600 pt-12 mt-12 border-t border-white/5">
                            Ultimo aggiornamento: 03/01/2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
