import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Users, BookOpen, Share2 } from 'lucide-react';

const activities = [
    {
        icon: <BookOpen size={40} />,
        title: "Formazione",
        description: "Corsi, workshop, laboratori, seminari ed eventi formativi."
    },
    {
        icon: <Share2 size={40} />,
        title: "Divulgazione",
        description: "Attività di divulgazione e produzione di materiali educativi."
    },
    {
        icon: <Microscope size={40} />,
        title: "Ricerca",
        description: "Progetti di ricerca e sperimentazione metodologica."
    },
    {
        icon: <Users size={40} />,
        title: "Networking",
        description: "Attività di networking e collaborazione interdisciplinare."
    }
];

const Activities = () => {
    return (
        <section id="attivita" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-arq-accent tracking-widest uppercase text-sm font-bold">Cosa facciamo</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Le Nostre Attività</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Per il raggiungimento dei propri scopi l’Associazione svolge diverse attività culturali ed educative.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-8 rounded-2xl border-white/5 hover:border-arq-accent/30 transition-all group"
                        >
                            <div className="mb-6 text-arq-accent group-hover:text-white transition-colors p-4 bg-white/5 rounded-full inline-block">
                                {activity.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-light">
                                {activity.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Activities;
