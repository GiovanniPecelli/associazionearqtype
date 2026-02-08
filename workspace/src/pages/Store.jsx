import { motion } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';
import { Link } from 'react-router-dom';

export default function Store() {
    return (
        <PageTransition className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-pink-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-pink-500/20">
                        <span className="text-5xl">🛍️</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black text-white tracking-tight"
                >
                    Coming Soon
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-400 leading-relaxed font-light"
                >
                    The <span className="text-pink-400 font-semibold">Store</span> is opening soon.
                    Save your Impact Points for exclusive rewards, skins, and perks.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="pt-8"
                >
                    <Link to="/home" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-medium">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </PageTransition>
    );
}
