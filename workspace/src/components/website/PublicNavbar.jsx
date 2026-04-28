import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Globe, ChevronDown, ArrowLeft,
} from 'lucide-react';

// Brand colors
const B = '#1a2b4b';   // deep blue
const O = '#c0672a';   // warm orange
const BG = '#f7f8fc';  // light section bg

// Translations
const TR = {
  it: {
    nav: ['Visione', 'Attività', 'Team', 'Statuto', 'Contatti'],
    back: 'Torna indietro',
    backHome: 'Torna alla Home',
  },
  en: {
    nav: ['Vision', 'Activities', 'Team', 'Statute', 'Contact'],
    back: 'Go back',
    backHome: 'Back to Home',
  },
};

const NAV_IDS = ['visione', 'attivita', 'team', '/statuto', 'contatti'];

const PublicNavbar = ({ showBackButton = false, backTo = '/', lang: propLang, setLang: propSetLang }) => {
  const [lang, setLang] = useState(propLang || 'en');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const tx = TR[lang];

  // Detect if we're on a legal page
  const isLegalPage = location.pathname.startsWith('/statuto') || 
                      location.pathname === '/privacy' || 
                      location.pathname === '/cookie' || 
                      location.pathname === '/terms-and-conditions' || 
                      location.pathname === '/termini';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Sync with parent language state
  useEffect(() => {
    if (propLang && propSetLang) {
      setLang(propLang);
    }
  }, [propLang]);

  const toggleLang = () => {
    const newLang = lang === 'it' ? 'en' : 'it';
    setLang(newLang);
    if (propSetLang) {
      propSetLang(newLang);
    }
  };

  const goto = (id) => {
    setOpen(false);
    if (id.startsWith('/')) {
      window.location.href = id;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // true when floating over the dark hero (landing page, not yet scrolled)
  const onDark = !scrolled && location.pathname === '/' && !isLegalPage;

  const txtColor   = onDark ? 'rgba(255,255,255,0.82)' : '#374151';
  const hoverBg    = onDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,43,75,0.05)';
  const logoFilter = onDark ? 'brightness(0) invert(1)' : 'none';

  return (
    <nav className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
         style={{
           background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
           backdropFilter: scrolled ? 'blur(16px)' : 'none',
           borderBottom: scrolled ? `1px solid rgba(26,43,75,0.08)` : 'none',
         }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[80px]">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/assets/logonobg.png" alt="ARQtype"
               className="h-8 w-auto object-contain transition-all duration-300"
               style={{ filter: logoFilter }} />
        </Link>

        {/* Back Button (desktop) */}
        {showBackButton && (
          <div className="hidden md:flex items-center">
            <Link
              to={backTo}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
              style={{ color: B, background: 'rgba(26,43,75,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.background = `${O}18`; e.currentTarget.style.color = O; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(26,43,75,0.05)'; e.currentTarget.style.color = B; }}
            >
              <ArrowLeft size={16} />
              {tx.back}
            </Link>
          </div>
        )}

        {/* Links — desktop */}
        {!isLegalPage && location.pathname === '/' && (
          <div className="hidden md:flex items-center gap-1">
            {tx.nav.map((label, i) => (
              <button key={label} onClick={() => goto(NAV_IDS[i])}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{ color: txtColor }}
                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.color = onDark ? 'white' : B; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = txtColor; }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          {!isLegalPage && (
            <button onClick={toggleLang}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-200"
              style={{
                color: onDark ? 'rgba(255,255,255,0.55)' : B,
                background: onDark ? 'rgba(255,255,255,0.08)' : `${B}0d`,
                border: onDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                letterSpacing: '0.06em',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = onDark ? 'white' : O; e.currentTarget.style.background = onDark ? 'rgba(255,255,255,0.14)' : `${O}18`; }}
              onMouseLeave={e => {
                e.currentTarget.style.color = onDark ? 'rgba(255,255,255,0.55)' : B;
                e.currentTarget.style.background = onDark ? 'rgba(255,255,255,0.08)' : `${B}0d`;
              }}>
              <Globe size={11} />
              {lang === 'it' ? 'EN' : 'IT'}
            </button>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: onDark ? 'rgba(255,255,255,0.85)' : B }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            className="md:hidden"
            style={{
              background: onDark ? 'rgba(11,21,37,0.97)' : 'white',
              backdropFilter: onDark ? 'blur(16px)' : 'none',
              borderTop: onDark ? '1px solid rgba(255,255,255,0.07)' : `1px solid rgba(26,43,75,0.07)`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}>
            <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col">

              {/* Back button for mobile */}
              {showBackButton && (
                <Link
                  to={backTo}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-2 py-3 text-sm font-medium border-b"
                  style={{ borderColor: onDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,43,75,0.06)', color: onDark ? 'rgba(255,255,255,0.8)' : B }}
                >
                  <ArrowLeft size={16} />
                  {tx.backHome}
                </Link>
              )}

              {/* Navigation links - only on main page */}
              {!isLegalPage && location.pathname === '/' && tx.nav.map((label, i) => (
                <button key={label} onClick={() => goto(NAV_IDS[i])}
                  className="text-left px-2 py-3 text-sm font-medium border-b"
                  style={{
                    color: onDark ? 'rgba(255,255,255,0.75)' : '#374151',
                    borderColor: onDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,43,75,0.06)',
                  }}>
                  {label}
                </button>
              ))}

              {/* Language toggle for mobile */}
              {!isLegalPage && (
                <button onClick={toggleLang}
                  className="text-left px-2 py-3 text-sm font-bold flex items-center gap-2"
                  style={{ color: O }}>
                  <Globe size={14} />
                  {lang === 'it' ? 'Switch to English' : "Passa all'Italiano"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PublicNavbar;
