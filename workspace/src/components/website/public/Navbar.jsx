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
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/assets/arqtype_logo.png" alt="ARQtype Logo" className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="h-6 w-px bg-white/20"></div>
                        <span className="text-white font-semibold tracking-wide text-sm group-hover:text-arq-accent transition-colors">
                            Associazione ARQtype
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-1 items-center bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5">
                    {isHome ? (
                        <>
                            <NavItem href="#hub" onClick={() => scrollToSection('hub')}>Hub</NavItem>
                            <NavItem href="#attivita" onClick={() => scrollToSection('attivita')}>Attività</NavItem>
                            <NavItem to="/statuto">Statuto</NavItem>
                            <NavItem href="#contatti" onClick={() => scrollToSection('contatti')}>Contatti</NavItem>

                            <div className="w-px h-4 bg-white/10 mx-2" />

                            <Link
                                to="/login"
                                className="px-5 py-2 bg-white text-black hover:bg-gray-200 rounded-full transition-all text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
                            >
                                Accedi
                            </Link>
                        </>
                    ) : (
                        <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Torna alla Home</Link>
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
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-arq-accent/20 hover:bg-arq-accent/30 text-arq-accent border border-arq-accent/50 rounded-lg transition-all text-sm font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Sign In
                            </Link>
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

const NavItem = ({ children, to, href, onClick }) => {
    const className = "relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group cursor-pointer";

    // Internal Link
    if (to) {
        return (
            <Link to={to} className={className}>
                {children}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
        );
    }

    // Anchor Link
    return (
        <a href={href} onClick={(e) => { e.preventDefault(); onClick && onClick(); }} className={className}>
            {children}
            <span className="absolute bottom-1 left-4 right-4 h-px bg-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </a>
    );
};
