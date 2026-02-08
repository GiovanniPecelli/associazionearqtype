import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Helper to check if we are in a dev environment
const isDev = import.meta.env.DEV

if (isDev) {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl ? '✅ Set' : '❌ Missing',
    key: supabaseAnonKey ? '✅ Set' : '❌ Missing',
    urlValue: supabaseUrl?.substring(0, 30) + '...'
  })
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables!')
  console.error('Make sure .env file exists with:')
  console.error('VITE_SUPABASE_URL=your-url')
  console.error('VITE_SUPABASE_ANON_KEY=your-key')
}

/**
 * Cookie-based storage adapter for Supabase.
 * This ensures authentication persists across browser sessions and works better
 * in browsers with strict third-party storage policies (like Brave).
 */
const cookieStorage = {
  getItem: (key) => {
    try {
      if (typeof document === 'undefined') return null
      const cookies = document.cookie.split(';')
      const cookie = cookies.find((c) => c.trim().startsWith(`${key}=`))
      if (!cookie) return null
      return decodeURIComponent(cookie.split('=')[1])
    } catch (e) {
      if (isDev) console.error('Error getting cookie:', e)
      return null
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof document === 'undefined') return
      // Set cookie to expire in 1 year
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
      const isSecure = window.location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax${isSecure}`
    } catch (e) {
      if (isDev) console.error('Error setting cookie:', e)
    }
  },
  removeItem: (key) => {
    try {
      if (typeof document === 'undefined') return
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure`
    } catch (e) {
      if (isDev) console.error('Error removing cookie:', e)
    }
  },
}

/**
 * Supabase client configuration
 * Uses cookieStorage by default, falling back to localStorage if needed by passing strict options.
 */
// Use environment variables instead of hardcoded placeholders
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: cookieStorage,
    },
  }
)

if (isDev) {
  console.log('✅ Supabase client created with cookie storage')
}
