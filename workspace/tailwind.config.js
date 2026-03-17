/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Libre Baskerville"', 'serif'],
                serif: ['"Libre Baskerville"', 'serif'],
                mono: ['"Libre Baskerville"', 'serif'],
            },
            colors: {
                // Primary Brand Colors - Logo Derived
                deepBlue: {
                    50: '#f0f9ff',
                    100: '#e0f2fe', 
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                    // Brand specific deep blue
                    DEFAULT: '#1a2b4b',
                    brand: '#1a2b4b',
                },
                warmOrange: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                    // Brand specific warm orange
                    DEFAULT: '#c0672a',
                    brand: '#c0672a',
                },
                // Secondary Palette - Clean & Minimal
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
                // Semantic Colors
                white: '#ffffff',
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                },
                // Legacy Support
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                // CSS Variables for Dynamic Theming
                'arq-bg': 'var(--color-arq-bg)',
                'arq-primary': 'var(--color-arq-primary)',
                'arq-accent': 'var(--color-arq-accent)',
                'arq-glass': 'var(--color-arq-glass)',
                'arq-glassBorder': 'var(--color-arq-glassBorder)',
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'fade-in-up': 'fadeInUp 1s ease-out forwards',
                'draw-ribbon': 'drawRibbon 2s ease-in-out forwards',
                'grow-line': 'growLine 1s ease-out forwards',
                // Smooth transitions for brand colors
                'pulse-blue': 'pulseBlue 3s ease-in-out infinite',
                'pulse-orange': 'pulseOrange 3s ease-in-out infinite',
                'gradient-shift': 'gradientShift 4s ease-in-out infinite',
                'glow-blue': 'glowBlue 2s ease-in-out infinite',
                'glow-orange': 'glowOrange 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                drawRibbon: {
                    '0%': { strokeDashoffset: '1000', opacity: '0' },
                    '100%': { strokeDashoffset: '0', opacity: '1' },
                },
                growLine: {
                    '0%': { height: '0' },
                    '100%': { height: '100%' },
                },
                // Brand color animations
                pulseBlue: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                pulseOrange: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                glowBlue: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(26, 43, 75, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(26, 43, 75, 0.6)' },
                },
                glowOrange: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(192, 103, 42, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(192, 103, 42, 0.6)' },
                },
            }
        },
    },
    plugins: [],
}
