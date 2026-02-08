import React from 'react';
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
                <div className="text-center mb-16">
                    <span className="text-indigo-400 tracking-widest uppercase text-sm font-bold">Cosa facciamo</span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-white">
                        Le Nostre <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">Attività</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Per il raggiungimento dei propri scopi l’Associazione ARQtype svolge diverse attività culturali ed educative.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activities.map((activity, index) => (
                        <div
                            key={index}
                            className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors group"
                        >
                            <div className="mb-6 text-indigo-400 group-hover:text-fuchsia-400 transition-colors p-4 bg-white/5 rounded-full inline-block">
                                {activity.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{activity.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-light">
                                {activity.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Activities;
