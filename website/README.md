# Sito Web - Associazione Culturale ARQtype

Questo è il sito web vetrina ufficiale dell'Associazione ARQtype.
Il progetto è costruito con **React**, **Vite** e **Tailwind CSS**.

## 📂 Struttura del Progetto

Il progetto è completamente autonomo.
*   `src/`: Contiene tutto il codice sorgente (componenti, pagine, stili).
*   `public/`: Contiene le immagini e gli asset statici (logo, icone, foto).
*   `index.html`: Il punto di ingresso del sito.

## 🚀 Come Spostare o Copiare il Progetto

Puoi spostare l'intera cartella `Associate_ARQtype` o `website` dove vuoi (su un altro PC, chiavetta USB, ecc.).

**Consiglio:** Se devi spostarlo su un altro computer, è meglio **cancellare** la cartella `node_modules` prima di copiare (occupa molto spazio ed è composta da migliaia di file). Potrai reinstallarla facilmente sul nuovo computer.

## 🛠️ Come Avviare il Sito (Istruzioni)

Se hai spostato il progetto o vuoi riavviarlo in futuro:

1.  Assicurati di avere **Node.js** installato.
2.  Apri il terminale nella cartella `website`.
3.  Se è la prima volta (o hai cancellato `node_modules`), esegui:
    ```bash
    npm install
    ```
4.  Per avviare il sito in locale (modalità sviluppo):
    ```bash
    npm run dev
    ```
    Il sito sarà visibile su `http://localhost:5173`.

## 📦 Preparare per la Pubblicazione (Build)

Quando sei pronto per pubblicare il sito online (es. su Netlify, Vercel o Hosting tradizionale):

1.  Esegui il comando di build:
    ```bash
    npm run build
    ```
2.  Verrà creata una cartella `dist`.
3.  Il contenuto della cartella `dist` è il tuo **sito completo e ottimizzato**. Puoi caricare questi file direttamente sul tuo hosting.

## 📝 Note sui Contenuti

*   **Statuto**: Il testo dello statuto si trova in `src/data/statuteData.js` (estratto dal PDF).
*   **Contatti**: L'email è impostata su `associazione.arqtype@protonmail.com`.
