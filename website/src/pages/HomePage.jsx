import React from 'react';
import Hero from '../components/Hero';
import Activities from '../components/Activities';
import Team from '../components/Team';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

const HomePage = () => {
    return (
        <>
            <SEO
                title="Home"
                description="Associazione culturale no-profit a Terni per la promozione dell'etica nell'Intelligenza Artificiale e della cultura digitale. Unisciti a noi."
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
