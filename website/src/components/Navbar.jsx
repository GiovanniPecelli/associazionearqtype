import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';

    // Get workspace URL from environment variable
    const WORKSPACE_URL = import.meta.env.VITE_WORKSPACE_URL || 'http://localhost:5174';

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
                            <a href="#attivita" onClick={() => setIsOpen(false)} className="text-sm font-medium hover:text-arq-accent transition-colors">Activities</a>
                            <Link to="/statuto" className="text-sm font-medium hover:text-arq-accent transition-colors">Statute</Link>
                            <a href="#contatti" onClick={() => setIsOpen(false)} className="text-sm font-medium hover:text-arq-accent transition-colors">Contact</a>
                            <a
                                href={`${WORKSPACE_URL}/login`}
                                className="px-4 py-2 bg-arq-accent/20 hover:bg-arq-accent/30 text-arq-accent border border-arq-accent/50 rounded-lg transition-all text-sm font-medium"
                            >
                                Sign In
                            </a>
                        </>
                    ) : (
                        <Link to="/" className="text-sm font-medium hover:text-arq-accent transition-colors">Back to Home</Link>
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
                            <a href="#attivita" onClick={() => setIsOpen(false)} className="text-sm hover:text-arq-accent">Activities</a>
                            <Link to="/statuto" className="text-sm hover:text-arq-accent" onClick={() => setIsOpen(false)}>Statute</Link>
                            <a href="#contatti" onClick={() => setIsOpen(false)} className="text-sm hover:text-arq-accent">Contact</a>
                            <a
                                href={`${WORKSPACE_URL}/login`}
                                className="px-4 py-2 bg-arq-accent/20 hover:bg-arq-accent/30 text-arq-accent border border-arq-accent/50 rounded-lg transition-all text-sm font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </a>
                        </>
                    ) : (
                        <Link to="/" className="text-sm hover:text-arq-accent" onClick={() => setIsOpen(false)}>Back to Home</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
