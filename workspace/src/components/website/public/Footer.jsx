import React from 'react';

const Footer = () => {
    return (
        <footer id="contatti" className="py-12 border-t border-white/5 bg-black">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8 mb-12 text-left max-w-4xl mx-auto border-b border-white/5 pb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">ARQtype Association</h3>
                        <p className="text-sm text-gray-400 mb-1"><strong>Non-profit Organization</strong></p>
                        <p className="text-sm text-gray-400 mb-1">Tax ID: 91088550552</p>
                        <p className="text-sm text-gray-400">Location: Galleria del Corso 7, Terni (TR), Italy</p>
                        <p className="text-sm text-gray-400">Email: associazionearqtype@protonmail.com</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-2 font-bold">Legal Notice</p>
                        <p className="text-xs text-gray-500 leading-relaxed text-justify">
                            ARQtype Association is a non-profit organization established under articles 36-38 of the Italian Civil Code.
                            The association does NOT conduct commercial activities and has no economic relationships with for-profit entities.
                            The association's activities are exclusively cultural, educational, and social promotion-oriented, pursuant to Legislative Decree 117/2017.
                            The Association operates with complete autonomy and does not maintain stable organic relationships with capital companies or for-profit entities.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-6 text-xs text-gray-600 mb-4">
                    <a href="/statuto" className="hover:text-arq-accent transition-colors">Statute</a>
                    <a href="/privacy-policy" className="hover:text-arq-accent transition-colors">Privacy Policy</a>
                    <a href="/cookie-policy" className="hover:text-arq-accent transition-colors">Cookie Policy</a>
                </div>

                <div className="text-xs text-gray-700 text-center">
                    &copy; {new Date().getFullYear()} ARQtype Association. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
