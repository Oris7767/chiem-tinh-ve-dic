
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import VedicChart from '../components/VedicAstrology/VedicChart';

const VedicChartPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-900 via-amber-950 to-amber-900">
      <Helmet>
        <title>Vedic Astrology Chart | Chiêm tinh Vệ Đà</title>
        <meta name="description" content="Create your personalized Vedic astrology chart based on your birth date, time, and location. Discover planetary positions and their influences." />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4">
            {t('vedicChart.title') || 'Vedic Astrological Chart'}
          </h1>
          <p className="text-lg text-amber-100 max-w-3xl mx-auto">
            {t('vedicChart.subtitle') || 'Calculate your personalized Vedic astrological chart based on your birth details. Discover the positions of planets at the time of your birth and their influences.'}
          </p>
        </div>
        
        <VedicChart />
      </main>
      
      <Footer />
    </div>
  );
};

export default VedicChartPage;
