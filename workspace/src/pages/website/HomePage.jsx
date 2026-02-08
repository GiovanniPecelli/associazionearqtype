import React from 'react';
import Hero from '../../components/website/Hero';
import Activities from '../../components/website/Activities';
import Team from '../../components/website/Team';
import Contact from '../../components/website/Contact';
import SEO from '../../components/website/SEO';

const HomePage = () => {
    return (
        <>
            <SEO
                title="Associazione ARQtype | Cultura Digitale, IA e Innovazione a Terni"
                description="Associazione ARQtype è un'associazione culturale no-profit a Terni. Promuoviamo l'uso etico dell'Intelligenza Artificiale, la cultura digitale e l'innovazione sociale in Umbria."
                canonical="/"
            />
            <Hero />
            <Activities />
            <Team />
            <Contact />
        </>
    );
};

export default HomePage;
