import { BrowserRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './style.css'
import './website.css'
import { AuthProvider } from './hooks/useAuth.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { Capacitor } from '@capacitor/core'

import { ChatNotificationProvider } from './context/ChatNotificationContext.jsx'
import { GamificationProvider } from './context/GamificationContext.jsx'
import { SystemSettingsProvider } from './contexts/SystemSettingsContext.jsx'

// Global error handlers for non-React errors
window.onerror = function (message, source, lineno, colno, error) {
  console.error('Global error caught:', { message, source, lineno, colno, error });
  // You could potentially force a reload or show a custom UI here if needed
  return false;
};

window.onunhandledrejection = function (event) {
  console.error('Unhandled promise rejection:', event.reason);
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

function renderApp() {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <SystemSettingsProvider>
              <ChatNotificationProvider>
                <GamificationProvider>
                  <App />
                </GamificationProvider>
              </ChatNotificationProvider>
            </SystemSettingsProvider>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>,
  );
}

if (rootElement.hasChildNodes()) {
  // If the root element already has content (e.g., from SSR),
  // we can hydrate it instead of re-rendering.
  renderApp();
} else {
  // Standard client-side rendering
  renderApp();
}

// Manual Service Worker Registration (Web Only, Production Only)
// PWA is disabled in dev mode to avoid console errors
if (!Capacitor.isNativePlatform() && import.meta.env.PROD) {
  import(/* @vite-ignore */ 'virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      onNeedRefresh() { },
      onOfflineReady() { }
    })
  }).catch(err => {
    console.warn('PWA registration failed:', err);
  });
}

