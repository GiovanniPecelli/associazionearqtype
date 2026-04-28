import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Gavel, AlertCircle } from 'lucide-react';
import PublicNavbar from '../PublicNavbar';

const Termini = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* Navigation */}
      <PublicNavbar showBackButton={true} backTo="/" />

      {/* Content */}
      <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-deep-blue-50 border border-deep-blue-100 rounded-full mb-8">
              <FileText className="w-4 h-4 text-deep-blue-brand" />
              <span className="text-sm font-semibold text-deep-blue-brand uppercase tracking-wider">Termini e Condizioni</span>
            </div>
            <div className="text-center">
              <img 
                src="/assets/logonobg.png"
                alt="ARQtype Association"
                className="h-16 w-auto mx-auto mb-8"
              />
              <h1 className="text-4xl sm:text-5xl font-black text-deep-blue-brand mb-6 leading-tight">
                Termini e Condizioni<br />
                <span className="text-warm-orange-brand">dell'Associazione ARQtype</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Benvenuto nella nostra community. Leggi i termini che regolano l'utilizzo dei nostri servizi.
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-12">
            
            {/* Introduction */}
            <section className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6 flex items-center gap-3">
                <Gavel className="w-6 h-6 text-warm-orange-brand" />
                Accettazione dei Termini
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  I presenti Termini e Condizioni regolano l'utilizzo dei servizi digitali offerti dall'Associazione ARQtype, 
                  inclusi ma non limitati al sito web www.arqtype.org, alla piattaforma di intelligenza artificiale etica 
                  e a tutti i servizi associati.
                </p>
                <p>
                  Accedendo o utilizzando i nostri servizi, accetti implicitamente di essere vincolato da questi termini. 
                  Se non sei d'accordo con parte o con tutti i termini, ti preghiamo di non utilizzare i nostri servizi.
                </p>
              </div>
            </section>

            {/* Association Info */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-warm-orange-brand" />
                Chi Siamo
              </h2>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-deep-blue-brand mb-2">ARQtype Association</h3>
                    <p className="text-gray-600">Associazione Culturale senza scopo di lucro</p>
                    <p className="text-gray-600">Galleria del Corso 7, Terni (TR), Italy</p>
                    <p className="text-gray-600">Email: associazionearqtype@protonmail.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-deep-blue-brand mb-2">Informazioni Legali</h3>
                    <p className="text-gray-600">CF: 91088550552</p>
                    <p className="text-gray-600">Costituita ai sensi del Codice Civile italiano</p>
                    <p className="text-gray-600">Regione: Umbria</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Services */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Servizi Offerti</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Piattaforma AI Etica</h3>
                  <p className="text-gray-600">
                    Forniamo accesso a strumenti di intelligenza artificiale sviluppati secondo principi etici, 
                    con particolare attenzione alla trasparenza, equità e sostenibilità.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Formazione e Workshop</h3>
                  <p className="text-gray-600">
                    Organizziamo eventi formativi, conferenze e workshop sulla cultura digitale, 
                    intelligenza artificiale responsabile e innovazione tecnologica.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Ricerca e Sviluppo</h3>
                  <p className="text-gray-600">
                    Sviluppiamo progetti di ricerca interdisciplinare nel campo dell'AI etica, 
                    contribuendo all'innovazione sostenibile nel terzo settore.
                  </p>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Obblighi degli Utenti</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-deep-blue-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Condizioni di Utilizzo</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Utilizzare i servizi in modo lecito e corretto</li>
                    <li>• Rispettare gli altri utenti e la community</li>
                    <li>• Non violare diritti di proprietà intellettuale</li>
                    <li>• Non diffondere contenuti illeciti o offensivi</li>
                    <li>• Mantenere la riservatezza delle credenziali</li>
                  </ul>
                </div>
                
                <div className="bg-warm-orange-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-warm-orange-brand mb-3">Divieti Espliciti</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Utilizzo per scopi commerciali non autorizzati</li>
                    <li>• Riproduzione non autorizzata dei contenuti</li>
                    <li>• Tentativi di violazione della sicurezza</li>
                    <li>• Diffusione di malware o codice dannoso</li>
                    <li>• Spam o attività di marketing non consentite</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Proprietà Intellettuale</h2>
              <div className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-gray-700 mb-4">
                  Tutti i contenuti, marchi, loghi e materiali presenti sui nostri servizi sono di proprietà 
                  dell'Associazione ARQtype o dei rispettivi titolari e sono protetti dalle leggi sul diritto d'autore 
                  e sulla proprietà intellettuale.
                </p>
                <div className="bg-white p-6 rounded-xl mt-6">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Cosa puoi fare</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Utilizzare i contenuti per uso personale e non commerciale</li>
                    <li>• Condividere i link ai nostri contenuti</li>
                    <li>• Citare i nostri lavori indicando la fonte</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-xl mt-4">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Cosa non puoi fare</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Riprodurre o distribuire contenuti senza autorizzazione</li>
                    <li>• Utilizzare i nostri marchi senza consenso</li>
                    <li>• Sfruttare commercialmente i nostri materiali</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Limitazione di Responsabilità</h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warm-orange-brand" />
                    Limitazioni
                  </h3>
                  <p className="text-gray-600 mb-4">
                    L'Associazione ARQtype non è responsabile per:
                  </p>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    <li>Danni diretti o indiretti derivanti dall'uso dei servizi</li>
                    <li>Interruzioni del servizio o malfunzionamenti tecnici</li>
                    <li>Contenuti di terzi accessibili tramite i nostri servizi</li>
                    <li>Perdita di dati o informazioni</li>
                    <li>Utilizzo improprio dei servizi da parte degli utenti</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Modifiche dei Termini</h2>
              <div className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-gray-700 mb-4">
                  L'Associazione ARQtype si riserva il diritto di modificare i presenti Termini e Condizioni in qualsiasi momento. 
                  Le modifiche entreranno in vigore dalla pubblicazione sul sito web.
                </p>
                <p className="text-gray-700">
                  Ti invitiamo a consultare periodicamente questa pagina per rimanere aggiornato sulle eventuali modifiche. 
                  L'utilizzo continuato dei servizi dopo le modifiche costituisce accettazione dei nuovi termini.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Legge Applicabile e Foro Competente</h2>
              <div className="bg-white p-8 rounded-2xl border border-gray-100">
                <p className="text-gray-700 mb-4">
                  I presenti Termini e Condizioni sono regolati dalla legge italiana. Per qualsiasi controversia 
                  relativa all'interpretazione o esecuzione dei presenti termini, sarà competente il Foro di Terni.
                </p>
                <div className="mt-6 p-4 bg-deep-blue-50 rounded-lg">
                  <p className="text-sm text-deep-blue-brand font-semibold">
                    Data di aggiornamento: 17 Marzo 2026
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-brand text-white p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Contatti e Informazioni</h2>
              <p className="mb-6">
                Per qualsiasi domanda sui presenti Termini e Condizioni o per richieste di informazioni 
                sui nostri servizi, non esitare a contattarci.
              </p>
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
                <p className="font-semibold mb-2">Email:</p>
                <p className="text-lg">associazionearqtype@protonmail.com</p>
                <p className="font-semibold mb-2 mt-4">Sede:</p>
                <p className="text-lg">Galleria del Corso 7, Terni (TR), Italy</p>
              </div>
            </section>

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

export default Termini;
