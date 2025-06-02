import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import VedicChart from '../components/VedicAstrology/VedicChart';
import SEO from '../components/SEO';
import { vedicChartSchema } from '../lib/schemas';
import Breadcrumbs from '../components/Breadcrumbs';
import { Helmet } from 'react-helmet-async';

const VedicChartPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-900 via-amber-950 to-amber-900">
      <SEO 
        title="Bản đồ sao Chiêm Tinh Vệ Đà | Vedic Astrology"
        description="Khám phá bản đồ sao cá nhân theo chiêm tinh Vệ Đà dựa trên thông tin ngày giờ sinh của bạn."
        schema={vedicChartSchema}
        image="https://vedicvn.com/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png"
      />
      
      <Helmet>
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Trang chủ",
                "item": "https://vedicvn.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Bản đồ sao",
                "item": "https://vedicvn.com/vedic-chart"
              }
            ]
          })}
        </script>
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs />
        </div>
        
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4">
            {t('Bản Đồ Sao Chiêm Tinh Vệ Đà')}
          </h1>
          <p className="text-lg text-amber-100 max-w-3xl mx-auto">
            {t('Khám phá bản đồ sao cá nhân của bạn dựa trên thời điểm chính xác khi bạn chào đời. Tìm hiểu vị trí và ảnh hưởng của các hành tinh trong lá số của bạn theo triết học Vệ Đà cổ đại.')}
          </p>
        </div>
        
        <VedicChart />
      </main>
      
      <Footer />
    </div>
  );
};

export default VedicChartPage;
