import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description,
    name = 'ARQTYPE',
    type = 'website',
    image = '/og-image.png' // We'll need to create/ensure this exists
}) {
    const siteTitle = title ? `${title} | ${name}` : name;

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
