
import React from 'react';
import { Helmet } from 'react-helmet-async';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import VedicChart from '../components/VedicAstrology/VedicChart';

const VedicAstrologyPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <Helmet>
        <title>Bản đồ Sao Chiêm tinh Vệ Đà | chiemtinhvedavn</title>
        <meta name="description" content="Tính toán bản đồ sao chiêm tinh Vệ Đà dựa trên chi tiết sinh của bạn và khám phá ảnh hưởng của các thiên thể lên cuộc sống của bạn" />
        <meta name="keywords" content="bản đồ sao, chiêm tinh Vệ Đà, Jyotish, vedic astrology, chiemtinhvedavn, birth chart" />
        <link rel="canonical" href="https://vedicvn.com/vedic-chart" />
      </Helmet>
      
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-2">
                {t('birthChart.title') || 'Bản đồ Sao Chiêm tinh Vệ Đà'}
              </h1>
              <p className="text-lg text-amber-800 max-w-2xl mx-auto">
                {t('birthChart.subtitle') || 'Tính toán bản đồ sao chiêm tinh Vệ Đà dựa trên chi tiết sinh của bạn và khám phá ảnh hưởng của các thiên thể lên cuộc sống của bạn'}
              </p>
            </div>
            
            <VedicChart />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VedicAstrologyPage;
