import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-arq-glass backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/assets/arqtype_logo.png" alt="ARQtype Logo" className="h-10 w-auto" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 items-center">
                    {isHome ? (
                        <>
                            <a href="#home" onClick={() => setIsOpen(false)} className="text-sm font-medium hover:text-arq-accent transition-colors">Home</a>
                            <a href="#attivita" onClick={() => setIsOpen(false)} className="text-sm font-medium hover:text-arq-accent transition-colors">Attività</a>
                            <Link to="/statuto" className="text-sm font-medium hover:text-arq-accent transition-colors">Statuto</Link>
                            <a href="#contatti" onClick={() => setIsOpen(false)} className="text-sm font-medium hover:text-arq-accent transition-colors">Contatti</a>
                        </>
                    ) : (
                        <Link to="/" className="text-sm font-medium hover:text-arq-accent transition-colors">Torna alla Home</Link>
                    )}
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
                <div className="md:hidden bg-[#050505]/95 backdrop-blur-xl absolute top-full left-0 w-full py-4 flex flex-col items-center space-y-4 shadow-lg border-t border-white/10">
                    {isHome ? (
                        <>
                            <a href="#home" onClick={() => setIsOpen(false)} className="text-sm hover:text-arq-accent">Home</a>
                            <a href="#attivita" onClick={() => setIsOpen(false)} className="text-sm hover:text-arq-accent">Attività</a>
                            <Link to="/statuto" className="text-sm hover:text-arq-accent" onClick={() => setIsOpen(false)}>Statuto</Link>
                            <a href="#contatti" onClick={() => setIsOpen(false)} className="text-sm hover:text-arq-accent">Contatti</a>
                        </>
                    ) : (
                        <Link to="/" className="text-sm hover:text-arq-accent" onClick={() => setIsOpen(false)}>Torna alla Home</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
