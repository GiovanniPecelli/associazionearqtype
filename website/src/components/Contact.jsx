import React from 'react';
import { Send, Mail, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contatti" className="py-24 relative bg-gradient-to-b from-arq-bg to-black">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <span className="text-arq-accent tracking-widest uppercase text-sm font-bold">Contattaci</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-8">Parliamo del Futuro</h2>
                        <p className="text-gray-300 mb-12 text-lg font-light leading-relaxed">
                            Siamo sempre alla ricerca di nuove collaborazioni, idee e progetti.
                            Se sei interessato alle nostre attività o vuoi proporre una partnership, scrivici direttamente.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-gray-300">
                                <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-arq-accent">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Sede Operativa</h4>
                                    <p>Terni (Umbria)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-arq-primary/20 rounded-full flex items-center justify-center text-arq-primary mb-6 animate-pulse">
                            <Mail size={40} />
                        </div>

                        <h3 className="text-2xl font-bold mb-2">Scrivici una Email</h3>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            Clicca il pulsante qui sotto per aprire il tuo client di posta predefinito e inviarci un messaggio.
                        </p>

                        <div className="w-full bg-white/5 p-4 rounded-xl border border-white/10 mb-8">
                            <code className="text-arq-accent font-mono text-sm md:text-base break-all">
                                associazione.arqtype@protonmail.com
                            </code>
                        </div>

                        <a
                            href="mailto:associazione.arqtype@protonmail.com"
                            className="w-full bg-arq-primary text-white font-bold py-4 rounded-lg hover:bg-arq-primary/80 transition-all flex items-center justify-center gap-2 shadow-lg shadow-arq-primary/25 transform hover:scale-[1.02]"
                        >
                            Invia Email <Send size={18} />
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Contact;
