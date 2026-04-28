import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie as CookieIcon, Settings, Eye, Shield } from 'lucide-react';
import PublicNavbar from '../PublicNavbar';

const Cookie = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* Navigation */}
      <PublicNavbar showBackButton={true} backTo="/" />

      {/* Content */}
      <main className="pt-32 pb-20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center">
              <img 
                src="/assets/logonobg.png"
                alt="ARQtype Association"
                className="h-16 w-auto mx-auto mb-8"
              />
              <h1 className="text-4xl sm:text-5xl font-black text-deep-blue-brand mb-6 leading-tight">
              Cookie semplici<br />
              <span className="text-warm-orange-brand">come le nostre idee</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Spieghiamo in modo chiaro come utilizziamo i cookie per migliorare la tua esperienza.
            </p>
          </div>

          {/* Cookie Content */}
          <div className="space-y-12">
            
            {/* What are cookies */}
            <section className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6 flex items-center gap-3">
                <CookieIcon className="w-6 h-6 text-warm-orange-brand" />
                Cosa sono i Cookie?
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  I cookie sono piccoli file di testo che i siti web inviano al tuo dispositivo 
                  quando li visiti. Vengono memorizzati nel tuo browser e aiutano il sito a 
                  ricordare informazioni sulla tua visita.
                </p>
                <p>
                  Pensa ai cookie come post-it digitali che aiutano il sito a funzionare meglio 
                  e a ricordare le tue preferenze.
                </p>
              </div>
            </section>

            {/* Types of cookies */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Tipi di Cookie che Utilizziamo</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-deep-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-deep-blue-brand" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-deep-blue-brand mb-2">Cookie Tecnici (Essenziali)</h3>
                      <p className="text-gray-600 mb-3">
                        Questi cookie sono fondamentali per il funzionamento del sito. Senza di essi, 
                        alcune parti del sito non funzionerebbero correttamente.
                      </p>
                      <div className="bg-deep-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-deep-blue-brand">
                          <strong>Esempi:</strong> Autenticazione, carrello acquisti, preferenze di visualizzazione
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-warm-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-6 h-6 text-warm-orange-brand" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-deep-blue-brand mb-2">Cookie Analitici</h3>
                      <p className="text-gray-600 mb-3">
                        Ci aiutano a capire come visiti il nostro sito, quali pagine visiti più spesso 
                        e come ti muovi tra le pagine.
                      </p>
                      <div className="bg-warm-orange-50 p-3 rounded-lg">
                        <p className="text-sm text-warm-orange-brand">
                          <strong>Esempi:</strong> Google Analytics, statistiche di visita, tempo di permanenza
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Third-party cookies */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Cookie di Terze Parti</h2>
              <div className="bg-gray-50 p-8 rounded-2xl">
                <p className="text-gray-700 mb-6">
                  Alcuni cookie sono impostati da servizi esterni che integriamo nel nostro sito.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold text-deep-blue-brand mb-3">Google Analytics</h3>
                    <p className="text-gray-600 text-sm">
                      Utilizziamo Google Analytics per analizzare anonimamente il traffico del sito 
                      e migliorare l'esperienza utente.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold text-deep-blue-brand mb-3">Social Media</h3>
                    <p className="text-gray-600 text-sm">
                      I pulsanti di condivisione possono utilizzare cookie dei rispettivi 
                      social network per tracciare le interazioni.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie management */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Gestire i Cookie</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-4 flex items-center gap-3">
                    <Settings className="w-5 h-5 text-warm-orange-brand" />
                    Impostazioni del Browser
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Puoi gestire i cookie direttamente dal tuo browser:
                  </p>
                  <ul className="space-y-2 text-gray-600 list-disc list-inside">
                    <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti</li>
                    <li><strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie e dati dei siti</li>
                    <li><strong>Safari:</strong> Preferenze → Privacy → Cookie e dati dei siti web</li>
                    <li><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni del sito</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="font-semibold text-deep-blue-brand mb-4">Cosa puoi fare</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-deep-blue-50 rounded-lg">
                      <Eye className="w-8 h-8 text-deep-blue-brand mx-auto mb-2" />
                      <p className="text-sm font-semibold">Accettare</p>
                      <p className="text-xs text-gray-600">Permetti tutti i cookie</p>
                    </div>
                    <div className="text-center p-4 bg-warm-orange-50 rounded-lg">
                      <Settings className="w-8 h-8 text-warm-orange-brand mx-auto mb-2" />
                      <p className="text-sm font-semibold">Personalizzare</p>
                      <p className="text-xs text-gray-600">Scegli cosa accettare</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Shield className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold">Rifiutare</p>
                      <p className="text-xs text-gray-600">Blocca tutti i cookie</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Duration */}
            <section>
              <h2 className="text-2xl font-bold text-deep-blue-brand mb-6">Durata dei Cookie</h2>
              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold text-deep-blue-brand mb-3">Cookie di Sessione</h3>
                    <p className="text-gray-600">
                      Vengono eliminati quando chiudi il browser. 
                      Servono per il funzionamento immediato del sito.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl">
                    <h3 className="font-semibold text-deep-blue-brand mb-3">Cookie Persistenti</h3>
                    <p className="text-gray-600">
                      Rimangono sul tuo dispositivo per un periodo prestabilito 
                      (solitamente da pochi giorni a un anno).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section className="bg-gradient-brand text-white p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Aggiornamenti</h2>
              <p className="mb-6">
                Potremmo aggiornare questa Cookie Policy periodicamente. Ti invitiamo a 
                controllare questa pagina regolarmente per rimanere informato.
              </p>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-sm">
                  <strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT')}
                </p>
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

export default Cookie;
