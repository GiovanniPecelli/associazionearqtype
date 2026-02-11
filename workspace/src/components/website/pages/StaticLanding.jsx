import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BookOpen, Share2, Microscope, Users,
    Rocket, Heart, MapPin, Mail, Send, Menu, X
} from 'lucide-react';

const StaticNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        setIsOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#030305]/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/assets/arqtype_logo.png" alt="ARQtype Logo" className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="h-6 w-px bg-white/20"></div>
                        <span className="text-white font-semibold tracking-wide text-sm group-hover:text-indigo-400 transition-colors">
                            Associazione ARQtype
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5 space-x-1">
                    {['home', 'hub', 'attività', 'team', 'contatti'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollTo(item)}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-all capitalize"
                        >
                            {item}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-white/10 mx-2" />
                    <Link to="/login" className="px-5 py-2 bg-white text-black hover:bg-gray-200 rounded-full transition-all text-sm font-bold shadow-lg hover:scale-105">
                        Accedi
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white p-2">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 py-4 flex flex-col items-center space-y-4 shadow-2xl">
                    {['home', 'hub', 'attività', 'team', 'contatti'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollTo(item)}
                            className="text-gray-300 hover:text-white capitalize text-lg"
                        >
                            {item}
                        </button>
                    ))}
                    <Link to="/login" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">
                        Accedi
                    </Link>
                </div>
            )}
        </nav>
    );
};

const StaticLanding = () => {
    return (
        <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            <StaticNavbar />

            {/* HERO SECTION */}
            <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-20 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030305] to-[#030305]">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 border border-white/10 text-sm tracking-widest mb-8 text-indigo-300 backdrop-blur-sm">
                            Associazione Culturale ARQtype
                        </span>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-tight text-white drop-shadow-2xl">
                            Costruiamo il Futuro <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">
                                Digitale Consapevole
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                            Promuoviamo una cultura critica, etica e pratica delle tecnologie emergenti e dell'intelligenza artificiale.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/statuto" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                Leggi lo Statuto
                            </Link>
                            <a href="#attività" className="w-full sm:w-auto px-8 py-4 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                Scopri le Attività
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTERNAL HUB SECTION */}
            <section id="hub" className="py-24 bg-[#0a0a0a] border-b border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
                                Community Hub
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Il Cuore Pulsante <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">
                                    della Nostra Community
                                </span>
                            </h2>
                            <p className="text-lg text-gray-400 mb-8 leading-relaxed font-light">
                                ARQtype non è solo un'associazione, è un ecosistema digitale.
                                Il nostro <strong>Hub Interno</strong> è lo spazio dove i membri si incontrano, collaborano e danno vita a nuove idee.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/login" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-center">
                                    Accedi all'Hub
                                </Link>
                                <Link to="/statuto" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-center">
                                    Come Partecipare
                                </Link>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { icon: Users, title: "Networking", desc: "Connettiti con professionisti." },
                                { icon: Share2, title: "Condivisione", desc: "Scambia conoscenze e risorse." },
                                { icon: Rocket, title: "Progetti", desc: "Sviluppa iniziative open-source." },
                                { icon: Heart, title: "No-Profit", desc: "Iniziative sociali e culturali." }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
                                        <item.icon size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ACTIVITIES SECTION */}
            <section id="attività" className="py-24 border-b border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-indigo-400 tracking-widest uppercase text-sm font-bold">Cosa facciamo</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-white">
                            Le Nostre <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">Attività</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: BookOpen, title: "Formazione", desc: "Corsi, workshop, laboratori." },
                            { icon: Share2, title: "Divulgazione", desc: "Produzione materiali educativi." },
                            { icon: Microscope, title: "Ricerca", desc: "Sperimentazione metodologica." },
                            { icon: Users, title: "Networking", desc: "Collaborazione interdisciplinare." }
                        ].map((activity, index) => (
                            <div key={index} className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
                                <div className="mb-6 text-indigo-400 group-hover:text-fuchsia-400 transition-colors p-4 bg-white/5 rounded-full inline-block">
                                    <activity.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-light text-sm">
                                    {activity.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section id="team" className="py-24 bg-black/30 border-b border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-white">
                            Soci <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">Fondatori</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: 'Francesco', role: 'Presidente', img: '/assets/founder1.jpg' },
                            { name: 'Emilio', role: 'Socio Fondatore', img: '/assets/co-founder2.jpg' },
                            { name: 'Giovanni', role: 'Socio Fondatore', img: '/assets/dev2.jpg' },
                            { name: 'Michele', role: 'Socio Fondatore', img: '/assets/sales2.jpg' },
                        ].map((member, index) => (
                            <div key={index} className="text-center group flex flex-col items-center">
                                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl mb-6 border border-white/10 group-hover:border-indigo-500/50 transition-all">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Member' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-6">
                                        <span className="text-indigo-400 font-bold drop-shadow-md">{member.role}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold">{member.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contatti" className="py-24 bg-gradient-to-b from-[#030305] to-black">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-indigo-400 tracking-widest uppercase text-sm font-bold">Contattaci</span>
                        <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-white">
                            Parliamo del <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">Futuro</span>
                        </h2>
                        <p className="text-gray-300 text-lg font-light leading-relaxed">
                            Siamo sempre alla ricerca di nuove collaborazioni, idee e progetti.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
                        {/* Map Card */}
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-indigo-400 shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Sede Legale</h3>
                                    <p className="text-gray-400">Terni, Galleria del Corso 7</p>
                                </div>
                            </div>
                            <div className="mt-auto">
                                <a
                                    href="https://maps.app.goo.gl/YourMapLinkHere"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full block text-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
                                >
                                    Apri su Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col h-full items-center text-center">
                            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-6">
                                <Mail size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Scrivici una Email</h3>
                            <a
                                href="mailto:associazionearqtype@protonmail.com"
                                className="mt-6 w-full px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                                Invia Email <Send size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <StaticFooter />
        </div>
    );
};

const StaticFooter = () => {
    return (
        <footer className="py-12 border-t border-white/5 bg-black text-left">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto border-b border-white/5 pb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">ARQtype Association</h3>
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
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-6 text-xs text-gray-600 mb-4">
                    <Link to="/statuto" className="hover:text-indigo-400 transition-colors">Statuto</Link>
                    <Link to="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                    <Link to="/cookie-policy" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link>
                </div>

                <div className="text-xs text-gray-700 text-center">
                    &copy; {new Date().getFullYear()} ARQtype Association. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default StaticLanding;
