import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  schema?: object;
}

const SEO = ({ 
  title = 'Số học Vệ Đà - chiemtinhvedavn',
  description = 'Khám phá ý nghĩa sâu sắc đằng sau những con số trong cuộc sống của bạn dựa trên nguyên lý cổ đại của số học Vệ Đà.',
  image = 'https://vedicvn.com/lovable-uploads/a4ffc284-5fa3-4e81-b16e-11136da35031.png',
  schema
}: SEOProps) => {
  const location = useLocation();
  const canonicalUrl = `https://vedicvn.com${location.pathname}`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="chiemtinhvedavn" />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 