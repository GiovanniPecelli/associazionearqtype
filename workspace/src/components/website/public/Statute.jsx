import React, { useState } from 'react';
import { statuteData } from '../../data/statuteData';
import { motion } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const Statute = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Preview shows first 15 lines/paragraphs
    const previewData = statuteData.slice(0, 15);
    const displayData = isExpanded ? statuteData : previewData;

    return (
        <section id="statuto" className="py-24 bg-black/50 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Statuto Sociale</h2>
                    <div className="w-20 h-1 bg-arq-primary mx-auto rounded-full" />
                </div>

                <div className="max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FileText size={120} />
                    </div>

                    <div className="space-y-4 text-gray-300 leading-relaxed font-light">
                        {displayData.map((paragraph, index) => {
                            // Simple heuristic for headers (Art. X or ALL CAPS short lines)
                            const isHeader = paragraph.toUpperCase() === paragraph && paragraph.length < 50 || paragraph.startsWith('Art.');

                            if (isHeader) {
                                return <h3 key={index} className="text-xl text-white font-bold pt-6 pb-2">{paragraph}</h3>;
                            }
                            return <p key={index}>{paragraph}</p>;
                        })}
                    </div>

                    {!isExpanded && (
                        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-arq-bg via-arq-bg/90 to-transparent flex items-end justify-center pb-8">
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-arq-primary text-white rounded-full hover:bg-arq-primary/80 transition-all shadow-lg hover:shadow-arq-primary/20"
                            >
                                Leggi tutto <ChevronDown size={18} />
                            </button>
                        </div>
                    )}

                    {isExpanded && (
                        <div className="mt-12 text-center">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="flex items-center gap-2 px-6 py-3 glass text-white rounded-full hover:bg-white/10 transition-all mx-auto"
                            >
                                Riduci <ChevronUp size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Statute;
