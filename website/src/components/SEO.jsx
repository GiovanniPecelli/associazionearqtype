import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    canonical,
    image = 'https://www.associazionearqtype.it/assets/arqtype_logo.png'
}) => {
    const siteUrl = 'https://www.associazionearqtype.it';
    const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | Associazione ARQtype</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

SEO.defaultProps = {
    title: 'Home',
    description: 'Promuoviamo una cultura critica, etica e consapevole delle tecnologie digitali e dell\'intelligenza artificiale.',
    keywords: 'Associazione ARQtype, IA Etica, Cultura Digitale, Terni',
    canonical: '/'
};

export default SEO;
