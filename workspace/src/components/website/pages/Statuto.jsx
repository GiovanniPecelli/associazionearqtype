import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Search, BookOpen, Users, Award, Calendar, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Statuto = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSection, setCurrentSection] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Statuto content completo
  const statutoContent = [
    {
      id: 'denominazione',
      title: 'Art. 1 – Denominazione e natura',
      content: [
  "È costituita, ai sensi degli artt. 36 e seguenti del Codice civile, l'associazione culturale denominata \"Associazione ARQtype\", di seguito \"Associazione\".",
  "L'Associazione è apartitica, aconfessionale, indipendente e senza fini di lucro.",
  "L'Associazione è non riconosciuta. Per le obbligazioni assunte rispondono il fondo comune e, nei limiti di legge, le persone che hanno agito in nome e per conto dell'Associazione, ai sensi dell'art. 38 c.c.",
  "L'Associazione può utilizzare denominazioni complementari o derivate (quali \"ARQlabs\", \"ARQ[...]\" e simili) per identificare specifici progetti, laboratori o iniziative, previa autorizzazione del Consiglio Direttivo, restando inteso che tali denominazioni non costituiscono soggetti autonomi e che tutte le attività svolte sotto tali nomi sono direttamente riferibili all'Associazione."
],
      keywords: ['denominazione', 'natura', 'cultura', 'non riconosciuta']
    },
    {
      id: 'sede',
      title: 'Art. 2 – Sede',
      content: `La sede legale è nel Comune di Terni.
Il Consiglio Direttivo può deliberare l'istituzione di sedi operative e il trasferimento della sede all'interno dello stesso Comune.
L'Associazione può istituire sedi operative secondarie su delibera del Consiglio Direttivo.`,
      keywords: ['sede', 'terni', 'legale', 'operativa']
    },
    {
      id: 'durata',
      title: 'Art. 3 – Durata',
      content: `L'Associazione ha durata illimitata, salvo scioglimento deliberato dall'Assemblea dei Soci Fondatori.`,
      keywords: ['durata', 'illimitata', 'scioglimento']
    },
    {
      id: 'scopi',
      title: 'Art. 4 – Scopi',
      content: `L'Associazione promuove una cultura critica, etica e consapevole delle tecnologie digitali e dell'intelligenza artificiale, con particolare attenzione ai contesti educativi e formativi.
In particolare:
● diffondere conoscenze su intelligenza artificiale e tecnologie emergenti;
● promuovere un uso responsabile e consapevole della tecnologia;
● favorire il dialogo tra ambito umanistico, scientifico e tecnologico;
● sviluppare riflessione critica sull'impatto sociale ed etico dell'innovazione;
● Collaborare con scuole, università ed enti pubblici e privati per percorsi formativi su STEM, AI e digitale, anche tramite bandi pubblici, PNRR e PON;
● partecipare a bandi e progetti nazionali ed europei;
● fornire consulenza tecnico-scientifica a carattere culturale, educativo e progettuale, non svolta in forma professionale o commerciale abituale.`,
      keywords: ['scopi', 'cultura', 'tecnologia', 'ai', 'educazione', 'stem']
    },
    {
      id: 'attivita',
      title: 'Art. 5 – Attività',
      content: `Per il raggiungimento dei propri scopi l'Associazione può svolgere:
corsi, workshop, laboratori, seminari ed eventi formativi;
attività di divulgazione e produzione di materiali educativi;
progetti di ricerca e sperimentazione metodologica;
attività di networking e collaborazione interdisciplinare.
Le attività possono essere gratuite o svolte a fronte di contributi associativi.
Sono ammessi proventi da attività commerciali e prestazioni a pagamento verso enti terzi, svolte in modo occasionale e non prevalente, esclusivamente strumentali agli scopi associativi e reinvestiti nelle attività istituzionali.`,
      keywords: ['attività', 'corsi', 'workshop', 'ricerca', 'educazione']
    },
    {
      id: 'dati',
      title: 'Art. 5-bis – Tutela dei dati personali e sicurezza digitale',
      content: `L'Associazione riconosce la protezione dei dati personali e la sicurezza digitale come elementi essenziali della propria attività, in particolare nei contesti educativi e formativi e nell'utilizzo di strumenti tecnologici e digitali.
L'Associazione si impegna a trattare i dati personali di soci, aderenti, partecipanti alle attività, collaboratori e terzi nel rispetto della normativa vigente in materia di protezione dei dati personali, con particolare riferimento al Regolamento (UE) 2016/679 (GDPR).
Il trattamento dei dati è effettuato secondo principi di liceità, correttezza, trasparenza, minimizzazione e sicurezza.
Le modalità operative di gestione, conservazione e protezione dei dati personali e digitali sono disciplinate da regolamenti interni e informative dedicate.`,
      keywords: ['dati', 'privacy', 'gdpr', 'sicurezza', 'digitale']
    },
    {
      id: 'minori',
      title: 'Art. 5-ter – Tutela dei minori',
      content: `L'Associazione riconosce la tutela dei minori come principio fondamentale e trasversale a tutte le proprie attività educative, formative e divulgative.\nIn particolare, nell'ambito delle attività svolte con scuole, enti educativi, famiglie o altri soggetti che coinvolgano minori, l'Associazione si impegna a:\n● operare nel rispetto della dignità, dell'integrità psicologica e del benessere dei minori;\n● adottare comportamenti improntati a correttezza, responsabilità e trasparenza;\n● prevenire qualsiasi forma di abuso, discriminazione, esposizione a contenuti inappropriati o utilizzo improprio degli strumenti digitali;\n● collaborare con le istituzioni scolastiche e gli enti competenti nel rispetto dei rispettivi ruoli e responsabilità.\nLe modalità operative di tutela dei minori sono disciplinate da appositi regolamenti interni, approvati dal Consiglio Direttivo.`,
      keywords: ['minori', 'tutela', 'scuole', 'protezione', 'educazione']
    },
    {
      id: 'soci',
      title: 'Art. 6 – Soci',
      content: `I soci dell'Associazione si distinguono in Soci Fondatori e Soci Ordinari.\nI Soci Fondatori sono i quattro firmatari dell'atto costitutivo. Tale qualifica è personale, non trasferibile, non integrabile e non attribuibile ad altri soggetti in alcun caso.\nLa qualità di Socio Fondatore si perde per dimissioni volontarie, decesso o esclusione ai sensi del presente Statuto. In tali casi, il numero dei Soci Fondatori si riduce senza possibilità di sostituzione o integrazione.\nPossono essere ammessi come Soci Ordinari le persone fisiche maggiorenni che:\n● condividono gli scopi dell'Associazione;\n● presentano domanda scritta al Consiglio Direttivo;\n● sono accettati con delibera unanime del Consiglio Direttivo.\n● Il Consiglio Direttivo può respingere la domanda senza obbligo di motivazione.\nI Soci Ordinari hanno diritto a:\n● partecipare alle attività dell'Associazione;\n● consultare i verbali delle Assemblee e il rendiconto economico-finanziario approvato;\n● partecipare con diritto di voto all'Assemblea Ordinaria dei Soci;\n● presentare proposte e osservazioni al Consiglio Direttivo.\nI Soci Ordinari sono tenuti al versamento della quota associativa annuale stabilita dall'Assemblea dei Soci Fondatori.\nLa qualità di Socio Ordinario si perde per:\n● dimissioni volontarie comunicate per iscritto;\n● mancato pagamento della quota associativa per oltre sei mesi dalla scadenza;\n● esclusione deliberata dal Consiglio Direttivo per gravi violazioni dello Statuto o comportamenti lesivi dell'Associazione, previa contestazione scritta e concessione di un termine di quindici giorni per presentare difese.\nL'Associazione può inoltre stipulare rapporti di collaborazione con enti pubblici e privati, scuole, imprese e persone fisiche (di seguito Aderenti) che:\n● desiderano partecipare come fruitori alle attività dell'Associazione;\n● commissionano servizi educativi, formativi o di consulenza;\n● sostengono economicamente l'Associazione tramite contributi o sponsorizzazioni.\nGli Aderenti non assumono la qualifica di soci ai sensi degli artt. 36-38 c.c. e operano esclusivamente come:\n● partecipanti/fruitori delle attività associative;\n● committenti di servizi educativi e formativi;\n● sostenitori economici dell'Associazione.`,
      keywords: ['soci', 'fondatori', 'ordinari', 'aderenti', 'iscrizione']
    },
    {
      id: 'diritti',
      title: 'Art. 7 – Diritti e doveri',
      content: `Ai Soci Fondatori spettano in via esclusiva:\n● la partecipazione a tutte le attività dell'Associazione;\n● la consultazione dei libri sociali e della documentazione interna in qualsiasi momento;\n● il diritto di voto in Assemblea;\n● l'elettorato attivo e passivo per tutte le cariche sociali;\n● il potere di deliberare su ogni aspetto della vita associativa, compresa l'esclusione di altri Soci Fondatori nei casi e secondo le modalità previste dall'art. 15 del presente Statuto.\nIl Consiglio Direttivo può disciplinare mediante regolamenti interni le modalità di partecipazione degli Aderenti, le eventuali quote di adesione, i servizi accessibili e ogni altro aspetto del rapporto associativo, nel rispetto del presente Statuto. Questi regolamenti interni, approvati e modificati dal Consiglio Direttivo, hanno efficacia esclusivamente all'interno dell'Associazione e possono essere consultati da tutti i Soci Fondatori.\nTutti i Soci Fondatori sono tenuti a rispettare il presente Statuto, i regolamenti interni e le deliberazioni degli organi sociali.`,
      keywords: ['diritti', 'doveri', 'fondatori', 'consiglio']
    },
    {
      id: 'organi',
      title: 'Art. 8 – Organi dell\'Associazione',
      content: `Sono organi dell'Associazione:
● l'Assemblea dei Soci Fondatori;
● il Consiglio Direttivo;
● il Presidente;
● il Vicepresidente.
Le cariche sociali sono gratuite e non sono soggette a scadenza, permanendo finché il titolare conserva la qualità di Socio Fondatore, salvo dimissioni, decesso o revoca.
L'Assemblea dei Soci Fondatori procede a verifica delle cariche con cadenza triennale.`,
      keywords: ['organi', 'assemblea', 'consiglio', 'presidente', 'vicepresidente']
    },
    {
      id: 'assemblea',
      title: 'Art. 9 – Assemblea dei Soci Fondatori',
      content: `L'Assemblea è composta esclusivamente dai Soci Fondatori ed è l'organo sovrano dell'Associazione.\nL'Assemblea è validamente costituita con la presenza di tutti i Soci Fondatori in carica (quorum costitutivo).\nLe deliberazioni dell'Assemblea si distinguono in:\na) deliberazioni ordinarie, assunte con il voto favorevole di almeno tre quarti (3/4) dei Soci Fondatori in carica, e riguardano in particolare:\n● approvazione del rendiconto economico-finanziario annuale, riferito all'esercizio chiuso al 31 dicembre;\n● definizione delle linee generali dell'attività;\n● approvazione dei regolamenti interni;\n● ogni altra decisione non riservata alle deliberazioni straordinarie.\nb) deliberazioni straordinarie, assunte con il voto favorevole unanime (4/4) di tutti i Soci Fondatori in carica, e riguardano:\n● modifiche del presente Statuto;\n● esclusione di un Socio Fondatore;\n● scioglimento dell'Associazione;\n● ogni altra decisione che il presente Statuto riserva espressamente all'unanimità.\nÈ ammessa la partecipazione e la deliberazione in modalità telematica, purché sia garantita l'identificazione dei partecipanti.`,
      keywords: ['assemblea', 'soci fondatori', 'deliberazioni', 'quorum']
    },
    {
      id: 'consiglio',
      title: 'Art. 10 – Consiglio Direttivo',
      content: `Il Consiglio Direttivo è composto di diritto da tutti i Soci Fondatori.\nIl Consiglio Direttivo, riunito in seduta straordinaria e con la presenza di tutti i suoi componenti, nomina e revoca il Presidente e il Vicepresidente dell'Associazione.\nLe deliberazioni sono assunte all'unanimità e risultano da apposito verbale iscritto nel libro dei verbali del Consiglio Direttivo.\nIl Consiglio Direttivo gestisce l'Associazione, dà attuazione alle deliberazioni dell'Assemblea, approva i programmi di attività, i regolamenti interni e i rapporti con terzi.\nIl Consiglio Direttivo è validamente costituito con la presenza di tutti i suoi componenti (quorum costitutivo).\nI componenti restano in carica a tempo indeterminato, salvo dimissioni, decesso o perdita della qualità di Socio Fondatore.`,
      keywords: ['consiglio direttivo', 'nomine', 'deliberazioni', 'gestione']
    },
    {
      id: 'presidente',
      title: 'Art. 11 – Presidente e Vicepresidente',
      content: `Il Presidente è il legale rappresentante dell'Associazione nei confronti dei terzi e in giudizio.\nEgli convoca e presiede l'Assemblea dei Soci Fondatori e il Consiglio Direttivo e sottoscrive gli atti, i contratti e gli accordi dell'Associazione, dandone attuazione secondo le deliberazioni degli organi competenti.\nIl Vicepresidente coadiuva il Presidente nell'esercizio delle sue funzioni e lo sostituisce automaticamente in ogni caso di assenza, impedimento temporaneo o delega, esercitandone tutti i poteri, ivi compresa la rappresentanza legale dell'Associazione.\nIl Presidente può delegare, mediante atto scritto, specifiche funzioni operative o poteri di rappresentanza ai membri del Consiglio Direttivo, inclusa la facoltà di firma per singoli atti o categorie di atti, ferma restando la responsabilità generale della funzione presidenziale.\nIl Presidente e il Vicepresidente esercitano le rispettive funzioni nel rispetto del presente Statuto, delle deliberazioni dell'Assemblea dei Soci Fondatori e del Consiglio Direttivo.`,
      keywords: ['presidente', 'vicepresidente', 'rappresentanza', 'deleghe']
    },
    {
      id: 'risorse',
      title: 'Art. 12 – Risorse economiche',
      content: `Le risorse dell'Associazione derivano da:\n● quote e contributi associativi;\n● donazioni e liberalità;\n● contributi pubblici e privati;\n● proventi da attività marginali consentite dalla legge.`,
      keywords: ['risorse', 'economia', 'finanza', 'contributi']
    },
    {
      id: 'libri',
      title: 'Art. 13 – Libri sociali e documentazione interna',
      content: `L'Associazione tiene, anche in formato digitale, i seguenti libri e registri interni:\n● il libro dei soci;\n● il libro dei verbali dell'Assemblea dei Soci Fondatori;\n● il libro dei verbali del Consiglio Direttivo;\n● la documentazione contabile e amministrativa.\nLa tenuta e la conservazione dei libri sociali sono curate dal Consiglio Direttivo.\nI Soci Fondatori hanno diritto di consultare in qualsiasi momento i libri sociali e tutta la documentazione dell'Associazione.`,
      keywords: ['libri sociali', 'documentazione', 'verbali', 'contabilità']
    },
    {
      id: 'rapporti',
      title: 'Art. 14 – Rapporti con terzi e sviluppo',
      content: `L'Associazione è autonoma e distinta da altri enti o società.\nPuò promuovere, partecipare o collaborare alla costituzione di società o iniziative imprenditoriali coerenti con le proprie finalità, nel rispetto della legge e senza scopo di lucro diretto.`,
      keywords: ['rapporti', 'terzi', 'sviluppo', 'collaborazione']
    },
    {
      id: 'esclusione',
      title: 'Art. 15 – Esclusione dei Soci Fondatori e degli Aderenti',
      content: `L'esclusione di un Socio Fondatore può essere deliberata per gravi violazioni del presente Statuto o per comportamenti gravemente lesivi degli interessi o dell'immagine dell'Associazione.\nI fatti addebitati devono essere contestati per iscritto al socio interessato, assegnando un termine non inferiore a quindici giorni per presentare eventuali difese.\nDecorso tale termine, l'Assemblea dei Soci Fondatori delibera sull'eventuale esclusione con le maggioranze previste dal presente Statuto (unanimità degli altri Soci Fondatori).\nLa deliberazione deve essere motivata e comunicata per iscritto all'interessato.\nContro la delibera di esclusione è ammesso ricorso all'Assemblea dei Soci Fondatori entro trenta giorni dalla comunicazione; l'Assemblea decide in via definitiva. Fino alla decisione definitiva, l'esclusione resta sospesa.\nLa qualifica di Aderente può essere revocata dal Consiglio Direttivo mediante comunicazione scritta. Qualora l'Aderente abbia in corso rapporti contrattuali per servizi educativi o formativi già avviati, la revoca ha effetto dalla conclusione naturale del servizio o, in caso di inadempienza grave, decorsi 30 giorni dalla contestazione scritta degli addebiti.`,
      keywords: ['esclusione', 'soci fondatori', 'aderenti', 'revoca']
    },
    {
      id: 'scioglimento',
      title: 'Art. 16 – Scioglimento',
      content: `In caso di scioglimento dell'Associazione, deliberato dall'Assemblea dei Soci Fondatori, il patrimonio residuo è devoluto ad enti operanti nei settori dell'educazione, della ricerca o della formazione, con finalità analoghe o di pubblica utilità. È in ogni caso esclusa la distribuzione ai soci.`,
      keywords: ['scioglimento', 'patrimonio', 'devoluzione']
    },
    {
      id: 'norma',
      title: 'Art. 17 – Norma finale',
      content: `Per quanto non previsto dal presente Statuto si applicano le norme del Codice civile in materia di associazioni non riconosciute.`,
      keywords: ['norma finale', 'codice civile']
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
                <div className="space-y-4">
                  {Array.isArray(section.content) ? (
                    section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </div>
                  )}
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
        </div>
      </main>
    </div>
  );
};

export default Statuto;
