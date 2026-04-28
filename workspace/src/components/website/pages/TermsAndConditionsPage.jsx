import React, { useEffect, Fragment } from 'react';
import { ScrollText, Users, ShieldAlert, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../PublicNavbar';

const TermsAndConditionsPage = () => {
    useEffect(() => {
        document.title = "Termini e Condizioni | ARQtype";
        window.scrollTo(0, 0);
    }, []);

    return (
        <Fragment>
            <PublicNavbar showBackButton={true} backTo="/" />
            <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                {/* Back button handled by PublicNavbar */}

                <div className="text-center">
                    <img 
                        src="/assets/logonobg.png"
                        alt="ARQtype Association"
                        className="h-16 w-auto mx-auto mb-8"
                    />
                    <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Termini e Condizioni</h1>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full" />
                    <p className="mt-6 text-indigo-200/60 font-mono text-sm uppercase tracking-widest">Regolamento d'uso del servizio</p>
                </div>

                <div className="space-y-12 text-gray-300 leading-relaxed text-lg font-light">
                    {/* Intro */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <p className="font-medium text-white">
                            Benvenuto in Associazione ARQtype. L'accesso e l'utilizzo di questo sito e dei servizi associati sono regolati dai presenti Termini e Condizioni.
                        </p>
                    </div>

                        {/* Sezione 1: Natura dell'Associazione */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">1</span>
                                Natura dell'Associazione
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2">
                                <p className="mb-4">
                                    L'<strong>Associazione ARQtype</strong> è un'associazione culturale non riconosciuta, senza fini di lucro, disciplinata dagli artt. 36 e seguenti del Codice Civile.
                                </p>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
                                    <div className="min-w-[40px] text-indigo-400">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            L'Associazione promuove la cultura digitale e l'uso consapevole dell'intelligenza artificiale. Non svolge attività commerciale come finalità prevalente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Sezione 2: Adesione e Membership */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">2</span>
                                Adesione e Membership
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2 space-y-4">
                                <p>
                                    L'accesso a determinati servizi, aree riservate o attività formative può essere subordinato all'iscrizione all'Associazione in qualità di Socio Ordinario o Aderente.
                                </p>
                                <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-300">
                                    <li>L'ammissione è subordinata all'accettazione da parte del Consiglio Direttivo.</li>
                                    <li>La qualifica di socio è personale e non trasmissibile.</li>
                                    <li>Il mancato rispetto dello Statuto o dei regolamenti interni può comportare l'esclusione.</li>
                                </ul>
                            </div>
                        </section>

                        {/* Sezione 3: Limitazione di Responsabilità */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">3</span>
                                Limitazioni di Responsabilità
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-colors">
                                    <h3 className="text-white font-bold mb-2 text-lg flex items-center gap-2">
                                        <ShieldAlert size={20} className="text-orange-400" />
                                        Esclusione di Garanzie
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-4">
                                        I contenuti, i materiali formativi e le informazioni fornite tramite il sito sono offerti "così come sono", senza alcuna garanzia implicita o esplicita di idoneità per scopi specifici.
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        L'Associazione non è responsabile per eventuali danni diretti o indiretti derivanti dall'uso delle informazioni o dei software condivisi a scopo didattico.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Sezione 4: Proprietà Intellettuale */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">4</span>
                                Proprietà Intellettuale
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2 text-justify">
                                <p>
                                    Tutti i contenuti originali (testi, grafiche, loghi, codice, video) presenti sul sito sono di proprietà dell'Associazione ARQtype o dei rispettivi autori e sono protetti dalle leggi sul diritto d'autore.
                                </p>
                                <p className="mt-4">
                                    È vietata la riproduzione, distribuzione o utilizzo commerciale non autorizzato dei materiali. L'uso per scopi personali, educativi e di studio è incoraggiato, citando la fonte.
                                </p>
                            </div>
                        </section>

                        {/* Sezione 5: Tutela dei Minori */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">5</span>
                                Tutela dei Minori
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2 text-justify">
                                <p>
                                    L'Associazione pone particolare attenzione alla tutela dei minori negli ambienti digitali (Art. 5-ter Statuto).
                                </p>
                                <p className="mt-4">
                                    L'accesso ai servizi da parte di minori di 14 anni richiede il consenso esplicito dei genitori o tutori legali. Ci impegniamo a mantenere un ambiente sicuro, privo di contenuti inappropriati e discriminatori.
                                </p>
                            </div>
                        </section>

                        {/* Sezione 6: Foro Competente e Modifiche */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm border border-indigo-500/30">6</span>
                                Modifiche e Legge Applicabile
                            </h2>
                            <div className="pl-11 border-l border-white/5 ml-4 py-2">
                                <div className="flex gap-4 items-start">
                                    <div className="min-w-[40px] text-indigo-400 mt-1">
                                        <Gavel size={24} />
                                    </div>
                                    <div className="space-y-4">
                                        <p>
                                            Ci riserviamo il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno efficaci dal momento della pubblicazione su questa pagina.
                                        </p>
                                        <p>
                                            Per qualsiasi controversia sarà competente in via esclusiva il Foro di Terni, luogo in cui ha sede legale l'Associazione. Tale scelta è determinata dalla necessità di radicare il contenzioso nel territorio in cui l'Ente svolge la propria attività prevalente, salvo quanto inderogabilmente previsto dalla legge a tutela del consumatore (es. foro del consumatore).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <p className="text-xs text-center text-gray-600 pt-12 mt-12 border-t border-white/5">
                            Ultimo aggiornamento: 17/03/2026
                        </p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TermsAndConditionsPage;
