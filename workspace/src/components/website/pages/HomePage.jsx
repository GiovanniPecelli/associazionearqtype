import React from 'react';
import Hero from '../public/Hero';
import InternalHub from '../public/InternalHub';
import Activities from '../public/Activities';
import Team from '../public/Team';
import Contact from '../public/Contact';
import SEO from '../public/SEO';

const HomePage = () => {
    return (
        <>
            <SEO
                title="ARQtype Association | Digital Culture, AI and Innovation"
                description="ARQtype Association is a non-profit cultural organization in Terni. We promote ethical use of Artificial Intelligence, digital culture and social innovation in Umbria."
                canonical="/"
            />
            <Hero />
            <InternalHub />
            <Activities />
            <Team />
            <Contact />
        </>
    );
};

export default HomePage;
