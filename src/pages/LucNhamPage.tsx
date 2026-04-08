import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { lucNhamSchema } from '../lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LUC_NHAM_DATA_VERSION } from '../data/lucNham';

const LucNhamPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-900 via-amber-950 to-amber-900">
      <SEO title={t('lucNham.seoTitle')} description={t('lucNham.seoDescription')} schema={lucNhamSchema} />

      <NavBar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4 font-serif">
            {t('lucNham.title')}
          </h1>
          <p className="text-lg text-amber-100 max-w-3xl mx-auto leading-relaxed">
            {t('lucNham.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 max-w-3xl mx-auto">
          <Card className="border-amber-800/60 bg-stone-900/70 text-amber-50 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-amber-100">{t('lucNham.localDataTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-amber-100/90 text-sm md:text-base leading-relaxed">
              <p>{t('lucNham.localDataBody')}</p>
              <p className="text-amber-200/80 text-xs md:text-sm">
                {t('lucNham.dataVersionLabel')}: {LUC_NHAM_DATA_VERSION}
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-800/60 bg-stone-900/70 text-amber-50 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-amber-100">{t('lucNham.calculatorTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="text-amber-100/90 text-sm md:text-base leading-relaxed">
              <p>{t('lucNham.calculatorPlaceholder')}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LucNhamPage;
