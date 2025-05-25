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
        <title>Bản đồ sao Chiêm Tinh Vệ Đà | Vedic Astrology</title>
        <meta name="description" content="Khám phá bản đồ sao cá nhân theo chiêm tinh Vệ Đà dựa trên thông tin ngày giờ sinh của bạn." />
      </Helmet>
      
      <NavBar />
      
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4">
            {t('vedicChart.title') || 'Bản đồ sao Chiêm Tinh Vệ Đà'}
          </h1>
          <p className="text-lg text-amber-100 max-w-3xl mx-auto">
            {t('vedicChart.subtitle') || 'Khám phá bản đồ sao cá nhân của bạn dựa trên thời điểm chính xác khi bạn chào đời. Tìm hiểu vị trí và ảnh hưởng của các hành tinh trong lá số của bạn theo triết học Vệ Đà cổ đại.'}
          </p>
        </div>
        
        <VedicChart />
      </main>
      
      <Footer />
    </div>
  );
};

export default VedicChartPage;
