import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_IMAGE =
  'https://vedicvn.com/images/og-image.png';
const BASE_URL = 'https://vedicvn.com';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  schema?: Record<string, unknown>;
  /** Thêm các khối JSON-LD (ví dụ FAQ, BreadcrumbList riêng) */
  jsonLd?: Array<Record<string, unknown>>;
  keywords?: string;
  noindex?: boolean;
  lang?: string;
}

const SEO = ({
  title = 'Số học Vệ Đà - chiemtinhvedavn',
  description = 'Khám phá ý nghĩa sâu sắc đằng sau những con số trong cuộc sống của bạn dựa trên nguyên lý cổ đại của số học Vệ Đà.',
  image = DEFAULT_IMAGE,
  schema,
  jsonLd,
  keywords,
  noindex = false,
  lang = 'vi',
}: SEOProps) => {
  const location = useLocation();
  const rawPath = location.pathname || '/';
  const path =
    rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  const canonicalUrl = `${BASE_URL}${path === '' ? '/' : path}`;
  const ogImage = image.startsWith('http')
    ? image
    : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  const structuredBlocks: Array<Record<string, unknown>> = [];
  if (schema) structuredBlocks.push(schema);
  if (jsonLd?.length) structuredBlocks.push(...jsonLd);

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="chiemtinhvedavn" />
      <meta property="og:locale" content="vi_VN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#A11211" />

      {structuredBlocks.map((obj, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
