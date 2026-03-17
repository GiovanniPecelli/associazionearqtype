import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Menu, X, ChevronDown, Play,
  Users, Lightbulb, Globe, Shield, Zap,
  Activity, Layers, Info, ArrowUp, Calendar,
  Target, Heart, Sparkles, Award, BookOpen
} from 'lucide-react';

const StaticLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleVideoLoad = () => {
      setVideoLoaded(true);
      if (videoRef.current) {
        videoRef.current.playbackRate = 1.0; // Velocità normale
        videoRef.current.play().catch(console.error);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current) {
        // Quando la pagina diventa visibile, fai ripartire il video
        videoRef.current.currentTime = 0; // Riporta all'inizio
        videoRef.current.playbackRate = 1.0; // Velocità normale
        videoRef.current.play().catch(console.error);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', handleVideoLoad);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (video) {
        video.removeEventListener('loadeddata', handleVideoLoad);
      }
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">

      {/* Navigation - Glass morphism effect */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/20 border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/assets/logonobg.png"
                alt="ARQtype"
                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 gap-6">
              {['Visione', 'Soluzioni', 'Team', 'Statuto'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Statuto') {
                      window.location.href = '/statuto';
                    } else {
                      scrollToSection(item.toLowerCase());
                    }
                  }}
                  className="text-black hover:text-warm-orange-brand font-medium transition-colors duration-300 relative group whitespace-nowrap"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-brand group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-brand text-white font-semibold rounded-xl hover:shadow-xl hover-lift transition-all duration-300"
              >
                Accedi
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-deep-blue-brand transition-colors duration-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-white border-t border-gray-100 shadow-xl">
            <div className="px-6 py-6 space-y-4">
              {['Visione', 'Soluzioni', 'Team', 'Statuto'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Statuto') {
                      window.location.href = '/statuto';
                    } else {
                      scrollToSection(item.toLowerCase());
                    }
                  }}
                  className="block w-full text-left text-black hover:text-warm-orange-brand font-medium transition-colors duration-300 py-2"
                >
                  {item}
                </button>
              ))}
              <Link
                to="/login"
                className="block w-full text-center px-6 py-3 bg-gradient-brand text-black font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
              >
                Accedi
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Video in angolo e contenuto centrato */}
      <section id="visione" ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 pt-20" style={{ background: 'rgb(216, 216, 216)' }}>

        {/* Video tra le scritte */}
        <div className="absolute top-20 right-8 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-64 h-36 object-cover rounded-lg"
            style={{
              objectPosition: 'center',
            }}
          >
            <source src="/assets/herovid.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content principale centrato */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-8" style={{ marginTop: '200px' }}>
            <span className="text-deep-blue-brand">Associazione ARQtype</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxedd">
            AI etica e sostenibile per tutti. Scopri come raggiungere i tuoi obiettivi con l'intelligenza artificiale responsabile.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-brand text-white font-bold rounded-xl hover:shadow-xl hover-lift transition-all duration-300 flex items-center space-x-2"
            >
              <span>Prova la Piattaforma</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => scrollToSection('soluzioni')}
              className="px-8 py-4 bg-black text-white font-bold rounded-xl transition-all duration-300"
            >
              Scopri di Più
            </button>
          </div>
        </div>
      </section>

      {/* 3. ATTIVITÀ & PARTECIPAZIONI - Credibilità reale */}
      <section id="soluzioni" className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-warm-orange-50 border border-warm-orange-100 rounded-full mb-8">
              <Calendar className="w-4 h-4 text-warm-orange-brand" />
              <span className="text-sm font-semibold text-warm-orange-brand uppercase tracking-wider">Attività e partecipazioni</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-deep-blue-brand mb-8 leading-tight">
              Cosa abbiamo fatto<br />
              <span className="text-warm-orange-brand">fino a oggi</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Scopri a quali progetti abbiamo contribuito e quelli in programma.
            </p>
          </div>

          {/* Conferenza specifica */}
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="px-4 py-2 bg-warm-orange-100 text-warm-orange-brand rounded-full text-sm font-semibold">
                  2026
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-deep-blue-brand mb-4">
                  Conferenza per π-greco day
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  In collaborazione con Associazione Hacklab Terni - "L'infinito in 8 bit"
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Conferenza dedicata al pi-greco dove abbiamo esplorato analogie tra pi-greco e intelligenza artificiale,
                  apporssimazione e quantizzazione dei modelli. Focus su allucinazione ed affidabilità dei modelli AI.
                </p>
              </div>
            </div>
          </div>

          {/* Zona per futuri eventi */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-deep-blue-50 border border-deep-blue-100 rounded-full">
              <Activity className="w-4 h-4 text-deep-blue-brand" />
              <span className="text-sm font-semibold text-deep-blue-brand uppercase tracking-wider">Prossimi eventi</span>
            </div>
            <p className="text-gray-600 mt-4">
              Altre conferenze e workshop in arrivo. Resta aggiornato!
            </p>
          </div>
        </div>
      </section>

      {/* Team Section - Design elegante */}
      <section id="team" className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-warm-orange-50 border border-warm-orange-100 rounded-full mb-8">
              <Users className="w-4 h-4 text-warm-orange-brand" />
              <span className="text-sm font-semibold text-warm-orange-brand uppercase tracking-wider">Team</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-deep-blue-brand mb-8 leading-tight">
              I <span className="text-warm-orange-brand">Fondatori</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Un team multidisciplinare unito dalla passione per l'innovazione etica
              e l'impatto sociale positivo.
            </p>
          </div>

          {/* Team Grid - Foto grandi in una riga */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Francesco",
                role: "Presidente",
                image: "/assets/founder1.jpg"
              },
              {
                name: "Emilio",
                role: "Co-Fondatore",
                image: "/assets/co-founder2.jpg"
              },
              {
                name: "Giovanni",
                role: "Co-Fondatore",
                image: "/assets/dev2.jpg"
              },
              {
                name: "Michele",
                role: "Co-Fondatore",
                image: "/assets/sales2.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="text-center group flex-shrink-0">
                <div className="w-48 h-48 mx-auto mb-8 rounded-lg bg-gradient-to-br from-deep-blue-brand/10 to-warm-orange-brand/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to letter if image not found
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-44 h-44 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                          <span class="text-4xl font-bold text-white">${member.name.charAt(0)}</span>
                        </div>
                      `;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-blue-brand/20 via-transparent to-warm-orange-brand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-deep-blue-brand mb-3">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-warm-orange-brand mb-4 uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Gradient brand */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-brand relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">
            La nostra piattaforma<br />
            per trasformare le Idee in Impatto?
          </h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed">
            Unisciti a noi nel creare un futuro dove l'intelligenza artificiale
            serve veramente le persone e le comunità.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-3 px-8 py-4 bg-black text-deep-blue-brand font-bold rounded-xl hover:shadow-2xl hover-lift transition-all duration-300"
          >
            <span>Inizia Ora</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer - Design Ottimizzato */}
      <footer id="contatti" className="relative py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-slate-900 via-deep-blue-brand to-slate-900 text-white">
        <div className="max-w-7xl mx-auto">

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-12 mb-12">

            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  src="/assets/logonobg.png"
                  alt="ARQtype"
                  className="h-12 w-auto object-contain filter brightness-0 invert"
                />
                <div>
                  <h3 className="text-xl font-bold text-black">ARQtype</h3>
                  <p className="text-deep-blue-brand text-sm">Association</p>
                </div>
              </div>
              <p className="text-black leading-relaxed text-sm">
                Promuoviamo la cultura digitale attraverso ricerca interdisciplinare,
                educazione e sviluppo di tecnologie AI etiche e sostenibili.
              </p>

              {/* Email CTA Button */}
              <div className="pt-4">
                <a
                  href="mailto:associazionearqtype@protonmail.com"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-brand text-deep-blue-brand font-bold rounded-xl hover:shadow-2xl hover-lift transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contattaci via Email</span>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-black flex items-center gap-2">
                <svg className="w-5 h-5 text-deep-blue-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Navigazione
              </h4>

              {/* Main Sections */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Pagina Principale</p>
                  <div className="space-y-2">
                    {['Visione', 'Soluzioni', 'Team'].map((item) => (
                      <button
                        key={item}
                        onClick={() => scrollToSection(item.toLowerCase())}
                        className="block text-left text-black hover:text-deep-blue-brand transition-colors duration-300 font-medium py-1"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legal Links */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Documenti</p>
                  <div className="space-y-2">
                    {['Termini e Condizioni', 'Privacy', 'Cookie', 'Statuto'].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          if (item === 'Privacy') {
                            window.location.href = '/privacy';
                          } else if (item === 'Cookie') {
                            window.location.href = '/cookie';
                          } else if (item === 'Statuto') {
                            window.location.href = '/statuto';
                          } else if (item === 'Termini e Condizioni') {
                            window.location.href = '/termini';
                          }
                        }}
                        className="block text-left text-black hover:text-deep-blue-brand transition-colors duration-300 font-medium py-1"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-black flex items-center gap-2">
                <svg className="w-5 h-5 text-deep-blue-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Informazioni Contatto
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-deep-blue-brand flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</p>
                    <p className="text-black font-medium">associazionearqtype@protonmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-deep-blue-brand flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Sede</p>
                    <p className="text-black font-medium">Galleria del Corso 7, Terni (TR)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-deep-blue-brand flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Partita IVA</p>
                    <p className="text-black font-medium">91088550552</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-black text-sm">
                <p className="font-medium">© {new Date().getFullYear()} ARQtype Association</p>
                <p className="text-xs mt-1 text-gray-600">Non-profit Organization • Tax ID: 91088550552</p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-deep-blue-brand font-semibold text-sm">AI Etica per il Terzo Settore</p>
                <p className="text-gray-600 text-xs mt-1">Made with ♥ in Italy</p>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* Back to Top Button */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-brand text-white rounded-full shadow-lg hover:shadow-xl hover-lift transition-all duration-300 flex items-center justify-center"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default StaticLanding;
