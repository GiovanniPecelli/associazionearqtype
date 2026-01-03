import React from 'react';

const Footer = () => {
    return (
        <footer id="contatti" className="py-12 border-t border-white/5 bg-black">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8 mb-12 text-left max-w-4xl mx-auto border-b border-white/5 pb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">ASSOCIAZIONE ARQTYPE</h3>
                        <p className="text-sm text-gray-400 mb-1"><strong>Associazione senza scopo di lucro</strong></p>
                        <p className="text-sm text-gray-400 mb-1">Codice Fiscale: [In fase di assegnazione]</p>
                        <p className="text-sm text-gray-400">Sede: Galleria del Corso 7, Terni (TR)</p>
                        <p className="text-sm text-gray-400">Email: associazione.arqtype@protonmail.com</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-2 font-bold">Informativa Legale</p>
                        <p className="text-xs text-gray-500 leading-relaxed text-justify">
                            L'Associazione Arqtype è un ente senza scopo di lucro costituito ai sensi degli articoli 36-38 del Codice Civile italiano.
                            L'associazione NON svolge attività commerciale e non ha rapporti economici con soggetti profit.
                            Le attività dell'associazione sono esclusivamente culturali, educative e di promozione sociale, ai sensi del D.Lgs. 117/2017.
                            L'Associazione opera in totale autonomia e non intrattiene rapporti stabili organici con società di capitali o enti profit.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-6 text-xs text-gray-600 mb-4">
                    <a href="/statuto" className="hover:text-arq-accent transition-colors">Statuto</a>
                    <a href="/privacy-policy" className="hover:text-arq-accent transition-colors">Privacy Policy</a>
                    <a href="/cookie-policy" className="hover:text-arq-accent transition-colors">Cookie Policy</a>
                </div>

                <div className="text-xs text-gray-700 text-center">
                    &copy; {new Date().getFullYear()} Associazione Arqtype. Tutti i diritti riservati.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
