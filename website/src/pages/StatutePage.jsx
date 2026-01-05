import React from 'react';
import { statuteData } from '../data/statuteData';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const StatutePage = () => {
    return (
        <div className="min-h-screen bg-arq-bg pt-20 pb-20">
            <SEO
                title="Statuto"
                description="Consulta lo Statuto dell'Associazione ARQtype. Regolamento, scopi associativi e norme per i soci."
                canonical="/statuto"
            />
            <div className="container mx-auto px-6 max-w-4xl">
                <Link to="/" className="inline-flex items-center gap-2 text-arq-accent hover:text-white transition-colors mb-8">
                    <ArrowLeft size={20} /> Torna alla Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 rounded-2xl border border-white/5"
                >
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Statuto Sociale</h1>
                        <div className="w-24 h-1 bg-arq-primary mx-auto rounded-full" />
                        <p className="mt-4 text-gray-400">Versione Integrale</p>
                    </div>

                    <div className="space-y-6 text-gray-300 leading-relaxed font-light text-lg">
                        {statuteData.map((paragraph, index) => {
                            const isHeader = paragraph.toUpperCase() === paragraph && paragraph.length < 50 || paragraph.startsWith('Art.');

                            if (isHeader) {
                                return <h3 key={index} className="text-2xl text-white font-bold pt-8 pb-4 border-b border-white/5">{paragraph}</h3>;
                            }
                            return <p key={index}>{paragraph}</p>;
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default StatutePage;
