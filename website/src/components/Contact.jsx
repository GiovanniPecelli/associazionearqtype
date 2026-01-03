import React from 'react';
import { Send, Mail, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contatti" className="py-24 relative bg-gradient-to-b from-arq-bg to-black">
            <div className="container mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-arq-accent tracking-widest uppercase text-sm font-bold">Contattaci</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Parliamo del Futuro</h2>
                    <p className="text-gray-300 text-lg font-light leading-relaxed">
                        Siamo sempre alla ricerca di nuove collaborazioni, idee e progetti.
                        Se sei interessato alle nostre attività o vuoi proporre una partnership, scrivici.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* Card Sede */}
                    <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-arq-accent shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Sede Operativa</h3>
                                <p className="text-gray-400">Vieni a trovarci</p>
                            </div>
                        </div>

                        <div className="mb-6 space-y-1 text-gray-300">
                            <p className="font-medium text-white">Galleria del Corso 7</p>
                            <p>Terni (Umbria)</p>
                        </div>

                        <div className="w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-inner relative mt-auto">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2929.569947844627!2d12.6416!3d42.5641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132ef4f14ad3b39d%3A0x6006f8522305545a!2sGalleria%20del%20Corso%2C%207%2C%2005100%20Terni%20TR!5e0!3m2!1sit!2sit!4v1709462400000!5m2!1sit!2sit"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Mappa Sede ARQtype"
                            ></iframe>
                        </div>
                    </div>

                    {/* Card Email */}
                    <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col h-full items-center text-center justify-center">
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
