import React from 'react';
import SEO from './SEO';

const PrivacyPolicy = () => {
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-arq-accent selection:text-white">
            <SEO
                title="Privacy Policy"
                description="Informativa sul trattamento dei dati personali dell'Associazione ARQtype (GDPR)."
                canonical="/privacy-policy"
            />
            <div className="container mx-auto px-6 pt-36 pb-20 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-arq-accent leading-tight">Privacy Policy</h1>

                <div className="space-y-12 text-gray-300 leading-relaxed text-lg">
                    {/* Intro */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <p className="font-medium text-white">Informativa sul trattamento dei dati personali (Art. 13 Reg. UE 2016/679 - GDPR)</p>
                    </div>

                    {/* Sezione 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-arq-primary/20 text-arq-primary text-sm">1</span>
                            Titolare del Trattamento
                        </h2>
                        <div className="pl-11">
                            <p className="mb-2">Il Titolare del trattamento è l'<strong>Associazione ARQtype</strong></p>
                            <ul className="list-none space-y-1 text-gray-400 text-base">
                                <li>Sede legale: Galleria del Corso 7, 05100 Terni (TR)</li>
                                <li>Codice Fiscale: 91088550552</li>
                                <li>Email di contatto: <a href="mailto:associazionearqtype@protonmail.com" className="text-arq-accent hover:text-white transition-colors underline decoration-arq-accent/30 hover:decoration-white">associazionearqtype@protonmail.com</a></li>
                            </ul>
                        </div>
                    </section>

                    {/* Sezione 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-arq-primary/20 text-arq-primary text-sm">2</span>
                            Finalità del Trattamento
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p>I dati personali forniti dagli utenti attraverso questo sito o via email sono trattati esclusivamente per le seguenti finalità istituzionali:</p>
                            <ul className="grid gap-3">
                                {[
                                    "Gestione delle richieste di informazioni inviate volontariamente dagli utenti.",
                                    "Gestione delle procedure di ammissione a socio e del libro soci.",
                                    "Comunicazioni relative alle attività culturali ed educative dell'Associazione.",
                                    "Adempimento di obblighi legali e fiscali per gli enti del Terzo Settore."
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-arq-accent mt-2.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Sezione 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-arq-primary/20 text-arq-primary text-sm">3</span>
                            Base Giuridica
                        </h2>
                        <div className="pl-11 grid md:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2">Consenso</h3>
                                <p className="text-sm">Art. 6.1.a GDPR</p>
                                <p className="text-sm text-gray-400 mt-2">Per l'invio di richieste di contatto volontarie.</p>
                            </div>
                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                <h3 className="text-white font-bold mb-2">Contratto/Precontratto</h3>
                                <p className="text-sm">Art. 6.1.b GDPR</p>
                                <p className="text-sm text-gray-400 mt-2">Per le richieste di adesione all'associazione.</p>
                            </div>
                            <div className="bg-white/5 p-5 rounded-xl border border-white/10 md:col-span-2">
                                <h3 className="text-white font-bold mb-2">Obbligo Legale</h3>
                                <p className="text-sm">Art. 6.1.c GDPR</p>
                                <p className="text-sm text-gray-400 mt-2">Per la tenuta dei registri obbligatori e adempimenti fiscali.</p>
                            </div>
                        </div>
                    </section>

                    {/* Sezione 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-arq-primary/20 text-arq-primary text-sm">4</span>
                            Conservazione e Sicurezza
                        </h2>
                        <div className="pl-11 text-justify">
                            <p>
                                Il trattamento è svolto con strumenti informatici e cartacei, osservando adeguate misure di sicurezza per prevenire la perdita dei dati, usi illeciti o accessi non autorizzati.
                                I dati <strong>non saranno diffusi</strong> né ceduti a terzi per scopi commerciali. Saranno conservati solo per il tempo necessario a conseguire gli scopi per cui sono stati raccolti.
                            </p>
                        </div>
                    </section>

                    {/* Sezione 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-arq-primary/20 text-arq-primary text-sm">5</span>
                            Diritti degli Interessati
                        </h2>
                        <div className="pl-11">
                            <p className="mb-4">
                                Gli utenti hanno diritto di chiedere al Titolare l'accesso ai dati, la rettifica, la cancellazione, la limitazione del trattamento o di opporsi al trattamento (artt. 15-22 GDPR).
                            </p>
                            <a href="mailto:associazionearqtype@protonmail.com" className="inline-flex items-center gap-2 px-6 py-3 bg-arq-primary text-white rounded-lg font-bold hover:bg-arq-primary/80 transition-all">
                                Esercita i tuoi diritti via Email
                            </a>
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

export default PrivacyPolicy;
