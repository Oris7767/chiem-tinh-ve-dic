
import React from 'react';
import NavBar from '../components/NavBar';
import Calculator from '../components/Calculator';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { numerologyPageSchema } from '../lib/schemas';

const NumerologyPage = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={t('numerologyPage.seoTitle')}
        description={t('numerologyPage.seoDescription')}
        keywords={t('numerologyPage.seoKeywords')}
        schema={numerologyPageSchema}
        lang={language === 'vi' ? 'vi' : 'en'}
      />
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-votive-red mb-4 font-serif">
                {t('calculator.title')}
              </h1>
              <p className="text-lg text-votive-muted">
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
