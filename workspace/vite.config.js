import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'sw.js',
            registerType: 'autoUpdate',
            injectRegister: null, // We will manually register in main.jsx
            devOptions: {
                enabled: false // Disable PWA in development to prevent errors
            },
            includeAssets: ['vite.svg', 'robots.txt'],
            manifest: {
                name: 'ARQtype Association',
                short_name: 'ARQtype',
                description: 'Intelligenza Artificiale Etica e Sostenibile per il Terzo Settore',
                theme_color: '#1a2b4b',
                background_color: '#ffffff',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/pwa-192x192.webp',
                        sizes: '192x192',
                        type: 'image/webp',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/pwa-512x512.webp',
                        sizes: '512x512',
                        type: 'image/webp',
                        purpose: 'any maskable'
                    }
                ]
            }
        })
    ],
    server: {
        port: 3000,
        strictPort: false,
        host: true
    },
}))
