import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Mail, MapPin,
  FileText, Shield, Heart, Lightbulb, ArrowRight,
} from 'lucide-react';
import PublicNavbar from '../PublicNavbar';

// ─── Brand ────────────────────────────────────────────────────────────────────
const B = '#1a2b4b';   // deep blue
const O = '#c0672a';   // warm orange
const BG = '#f7f8fc';  // light section bg

// ─── Translations ─────────────────────────────────────────────────────────────
const TR = {
  it: {
    nav: ['Visione', 'Attività', 'Team', 'Statuto', 'Contatti'],
    hero: {
      badge:  'Associazione No-Profit · Terni, Italia',
      h1a:    'Intelligenza Artificiale',
      h1b:    'Etica e Sostenibile.',
      sub:    'ARQtype promuove un uso responsabile e accessibile dell\'AI per il Terzo Settore, le comunità e chiunque voglia capire il mondo digitale che ci circonda.',
      cta:    'Scopri chi siamo',
    },
    mission: {
      label:   'La nostra visione',
      heading: 'Tecnologia al servizio delle persone, non il contrario.',
      pillars: [
        { icon: 'shield', title: 'Etica',          body: 'Sistemi trasparenti, responsabili e rispettosi dei diritti fondamentali.' },
        { icon: 'heart',  title: 'Sostenibilità',  body: 'Tecnologia progettata per durare con impatto ambientale ridotto.' },
        { icon: 'bulb',   title: 'Accessibilità',  body: 'Conoscenza aperta a tutti, senza barriere economiche o tecnologiche.' },
      ],
    },
    events: {
      label:   'Attività',
      heading: 'Cosa abbiamo fatto fino a oggi',
      sub:     'Ogni progetto è un passo verso un ecosistema digitale più consapevole.',
      e1: {
        year:     '2026',
        title:    'Conferenza per il π-greco Day',
        collab:   'Con Associazione Hacklab Terni — "L\'infinito in 8 bit"',
        body:     'Abbiamo esplorato le analogie tra pi-greco e intelligenza artificiale: approssimazione, quantizzazione dei modelli, allucinazione e affidabilità dei sistemi AI. Un dialogo aperto tra matematica, filosofia e tecnologia.',
        photos:   'Foto dell\'evento',
        soon:     'Presto',
        badge1:   'Intelligenza Artificiale',
        badge1sub:'Applicazioni etiche',
        badge2:   'Matematica',
        badge2sub:'Cultura digitale',
      },
      coming: 'Altre conferenze e workshop in programma — resta aggiornato.',
    },
    team: {
      label:   'Chi siamo',
      heading: 'I Fondatori',
      sub:     'Un team multidisciplinare unito dalla convinzione che la tecnologia debba servire le persone.',
      roles:   ['Presidente', 'Co-Fondatore', 'Co-Fondatore', 'Co-Fondatore'],
    },
    contact: {
      label:   'Contatti',
      heading: 'Costruiamo qualcosa insieme.',
      sub:     'Se credi in un\'AI etica e vuoi collaborare, partecipare ai nostri eventi o semplicemente scriverci, siamo qui.',
    },
    footer: {
      tagline:  'Promuoviamo la cultura digitale attraverso ricerca, educazione e sviluppo di tecnologie AI etiche e sostenibili.',
      nav:      'Navigazione',
      docs:     'Documenti',
      terms:    'Termini e Condizioni',
      privacy:  'Privacy Policy',
      cookie:   'Cookie Policy',
      statute:  'Statuto',
      taxId:    'Codice Fiscale',
      address:  'Sede',
      rights:   'Associazione No-Profit',
      made:     'Fatto con ♥ in Italia',
    },
  },
  en: {
    nav: ['Vision', 'Activities', 'Team', 'Statute', 'Contact'],
    hero: {
      badge:  'Non-Profit Association · Terni, Italy',
      h1a:    'Artificial Intelligence',
      h1b:    'Ethical & Sustainable.',
      sub:    'ARQtype promotes responsible and accessible use of AI for the non-profit sector, communities and everyone who wants to understand the digital world around us.',
      cta:    'Discover who we are',
    },
    mission: {
      label:   'Our vision',
      heading: 'Technology in service of people, not the other way around.',
      pillars: [
        { icon: 'shield', title: 'Ethics',         body: 'Transparent, accountable systems that respect fundamental rights.' },
        { icon: 'heart',  title: 'Sustainability',  body: 'Technology designed to last, with reduced environmental impact.' },
        { icon: 'bulb',   title: 'Accessibility',   body: 'Knowledge open to all, without economic or technological barriers.' },
      ],
    },
    events: {
      label:   'Activities',
      heading: 'What we have done so far',
      sub:     'Every project is a step toward a more conscious digital ecosystem.',
      e1: {
        year:     '2026',
        title:    'Conference for π Day',
        collab:   'With Associazione Hacklab Terni — "The Infinite in 8 bits"',
        body:     'We explored the analogies between pi and artificial intelligence: approximation, model quantization, hallucination and reliability of AI systems. An open dialogue between mathematics, philosophy and technology.',
        photos:   'Event photos',
        soon:     'Soon',
        badge1:   'Artificial Intelligence',
        badge1sub:'Ethical applications',
        badge2:   'Mathematics',
        badge2sub:'Digital culture',
      },
      coming: 'More conferences and workshops planned — stay tuned.',
    },
    team: {
      label:   'Who we are',
      heading: 'The Founders',
      sub:     'A multidisciplinary team united by the conviction that technology must serve people.',
      roles:   ['President', 'Co-Founder', 'Co-Founder', 'Co-Founder'],
    },
    contact: {
      label:   'Contact',
      heading: 'Let\'s build something together.',
      sub:     'If you believe in ethical AI and want to collaborate, attend our events or simply write to us, we are here.',
    },
    footer: {
      tagline:  'We promote digital culture through research, education and development of ethical and sustainable AI technologies.',
      nav:      'Navigation',
      docs:     'Documents',
      terms:    'Terms & Conditions',
      privacy:  'Privacy Policy',
      cookie:   'Cookie Policy',
      statute:  'Statute',
      taxId:    'Tax ID',
      address:  'Address',
      rights:   'Non-Profit Organization',
      made:     'Made with ♥ in Italy',
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const up = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const sg = { visible: { transition: { staggerChildren: 0.1 } } };

const Icon = ({ name, size = 18 }) => {
  if (name === 'shield') return <Shield size={size} />;
  if (name === 'heart')  return <Heart  size={size} />;
  return <Lightbulb size={size} />;
};

const NAV_IDS = ['visione', 'attivita', 'team', '/statuto', 'contatti'];

const MEMBERS = [
  { name: 'Francesco', img: '/assets/founder1.jpg' },
  { name: 'Emilio',    img: '/assets/co-founder2.jpg' },
  { name: 'Giovanni',  img: '/assets/dev2.jpg' },
  { name: 'Michele',   img: '/assets/sales2.jpg' },
];

const PHOTOS = [
  { src: 'https://res.cloudinary.com/dtjjrr2xl/image/upload/v1777364409/Gemini_Generated_Image_pihh2tpihh2tpihh_lz694u.png', alt: 'π Day Conference' },
  { src: 'https://res.cloudinary.com/dtjjrr2xl/image/upload/v1777364408/ChatGPT_Image_27_apr_2026_21_30_47_ojx3d8.png',       alt: 'AI Conference Discussion' },
  { src: 'https://res.cloudinary.com/dtjjrr2xl/image/upload/v1777364390/Gemini_Generated_Image_zdjml0zdjml0zdjm_ydzr9q.png',   alt: 'Conference Workshop' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function StaticLanding() {
  const [lang, setLang]           = useState('en');
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const tx = TR[lang];

  // Language toggle function
  const toggleLang = () => setLang(lang === 'it' ? 'en' : 'it');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);


  const goto = (id) => {
    setOpen(false);
    if (id.startsWith('/')) { window.location.href = id; return; }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ─── NAV ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      <PublicNavbar lang={lang} setLang={setLang} />

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <section id="visione" className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: `linear-gradient(150deg, #0b1525 0%, ${B} 55%, #0e1c30 100%)` }}>

        {/* Dot-grid texture */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* Orange glow — right */}
        <div className="pointer-events-none absolute" style={{
          top: '20%', right: '-8%',
          width: '520px', height: '520px', borderRadius: '50%',
          background: `radial-gradient(circle, ${O}30 0%, transparent 65%)`,
          filter: 'blur(48px)',
        }} />

        {/* Blue glow — top left */}
        <div className="pointer-events-none absolute" style={{
          top: '-12%', left: '-6%',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,120,220,0.15) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }} />

        {/* Mobile logo watermark — centered behind text */}
        <div className="lg:hidden pointer-events-none absolute inset-0 flex items-center justify-center" style={{ opacity: 0.045 }}>
          <img src="/assets/logonobg.png" alt="" style={{ width: '72vw', maxWidth: '320px', filter: 'brightness(0) invert(1)', objectFit: 'contain' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 pt-28 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT: copy */}
            <motion.div initial="hidden" animate="visible" variants={sg}>

              {/* Badge */}
              <motion.div variants={up} className="mb-10">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ color: O, border: `1px solid ${O}50`, background: `${O}14` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: O }} />
                  {tx.hero.badge}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={up} className="mb-5">
                <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 1.04, fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>
                  {tx.hero.h1a}
                </h1>
                <h1 style={{
                  fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 1.04, fontWeight: 900, letterSpacing: '-0.02em',
                  background: `linear-gradient(90deg, ${O} 0%, #e8935a 100%)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {tx.hero.h1b}
                </h1>
              </motion.div>

              {/* Accent bar */}
              <motion.div variants={up} className="mb-7">
                <div style={{ width: '44px', height: '3px', borderRadius: '2px', background: `linear-gradient(90deg, ${O}, transparent)` }} />
              </motion.div>

              {/* Subtitle */}
              <motion.p variants={up} className="text-base leading-relaxed mb-10 max-w-[420px]"
                style={{ color: 'rgba(255,255,255,0.55)' }}>
                {tx.hero.sub}
              </motion.p>

              {/* CTA */}
              <motion.div variants={up}>
                <button
                  onClick={() => goto('visione-missione')}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base text-white w-full sm:w-auto"
                  style={{
                    background: `linear-gradient(135deg, ${O}, #b85c22)`,
                    boxShadow: `0 6px 24px ${O}44`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 10px 30px ${O}55`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 24px ${O}44`; }}
                >
                  {tx.hero.cta}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </motion.div>

            {/* RIGHT: logo with rings — desktop only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-center justify-center"
              style={{ position: 'relative' }}
            >
              {/* Concentric rings */}
              {[300, 400, 500].map((size, i) => (
                <div key={size} style={{
                  position: 'absolute',
                  width: `${size}px`, height: `${size}px`,
                  borderRadius: '50%',
                  border: `1px solid rgba(255,255,255,${0.05 - i * 0.012})`,
                }} />
              ))}
              {/* Orange ring */}
              <div style={{
                position: 'absolute', width: '260px', height: '260px', borderRadius: '50%',
                border: `1px solid ${O}28`,
              }} />

              <img
                src="/assets/logonobg.png"
                alt="ARQtype"
                style={{ width: '220px', height: '220px', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.22, position: 'relative', zIndex: 1 }}
              />
            </motion.div>

          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown size={18} style={{ color: 'rgba(255,255,255,0.22)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MISSION ───────────────────────────────────────────────────────── */}
      <section id="visione-missione" className="py-20 px-6 lg:px-10" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sg}>

            <motion.p variants={up} className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: O }}>
              {tx.mission.label}
            </motion.p>
            <motion.h2 variants={up} className="text-3xl sm:text-4xl font-black mb-8 max-w-2xl leading-tight" style={{ color: B }}>
              {tx.mission.heading}
            </motion.h2>

            <motion.div variants={sg} className="grid sm:grid-cols-3 gap-4">
              {tx.mission.pillars.map((p, i) => (
                <motion.div key={i} variants={up}
                  className="bg-white p-6 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: 'rgba(26,43,75,0.08)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px rgba(26,43,75,0.09)`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)'; }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                       style={{ background: `${O}18`, color: O }}>
                    <Icon name={p.icon} size={16} />
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: B }}>{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── EVENTS ────────────────────────────────────────────────────────── */}
      <section id="attivita" className="py-24 px-6 lg:px-10 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sg}>

            <motion.div variants={up} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-blue-50 border border-orange-100 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: O }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: O }}>
                  {tx.events.label}
                </span>
              </div>
              <motion.h2 variants={up} className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: B }}>
                {tx.events.heading}
              </motion.h2>
              <motion.p variants={up} className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {tx.events.sub}
              </motion.p>
            </motion.div>

            {/* Enhanced event card */}
            <motion.div variants={up}
              className="bg-white rounded-3xl border-2 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ borderColor: 'rgba(26,43,75,0.08)', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>

              {/* Event header with enhanced styling */}
              <div className="px-8 py-6 border-b flex items-center justify-between"
                   style={{ borderColor: 'rgba(26,43,75,0.06)', background: 'linear-gradient(135deg, rgba(26,43,75,0.02) 0%, rgba(192,103,42,0.02) 100%)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                       style={{ background: `linear-gradient(135deg, ${B}, ${O})` }}>
                    <span className="text-white font-black text-lg">π</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold px-3 py-1.5 rounded-full text-white shadow-md" style={{ background: B }}>
                      {tx.events.e1.year}
                    </span>
                    <h3 className="text-xl font-bold mt-2" style={{ color: B }}>{tx.events.e1.title}</h3>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full animate-spin" style={{ background: `linear-gradient(135deg, ${B}, ${O})` }} />
                  </div>
                </div>
              </div>

              <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Photos — professional state-based slideshow */}
                <div className="w-full">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-3 text-center" style={{ color: `${B}66` }}>
                    {tx.events.e1.photos}
                  </p>

                  {/* Main slide — arrows outside overflow-hidden to avoid clipping */}
                  <div style={{ position: 'relative' }}>
                    {/* Image frame */}
                    <div className="rounded-2xl overflow-hidden bg-gray-100" style={{ paddingBottom: '75%', position: 'relative' }}>
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activePhoto}
                          src={PHOTOS[activePhoto].src}
                          alt={PHOTOS[activePhoto].alt}
                          initial={{ opacity: 0, scale: 1.04 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </AnimatePresence>

                      {/* Bottom gradient + dots — inside clip area intentionally */}
                      <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: '56px', background: 'linear-gradient(to top, rgba(0,0,0,0.38), transparent)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        {PHOTOS.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActivePhoto(idx)}
                            style={{
                              height: '6px',
                              width: activePhoto === idx ? '20px' : '6px',
                              borderRadius: '3px',
                              background: 'white',
                              opacity: activePhoto === idx ? 1 : 0.45,
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              padding: 0,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Prev arrow — outside overflow-hidden, perfectly circular */}
                    <button
                      onClick={() => setActivePhoto((activePhoto - 1 + PHOTOS.length) % PHOTOS.length)}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        minWidth: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(6px)',
                        border: 'none',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        zIndex: 10,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.22)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)'; }}
                    >
                      <svg width="16" height="16" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Next arrow */}
                    <button
                      onClick={() => setActivePhoto((activePhoto + 1) % PHOTOS.length)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        minWidth: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(6px)',
                        border: 'none',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        zIndex: 10,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.22)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)'; }}
                    >
                      <svg width="16" height="16" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Thumbnail strip */}
                  <div className="flex gap-2 mt-3">
                    {PHOTOS.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhoto(idx)}
                        className="flex-1 rounded-xl overflow-hidden transition-all duration-200"
                        style={{
                          height: '52px',
                          outline: activePhoto === idx ? `2px solid ${O}` : '2px solid transparent',
                          outlineOffset: '2px',
                          opacity: activePhoto === idx ? 1 : 0.5,
                        }}
                      >
                        <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Text on the right */}
                <div className="space-y-5 lg:pl-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full" style={{ background: O }} />
                    <p className="text-sm font-semibold" style={{ color: O }}>{tx.events.e1.collab}</p>
                  </div>
                  <p className="text-base text-gray-700 leading-relaxed font-medium">{tx.events.e1.body}</p>
                  
                  {/* Event topic badges */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: B }}>
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: B }}>{tx.events.e1.badge1}</p>
                        <p className="text-xs text-gray-600">{tx.events.e1.badge1sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: O }}>
                        <span className="text-white text-xs font-bold">π</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: O }}>{tx.events.e1.badge2}</p>
                        <p className="text-xs text-gray-600">{tx.events.e1.badge2sub}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={up} className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm text-gray-600 font-medium">
                  {tx.events.coming}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── TEAM ──────────────────────────────────────────────────────────── */}
      <section id="team" className="py-20 px-6 lg:px-10" style={{ background: BG }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sg}>

            <motion.p variants={up} className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: O }}>
              {tx.team.label}
            </motion.p>
            <motion.h2 variants={up} className="text-3xl sm:text-4xl font-black mb-3 leading-tight" style={{ color: B }}>
              {tx.team.heading}
            </motion.h2>
            <motion.p variants={up} className="text-sm text-gray-500 mb-10 max-w-lg">
              {tx.team.sub}
            </motion.p>

            <motion.div variants={sg} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {MEMBERS.map((m, i) => (
                <motion.div key={i} variants={up} className="group" style={{ position: 'relative' }}>
                  {/* Square card */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      aspectRatio: '1 / 1',
                      position: 'relative',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
                      transition: 'box-shadow 0.25s, transform 0.25s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 32px rgba(26,43,75,0.18)`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {/* Photo */}
                    <img
                      src={m.img}
                      alt={m.name}
                      className="group-hover:scale-105 transition-transform duration-500"
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => {
                        e.target.style.display = 'none';
                        Object.assign(e.target.parentElement.style, {
                          background: `linear-gradient(135deg,${B},${O})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        });
                        const s = document.createElement('span');
                        s.style.cssText = 'font-size:2.5rem;font-weight:900;color:white;position:relative;z-index:1;';
                        s.textContent = m.name[0];
                        e.target.parentElement.appendChild(s);
                      }}
                    />

                    {/* Bottom gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 'auto 0 0 0',
                      height: '55%',
                      background: 'linear-gradient(to top, rgba(10,18,32,0.88) 0%, transparent 100%)',
                    }} />

                    {/* Name + role */}
                    <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px' }}>
                      <p style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>{m.name}</p>
                      <p style={{ color: O, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '3px' }}>
                        {tx.team.roles[i]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contatti" className="py-20 px-6 lg:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={sg}>

            <motion.p variants={up} className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: O }}>
              {tx.contact.label}
            </motion.p>
            <motion.h2 variants={up} className="text-3xl sm:text-4xl font-black mb-3 leading-tight max-w-xl" style={{ color: B }}>
              {tx.contact.heading}
            </motion.h2>
            <motion.p variants={up} className="text-sm text-gray-500 mb-8 max-w-md">
              {tx.contact.sub}
            </motion.p>

            <motion.div variants={sg} className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <motion.a variants={up}
                href="mailto:associazionearqtype@protonmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover-lift"
                style={{ background: `linear-gradient(135deg,${B},${O})`, boxShadow: `0 4px 18px ${B}33` }}>
                <Mail size={15} />
                associazionearqtype@protonmail.com
              </motion.a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} style={{ color: `${O}88` }} />
                Galleria del Corso 7, Terni (TR)
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 lg:px-10" style={{ background: '#0a1220' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">

            <div className="space-y-4">
              <img src="/assets/logonobg.png" alt="ARQtype" className="h-7 w-auto object-contain"
                   style={{ filter: 'brightness(0) invert(1)' }} />
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {tx.footer.tagline}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>
                {tx.footer.nav}
              </p>
              <div className="space-y-2 mb-6">
                {tx.nav.slice(0, 3).map((l, i) => (
                  <button key={l} onClick={() => goto(NAV_IDS[i])}
                    className="block text-xs transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.38)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}>
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>
                {tx.footer.docs}
              </p>
              <div className="space-y-2">
                {[
                  [tx.footer.terms,   '/termini'],
                  [tx.footer.privacy, '/privacy'],
                  [tx.footer.cookie,  '/cookie' ],
                  [tx.footer.statute, '/statuto'],
                ].map(([label, href]) => (
                  <a key={label} href={href} className="block text-xs transition-colors duration-200"
                     style={{ color: 'rgba(255,255,255,0.38)' }}
                     onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                     onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>
                {tx.contact.label}
              </p>
              <div className="space-y-3">
                {[
                  [Mail,     'Email',              'associazionearqtype@protonmail.com'],
                  [MapPin,   tx.footer.address,    'Galleria del Corso 7, Terni (TR)'  ],
                  [FileText, tx.footer.taxId,      '91088550552'                        ],
                ].map(([Ic, label, val]) => (
                  <div key={label} className="flex items-start gap-2">
                    <Ic size={12} className="flex-shrink-0 mt-0.5" style={{ color: `${O}cc` }} />
                    <div>
                      <p className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.2)' }}>{label}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2"
               style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © {new Date().getFullYear()} ARQtype Association · {tx.footer.rights}
            </p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{tx.footer.made}</p>
          </div>
        </div>
      </footer>

      {/* back to top */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover-lift"
            style={{ background: `linear-gradient(135deg,${B},${O})`, color: 'white' }}>
            <ChevronDown size={16} style={{ transform: 'rotate(180deg)' }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
