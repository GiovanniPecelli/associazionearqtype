import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import PublicNavbar from '../PublicNavbar';

const Privacy = () => {
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
              <Shield className="w-4 h-4 text-deep-blue-brand" />
              <span className="text-sm font-semibold text-deep-blue-brand uppercase tracking-wider">Privacy Policy</span>
            </div>
            <div className="text-center">
              <img 
                src="/assets/logonobg.png"
                alt="ARQtype Association"
                className="h-16 w-auto mx-auto mb-8"
              />
              <h1 className="text-4xl sm:text-5xl font-black text-deep-blue-brand mb-6 leading-tight">
                Proteggiamo i tuoi dati<br />
                <span className="text-warm-orange-brand">come proteggiamo le idee</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                La tua privacy è importante per noi. Ecco come trattiamo i tuoi dati personali.
              </p>
            </div>
          </div>

          {/* Privacy Content */}
          <div className="space-y-12">
            
            {/* Introduction */}
            <section className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6 flex items-center gap-3">
                <Eye className="w-6 h-6 text-warm-orange-brand" />
                Informativa Privacy
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Ai sensi del Regolamento (UE) 2016/679 (GDPR) e della normativa italiana in materia di protezione dei dati personali, 
                  Associazione ARQtype, in qualità di Titolare del trattamento, ti fornisce questa informativa sul trattamento dei dati personali.
                </p>
                <p>
                  Questa informativa si applica al sito web <strong>www.arqtype.org</strong> e a tutti i servizi digitali offerti dall'associazione.
                </p>
              </div>
            </section>

            {/* Data Controller */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6 flex items-center gap-3">
                <Database className="w-6 h-6 text-warm-orange-brand" />
                Titolare del Trattamento
              </h2>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-deep-blue-brand mb-2">ARQtype Association</h3>
                    <p className="text-gray-600">Non-profit Organization</p>
                    <p className="text-gray-600">Galleria del Corso 7, Terni (TR), Italy</p>
                    <p className="text-gray-600">Email: associazionearqtype@protonmail.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-deep-blue-brand mb-2">Legal Information</h3>
                    <p className="text-gray-600">Tax ID: 91088550552</p>
                    <p className="text-gray-600">Cultural Association - Non-profit</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Types of Data */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Dati Personali Trattati</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Dati di navigazione</h3>
                  <p className="text-gray-600">
                    I sistemi informatici e le procedure software preposte al funzionamento di questo sito acquisiscono, 
                    nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita 
                    nell'uso dei protocolli di comunicazione di Internet.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Dati forniti volontariamente</h3>
                  <p className="text-gray-600">
                    La raccolta e il trattamento di dati personali avviene quando l'utente:
                  </p>
                  <ul className="mt-3 space-y-2 text-gray-600 list-disc list-inside">
                    <li>Si iscrive alla newsletter</li>
                    <li>Partecipa ai nostri eventi o workshop</li>
                    <li>Compila form di contatto o registrazione</li>
                    <li>Richiede informazioni sui nostri servizi</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Purpose */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Finalità del Trattamento</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-deep-blue-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Finalità istituzionali</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Gestione delle attività associative</li>
                    <li>• Organizzazione di eventi e workshop</li>
                    <li>• Invio di newsletter e comunicazioni</li>
                    <li>• Risposta a richieste informative</li>
                  </ul>
                </div>
                
                <div className="bg-warm-orange-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-warm-orange-brand mb-3">Base giuridica</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Consenso esplicito dell'interessato</li>
                    <li>• Esecuzione di un contratto</li>
                    <li>• Adempimento di obblighi legali</li>
                    <li>• Legittimo interesse dell'associazione</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Conservazione dei Dati</h2>
              <div className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-gray-700 mb-4">
                  I dati personali sono conservati per il tempo necessario al conseguimento delle finalità 
                  per cui sono stati raccolti e, comunque, nel rispetto dei termini di legge.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <Lock className="w-8 h-8 text-deep-blue-brand mx-auto mb-2" />
                    <p className="text-sm font-semibold">24 mesi</p>
                    <p className="text-xs text-gray-600">Newsletter</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <Lock className="w-8 h-8 text-warm-orange-brand mx-auto mb-2" />
                    <p className="text-sm font-semibold">10 anni</p>
                    <p className="text-xs text-gray-600">Documenti contabili</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <Lock className="w-8 h-8 text-purple-brand mx-auto mb-2" />
                    <p className="text-sm font-semibold">Fino a revoca</p>
                    <p className="text-xs text-gray-600">Consenso marketing</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Rights */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">I Tuoi Diritti</h2>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-3">Diritti dell'interessato</h3>
                  <p className="text-gray-600 mb-4">
                    In qualità di interessato, hai diritto di:
                  </p>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    <li>Accedere ai tuoi dati personali</li>
                    <li>Richiedere la rettifica dei dati inesatti</li>
                    <li>Ottenere la cancellazione dei dati</li>
                    <li>Limitare il trattamento dei dati</li>
                    <li>Opporsi al trattamento</li>
                    <li>Richiedere la portabilità dei dati</li>
                    <li>Proporre reclamo all'autorità di controllo</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-brand text-white p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Per esercitare i tuoi diritti</h2>
              <p className="mb-6">
                Puoi contattarci in qualsiasi momento per esercitare i tuoi diritti o per 
                qualsiasi domanda relativa al trattamento dei tuoi dati personali.
              </p>
              <div className="bg-white/20 backdrop-blur-sm p-6 rounded-xl">
                <p className="font-semibold mb-2">Email:</p>
                <p className="text-lg">associazionearqtype@protonmail.com</p>
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

export default Privacy;
