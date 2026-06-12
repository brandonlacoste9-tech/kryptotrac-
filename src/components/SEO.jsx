import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, image, type = 'website', schema }) => {
  const siteName = 'HELL YEAH GAMES';
  const defaultTitle = '🔥 HELL YEAH GAMES — Play Now';
  const defaultDescription = "Hell Yeah Games — 860+ of the world's best casual & hardcore browser games. One platform. Zero compromises.";
  const defaultImage = 'https://hellyeah-games.com/seo-banner.jpg';
  const defaultUrl = 'https://hellyeah-games.com';

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoUrl = url || defaultUrl;
  const seoImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={seoImage} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
