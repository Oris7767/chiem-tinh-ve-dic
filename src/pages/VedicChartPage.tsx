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
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-900 via-amber-950 to-amber-900">
      <SEO
        title={t('birthChart.seoTitle')}
        description={t('birthChart.seoDescription')}
        keywords={t('birthChart.seoKeywords')}
        schema={vedicChartSchema}
        lang={language === 'vi' ? 'vi' : 'en'}
      />
      
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs />
        </div>
        
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4">
            {t('birthChart.title')}
          </h1>
          <p className="text-lg text-amber-100 max-w-3xl mx-auto">
            {t('birthChart.subtitle')}
          </p>
        </div>
        
        <VedicChart />
      </main>
      
      <Footer />
    </div>
  );
};

export default VedicChartPage;
