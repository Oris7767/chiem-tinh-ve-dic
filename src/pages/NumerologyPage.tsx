
import React from 'react';
import NavBar from '../components/NavBar';
import Calculator from '../components/Calculator';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';

const NumerologyPage = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{language === 'en' ? 'Numerology Calculator - Vedic Numerology' : 'Máy Tính Số Học - Số Học Vệ Đà'}</title>
        <meta 
          name="description" 
          content={language === 'en' 
            ? 'Calculate your birth number, name number and life number with our Vedic Numerology Calculator.' 
            : 'Tính toán số ngày sinh, số tên và số đường đời của bạn với Máy tính Số học Vệ Đà của chúng tôi.'}
        />
      </Helmet>
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
                {t('calculator.title')}
              </h1>
              <p className="text-lg text-amber-800">
                {t('calculator.subtitle')}
              </p>
            </div>
            
            <Calculator />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NumerologyPage;
