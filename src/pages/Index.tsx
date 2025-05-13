import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import AboutSlider from '../components/AboutSlider';
import Footer from '../components/Footer';
import NewsletterSignup from '../components/NewsletterSignup';
import { Button } from '@/components/ui/button';
import { Calculator, Compass } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <Helmet>
        <title>chiemtinhvedavn - Chiêm tinh Vệ Đà</title>
        <meta name="description" content="Khám phá chiêm tinh Vệ Đà, số học và blog về phong thủy và tâm linh." />
        <meta name="keywords" content="chiêm tinh Vệ Đà, số học, phong thủy, tâm linh, chiemtinhvedavn" />
        <link rel="canonical" href="https://vedicvn.com/" />
      </Helmet>
      
      <NavBar />
      <main className="flex-grow">
        
        
        <Hero />
        
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center md:text-left">
                <h2 className="text-2xl font-bold text-amber-800 mb-4">
                  {t('home.numerology') || 'Numerology'}
                </h2>
                <p className="mb-6 text-gray-700">
                  {t('home.numerologyDesc') || 'Discover the mystical connection between numbers and your life path. Calculate your personal numerology chart and gain insights into your character and destiny.'}
                </p>
                <Link to="/numerology">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Calculator className="mr-2 h-4 w-4" />
                    {t('home.calculateNumerology') || 'Calculate Numerology'}
                  </Button>
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg text-center md:text-left">
                <h2 className="text-2xl font-bold text-amber-800 mb-4">
                  {t('home.vedicAstrology') || 'Vedic Astrology'}
                </h2>
                <p className="mb-6 text-gray-700">
                  {t('home.vedicAstrologyDesc') || 'Explore ancient Vedic wisdom through your personalized birth chart. Understand planetary influences and cosmic patterns affecting your life.'}
                </p>
                <Link to="/vedic-chart">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Compass className="mr-2 h-4 w-4" />
                    {t('home.calculateVedicChart') || 'Calculate Birth Chart'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <AboutSlider />
        
        <NewsletterSignup />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
