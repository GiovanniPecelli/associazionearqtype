import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'Home',
    description = "Promuoviamo una cultura critica, etica e consapevole delle tecnologie digitali e dell'intelligenza artificiale.",
    keywords = 'Associazione ARQtype, IA Etica, Cultura Digitale, Terni, Umbria, Innovazione Sociale',
    canonical = '/',
    image = 'https://www.associazionearqtype.it/assets/arqtype_logo.png'
}) => {
    const siteUrl = 'https://www.associazionearqtype.it';
    const siteName = 'Associazione ARQtype';
    const fullCanonical = canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | {siteName}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={`${title} | ${siteName}`} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content="it_IT" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@associazionearqtype" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={`${title} | ${siteName}`} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
