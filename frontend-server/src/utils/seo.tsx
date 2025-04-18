
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  lang?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImageUrl = 'https://vedicvn.com/lovable-uploads/a4ffc284-5fa3-4e81-b16e-11136da35031.png',
  jsonLd,
  article,
  noindex = false,
  lang = 'vi',
}) => {
  const metaTitle = `${title} | chiemtinhvedavn`;
  const baseUrl = 'https://vedicvn.com';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

  // Format JSON-LD as array for multiple structured data objects
  const formattedJsonLd = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  
  // Add website structured data if not provided
  if (formattedJsonLd.length === 0 || !formattedJsonLd.some(item => item['@type'] === 'WebSite')) {
    formattedJsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'url': baseUrl,
      'name': 'chiemtinhvedavn',
      'description': 'Khám phá số học và chiêm tinh Vệ Đà qua các công cụ miễn phí.',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
  }

  return (
    <Helmet htmlAttributes={{ lang }}>
      {/* Basic meta tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="chiemtinhvedavn" />
      <meta property="og:locale" content="vi_VN" />
      
      {/* Article specific Open Graph tags */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map((tag, index) => (
            <meta property="article:tag" content={tag} key={index} />
          ))}
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Mobile Specific */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#B45309" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data / JSON-LD */}
      {formattedJsonLd.map((jsonLdItem, index) => (
        <script type="application/ld+json" key={index}>
          {JSON.stringify(jsonLdItem)}
        </script>
      ))}
    </Helmet>
  );
};
