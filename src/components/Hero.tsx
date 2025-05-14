
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator, ChevronRight, Pizza, Star } from 'lucide-react';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-b from-amber-50 to-amber-100 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 leading-tight">
              {t('hero.title') || 'Discover the Ancient Wisdom of Numbers'}
            </h1>
            <p className="text-lg md:text-xl text-amber-700">
              {t('hero.subtitle') || 'Unlock the secrets of your life path, personality, and potential through the sacred science of Numerology'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="bg-amber-600 hover:bg-amber-700"
                asChild
              >
                <Link to="/numerology">
                  <Calculator className="mr-2 h-5 w-5" />
                  {t('hero.cta') || 'Calculate Your Numbers'}
                </Link>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-amber-600 text-amber-700 hover:bg-amber-100"
                asChild
              >
                <Link to="/vedic-astrology">
                  <Star className="mr-2 h-5 w-5" />
                  {t('hero.learnMore') || 'Explore Vedic Astrology'}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-amber-300 rounded-full blur-3xl opacity-20 -z-10"></div>
            <img
              src="/placeholder.svg"
              alt="Numerology"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                {t('hero.feature1Title') || 'Numerology Calculator'}
              </h3>
              <p className="text-amber-700 mb-4">
                {t('hero.feature1Description') || 'Discover your life path number and what it reveals about your destiny and purpose'}
              </p>
              <Button variant="link" className="text-amber-600 mt-auto" asChild>
                <Link to="/numerology">
                  {t('hero.tryNow') || 'Try Now'} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                {t('hero.feature2Title') || 'Vedic Astrology'}
              </h3>
              <p className="text-amber-700 mb-4">
                {t('hero.feature2Description') || 'Explore your birth chart based on ancient Vedic wisdom and planetary influences'}
              </p>
              <Button variant="link" className="text-amber-600 mt-auto" asChild>
                <Link to="/vedic-astrology/chart">
                  {t('hero.calculateChart') || 'Calculate Chart'} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Pizza className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-2">
                {t('hero.feature3Title') || 'Personalized Readings'}
              </h3>
              <p className="text-amber-700 mb-4">
                {t('hero.feature3Description') || 'Get detailed interpretations and insights based on your unique numerological and astrological profile'}
              </p>
              <Button variant="link" className="text-amber-600 mt-auto" asChild>
                <Link to="/blog">
                  {t('hero.learnMore') || 'Learn More'} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
