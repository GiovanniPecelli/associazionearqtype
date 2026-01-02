import React from 'react';

const Footer = () => {
    return (
        <footer id="contatti" className="py-12 border-t border-white/5 bg-black">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-2xl font-bold mb-8">Associazione Culturale ARQtype</h3>

                <div className="flex flex-col md:flex-row justify-center gap-12 mb-12 text-sm text-gray-400">
                    <div>
                        <h4 className="text-white font-semibold mb-2">Sede Legale</h4>
                        <p>Terni (TR)</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-2">Contatti</h4>
                        <p>associazione.arqtype@protonmail.com</p>
                    </div>
                </div>

                <div className="text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} ARQtype. Tutti i diritti riservati.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
