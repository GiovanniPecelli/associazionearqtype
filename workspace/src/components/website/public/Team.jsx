import React from 'react';

const teamMembers = [
    { name: 'Francesco', role: 'Presidente', img: '/assets/founder1.jpg' },
    { name: 'Emilio', role: 'Socio Fondatore', img: '/assets/co-founder2.jpg' },
    { name: 'Giovanni', role: 'Socio Fondatore', img: '/assets/dev2.jpg' },
    { name: 'Michele', role: 'Socio Fondatore', img: '/assets/sales2.jpg' },
];

const Team = () => {
    return (
        <section id="team" className="py-24 bg-black/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6 text-white">
                        Soci <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">Fondatori</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="text-center group flex flex-col items-center">
                            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl mb-6 border border-white/10 group-hover:border-indigo-500/50 transition-all">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Member' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-6">
                                    <span className="text-indigo-400 font-bold">{member.role}</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-gray-400 font-light text-sm">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
