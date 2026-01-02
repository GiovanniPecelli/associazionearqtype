import React from 'react';

const teamMembers = [
    { name: 'Francesco', role: 'Presidente / Founder', img: '/assets/founder1.jpg' },
    { name: 'Emilio', role: 'Co-Founder', img: '/assets/co-founder2.jpg' },
    { name: 'Giovanni', role: 'Developer', img: '/assets/dev2.jpg' },
    { name: 'Michele', role: 'Sales & Marketing', img: '/assets/sales2.jpg' },
];

const Team = () => {
    return (
        <section id="team" className="py-24 bg-black/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Soci Fondatori</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="text-center group flex flex-col items-center">
                            <div className="relative w-64 h-80 overflow-hidden rounded-2xl mb-6 border border-white/10 group-hover:border-arq-accent/50 transition-all">
                                <img
                                    src={member.img}
                                    alt={member.role}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Member' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <span className="text-arq-accent font-bold">{member.role}</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold">{member.name}</h3>
                            <p className="text-gray-400 font-light">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
