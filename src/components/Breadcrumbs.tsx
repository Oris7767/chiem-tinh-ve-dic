import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const DARK_HERO_ROUTES = ['/vedic-chart', '/luc-nham'];

const Breadcrumbs = () => {
  const location = useLocation();
  const { t, language } = useLanguage();

  const isOnDarkHero = DARK_HERO_ROUTES.some(
    (r) => location.pathname === r || location.pathname.startsWith(`${r}/`)
  );

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: language === 'vi' ? 'Trang chủ' : 'Home', path: '/' }
    ];

    let currentPath = '';
    paths.forEach(path => {
      currentPath += `/${path}`;
      let label = '';

      switch (path) {
        case 'blog':
          label = 'Blog';
          break;
        case 'vedic-chart':
          label = language === 'vi' ? 'Chiêm Tinh Vệ Đà' : 'Vedic Chart';
          break;
        case 'numerology':
          label = language === 'vi' ? 'Số học Vệ Đà' : 'Vedic Numerology';
          break;
        case 'luc-nham':
          label = t('nav.lucNham');
          break;
        default:
          label = path;
      }

      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Generate schema markup for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://vedicvn.com${item.path}`
    }))
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {breadcrumbs.map((item, index) => (
            <li key={item.path} className="inline-flex items-center">
              {index > 0 && (
                <ChevronRight
                  className={`w-4 h-4 mx-1 ${isOnDarkHero ? 'text-amber-500' : 'text-amber-600'}`}
                />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span
                  className={`font-medium ${isOnDarkHero ? 'text-amber-100' : 'text-amber-900'}`}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={
                    isOnDarkHero
                      ? 'text-amber-300 hover:text-amber-50 transition-colors'
                      : 'text-amber-600 hover:text-amber-900 transition-colors'
                  }
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs; 