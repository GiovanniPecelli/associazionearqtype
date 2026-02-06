@echo off
echo Stopping any running Node.js processes...
taskkill /F /IM node.exe

echo.
echo ===================================================
echo     AVVIO PROGETTO ARQTYPE UNIFICATO
echo ===================================================
echo.
echo Spostamento nella cartella corretta (workspace)...
cd workspace

echo.
echo Installazione dipendenze (potrebbe richiedere un momento)...
call npm install

echo.
echo Avvio del server...
echo Quando appare il link (es. http://localhost:5174), CRTL+CLICK per aprirlo.
echo.
npm run dev
pause
