import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useSystemSettings } from '../../contexts/SystemSettingsContext'
import Button from '../common/Button.jsx'
import PageTransition from '../common/PageTransition'

// Memoized Background Component - ARQtype Brand Design
const Background = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-br from-slate-900 via-deep-blue-brand to-slate-900">
    {/* ARQtype floating orbs */}
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-warm-orange-brand/10 blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-brand/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }} />
  </div>
))

export function Login({ isSignup = false }) {
  const { signupEnabled } = useSystemSettings()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSignUp, setIsSignUp] = useState(isSignup)
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)

  // ... handleSubmit ...
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // DEBUG: Trace form submission
    console.log('Attempting auth:', isSignUp ? 'Sign Up' : 'Sign In', { email })

    if (isSignUp && !signupEnabled) {
      setError("Registrations are currently closed.")
      setLoading(false)
      return
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        // DEBUG: Trace Sign Up Call
        console.log('Calling supabase.auth.signUp...')
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        })

        console.log('Sign Up Response:', { data, error })

        if (error) throw error

        // Critical: Check if user was actually created
        if (!data.user) {
          console.error('No user returned from Sign Up (Identity Service issue?)')
          throw new Error('User creation failed. Please try again or contact support.')
        }

        setShowConfirmationMessage(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (error) {
      console.error('Auth Error:', error)
      setError(error.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (showConfirmationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white relative font-sans">
        <Background />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10"
        >
          <div className="w-16 h-16 bg-warm-orange-brand/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-warm-orange-brand/30">
            <span className="text-2xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-black">Registrazione Completata!</h1>
          <p className="text-gray-700 mb-8 leading-relaxed">
            Controlla la tua email per il link di conferma e attiva il tuo account.
            Una volta confermato, potrai accedere.
          </p>
          <Button
            onClick={() => {
              setShowConfirmationMessage(false)
              setIsSignUp(false)
            }}
            className="w-full py-3.5 text-black font-bold"
            variant="primary"
          >
            Back to Sign In
          </Button>
        </motion.div>
      </div>
    )
  }

  // If trying to access SignUp but it's disabled, force SignIn view or show message
  // We can also allow them to toggle to Sign In
  const showClosedMessage = isSignUp && !signupEnabled;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-deep-blue-brand to-slate-900 text-white relative font-sans py-12 px-4 overflow-y-auto">
      <Background />

      <PageTransition
        className="bg-white/10 backdrop-blur-md border border-white/20 p-8 sm:p-10 md:p-14 rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg relative z-10"
      >
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link to="/" className="text-gray-700 hover:text-warm-orange-brand transition-colors flex items-center gap-2 group">
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-medium">Indietro</span>
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/logonobg.png"
              alt="ARQtype"
              className="h-10 md:h-12 w-auto object-contain filter brightness-0 invert"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-black tracking-tight">
            {showClosedMessage ? 'Registrazione Chiusa' : (isSignUp ? 'Crea Account' : 'Bentornato')}
          </h1>
          <p className="text-gray-700 mt-1 text-xs md:text-sm">
            {showClosedMessage
              ? 'Attualmente non accettiamo nuove registrazioni pubbliche.'
              : (isSignUp ? 'Unisciti all\'ecosistema ARQtype' : 'Inserisci i tuoi dati per accedere')}
          </p>
        </div>

        {showClosedMessage ? (
          <div className="space-y-6 text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-gray-700 text-sm">
                L'accesso è attualmente limitato a inviti o membri esistenti.
                Se hai un account, per favore accedi.
              </p>
            </div>
            <Button
              onClick={() => setIsSignUp(false)}
              variant="primary"
              className="w-full py-3.5 md:py-4 md:text-lg text-black font-bold"
            >
              Accedi invece
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-black uppercase tracking-wider mb-2">
                  Indirizzo Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 md:py-3 text-sm bg-white/90 border border-black/20 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-warm-orange-brand/50 focus:border-transparent transition-all"
                  placeholder="nome@azienda.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-black uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 md:py-3 text-sm bg-white/90 border border-black/20 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-warm-orange-brand/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-2">
                    Conferma Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white/90 border border-black/20 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-warm-orange-brand/50 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                  />
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm flex items-start gap-3"
                >
                  <span className="text-lg">⚠️</span>
                  <p>{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full py-2.5 md:py-3 text-sm md:text-base text-black font-bold"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-warm-orange-brand animate-spin" />
                    Elaborazione...
                  </span>
                ) : isSignUp ? 'Crea Account' : 'Accedi'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-700 text-sm">
                {isSignUp ? 'Hai già un account?' : "Non hai un account?"}
                <button
                  onClick={() => {
                    setError(null)
                    setIsSignUp(!isSignUp)
                  }}
                  className="ml-2 text-warm-orange-brand font-bold hover:text-black transition-all"
                >
                  {isSignUp ? 'Accedi' : 'Registrati'}
                </button>
              </p>
            </div>
          </>
        )}
      </PageTransition>
    </div>
  )
}
