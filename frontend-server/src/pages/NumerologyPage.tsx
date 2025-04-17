
import React from 'react';
import NavBar from '../components/NavBar';
import Calculator from '../components/Calculator';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const NumerologyPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
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
