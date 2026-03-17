import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, Search, BookOpen, Users, Award, Calendar, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Statuto = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSection, setCurrentSection] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Statuto content (semplificato per visualizzazione)
  const statutoContent = [
    {
      id: 'denominazione',
      title: 'Art. 1 – Denominazione e natura',
      content: `È costituita, ai sensi degli artt. 36 e seguenti del Codice civile, l\'associazione culturale denominata "Associazione ARQtype", di seguito "Associazione". L\'Associazione è apartitica, aconfessionale, indipendente e senza fini di lucro. L\'Associazione è non riconosciuta.`,
      keywords: ['denominazione', 'natura', 'cultura', 'non riconosciuta']
    },
    {
      id: 'sede',
      title: 'Art. 2 – Sede',
      content: `La sede legale è nel Comune di Terni. Il Consiglio Direttivo può deliberare l\'istituzione di sedi operative e il trasferimento della sede all\'interno dello stesso Comune.`,
      keywords: ['sede', 'terni', 'legale', 'operativa']
    },
    {
      id: 'scopi',
      title: 'Art. 4 – Scopi',
      content: `L\'Associazione promuove una cultura critica, etica e consapevole delle tecnologie digitali e dell\'intelligenza artificiale, con particolare attenzione ai contesti educativi e formativi.`,
      keywords: ['scopi', 'cultura', 'tecnologia', 'ai', 'educazione']
    },
    {
      id: 'attivita',
      title: 'Art. 5 – Attività',
      content: `Per il raggiungimento dei propri scopi l\'Associazione può svolgere: corsi, workshop, laboratori, seminari ed eventi formativi; attività di divulgazione e produzione di materiali educativi; progetti di ricerca e sperimentazione metodologica.`,
      keywords: ['attività', 'corsi', 'workshop', 'ricerca', 'educazione']
    },
    {
      id: 'soci',
      title: 'Art. 6 – Soci',
      content: `I soci dell\'Associazione si distinguono in Soci Fondatori e Soci Ordinari. I Soci Fondatori sono i quattro firmatari dell\'atto costitutivo. Possono essere ammessi come Soci Ordinari le persone fisiche maggiorenni che condividono gli scopi dell\'Associazione.`,
      keywords: ['soci', 'fondatori', 'ordinari', 'iscrizione']
    },
    {
      id: 'organi',
      title: 'Art. 8 – Organi dell\'Associazione',
      content: `Sono organi dell\'Associazione: l\'Assemblea dei Soci Fondatori; il Consiglio Direttivo; il Presidente; il Vicepresidente.`,
      keywords: ['organi', 'assemblea', 'consiglio', 'presidente', 'vicepresidente']
    }
  ];

  // Filtra i contenuti in base alla ricerca
  const filteredContent = statutoContent.filter(section => {
    const matchesSearch = searchTerm === '' || 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSection = currentSection === 'all' || section.id === currentSection;
    
    return matchesSearch && matchesSection;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-white shadow-lg border-b border-gray-100">
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

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="/statuto.pdf" 
                download="statuto-arqtype.pdf"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-brand text-black rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">Download PDF</span>
              </a>
              <Link 
                to="/"
                className="flex items-center space-x-2 px-4 py-2 bg-deep-blue-50 text-deep-blue-brand rounded-lg hover:bg-deep-blue-100 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Torna indietro</span>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-deep-blue-brand hover:bg-deep-blue-50 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <a 
                  href="/statuto.pdf" 
                  download="statuto-arqtype.pdf"
                  className="flex items-center justify-center space-x-3 w-full px-6 py-4 bg-gradient-brand text-black font-bold rounded-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </a>
                <Link 
                  to="/"
                  className="flex items-center justify-center space-x-3 w-full px-6 py-4 bg-gray-50 text-deep-blue-brand font-bold rounded-xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Torna alla Home</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Content */}
      <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center">
              <img 
                src="/assets/logonobg.png"
                alt="ARQtype Association"
                className="h-16 w-auto mx-auto mb-8"
              />
              <h1 className="text-4xl sm:text-5xl font-black text-deep-blue-brand mb-6 leading-tight">
              Statuto dell'Associazione<br />
              <span className="text-warm-orange-brand">ARQtype</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Consulta lo statuto ufficiale che definisce la nostra identità, scopi e governance.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cerca nel testo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-blue-brand focus:border-transparent"
                />
              </div>
              
              {/* Section Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentSection('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    currentSection === 'all' 
                      ? 'bg-deep-blue-brand text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tutti
                </button>
                <button
                  onClick={() => setCurrentSection('scopi')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    currentSection === 'scopi' 
                      ? 'bg-deep-blue-brand text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Scopi
                </button>
                <button
                  onClick={() => setCurrentSection('organi')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    currentSection === 'organi' 
                      ? 'bg-deep-blue-brand text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Organi
                </button>
              </div>
            </div>
          </div>

          {/* Statuto Content */}
          <div className="space-y-8">
            {filteredContent.map((section) => (
              <section key={section.id} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <h2 className="text-2xl font-bold text-deep-blue-brand mb-6 flex items-start gap-3">
                  <FileText className="w-6 h-6 text-warm-orange-brand flex-shrink-0 mt-1" />
                  {section.title}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
                {section.keywords.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {section.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-deep-blue-50 text-deep-blue-brand rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-deep-blue-50 p-6 rounded-xl">
              <Users className="w-8 h-8 text-deep-blue-brand mb-4" />
              <h3 className="font-bold text-deep-blue-brand mb-2">4 Soci Fondatori</h3>
              <p className="text-gray-600 text-sm">
                L'associazione è guidata da quattro soci fondatori con cariche a tempo indeterminato.
              </p>
            </div>
            
            <div className="bg-warm-orange-50 p-6 rounded-xl">
              <Calendar className="w-8 h-8 text-warm-orange-brand mb-4" />
              <h3 className="font-bold text-warm-orange-brand mb-2">Fondata nel 2026</h3>
              <p className="text-gray-600 text-sm">
                Associazione culturale non riconosciuta con durata illimitata.
              </p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl">
              <Award className="w-8 h-8 text-purple-brand mb-4" />
              <h3 className="font-bold text-purple-brand mb-2">Tax ID: 91088550552</h3>
              <p className="text-gray-600 text-sm">
                Non-profit organization regolarmente costituita.
              </p>
            </div>
          </div>

          {/* Download CTA */}
          <div className="mt-16 bg-gradient-brand text-white p-8 rounded-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Scarica il Documento Completo</h2>
            <p className="mb-6 opacity-90">
              Ottieni la versione PDF completa dello statuto per riferimento futuro.
            </p>
            <a 
              href="/statuto.pdf" 
              download="statuto-arqtype.pdf"
              className="inline-flex items-center space-x-3 px-6 py-3 bg-white text-black font-bold rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <Download className="w-5 h-5" />
              <span>Download Statuto PDF</span>
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} ARQtype Association - Tutti i diritti riservati</p>
            <p className="mt-2">Non-profit Organization • Tax ID: 91088550552</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Statuto;
