import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        if (!isHome) return;
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
        }
    };

    const handleExternalLink = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const proceedToExternal = () => {
        window.open('https://arqtype.netlify.app/', '_blank', 'noopener,noreferrer');
        setShowModal(false);
    };

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/assets/arqtype_logo.png" alt="ARQtype Logo" className="h-10 w-auto" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {isHome ? (
                            <>
                                <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-arq-accent transition-colors">Home</button>
                                <button onClick={() => scrollToSection('attivita')} className="text-sm font-medium hover:text-arq-accent transition-colors">Attività</button>
                                <Link to="/statuto" className="text-sm font-medium hover:text-arq-accent transition-colors">Statuto</Link>
                                <button onClick={() => scrollToSection('contatti')} className="text-sm font-medium hover:text-arq-accent transition-colors">Contatti</button>
                            </>
                        ) : (
                            <Link to="/" className="text-sm font-medium hover:text-arq-accent transition-colors">Torna alla Home</Link>
                        )}
                        <button onClick={handleExternalLink} className="text-sm font-bold bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all border border-white/5 cursor-pointer">
                            App ARQtype ↗
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden glass absolute top-full left-0 w-full py-4 flex flex-col items-center space-y-4 shadow-lg border-t border-white/10">
                        {isHome ? (
                            <>
                                <button onClick={() => scrollToSection('home')} className="text-sm hover:text-arq-accent">Home</button>
                                <button onClick={() => scrollToSection('attivita')} className="text-sm hover:text-arq-accent">Attività</button>
                                <Link to="/statuto" className="text-sm hover:text-arq-accent" onClick={() => setIsOpen(false)}>Statuto</Link>
                                <button onClick={() => scrollToSection('contatti')} className="text-sm hover:text-arq-accent">Contatti</button>
                            </>
                        ) : (
                            <Link to="/" className="text-sm hover:text-arq-accent" onClick={() => setIsOpen(false)}>Torna alla Home</Link>
                        )}
                        <button onClick={handleExternalLink} className="text-sm font-bold text-arq-accent border border-arq-accent/30 px-4 py-1 rounded-full">App ARQtype ↗</button>
                    </div>
                )}
            </nav>
            <ConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={proceedToExternal}
            />
        </>
    );
};

export default Navbar;
