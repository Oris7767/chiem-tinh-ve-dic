
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Calculator from '../components/Calculator';
import Footer from '../components/Footer';
import GoogleAd from '../components/GoogleAds';
import { numberMeanings } from '../utils/data';
import { useLanguage } from '../context/LanguageContext';
import { Helmet } from 'react-helmet-async';
import AboutSlider from '../components/AboutSlider';

const Index = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Số học Vệ Đà - Khám phá ý nghĩa sâu sắc | chiemtinhvedavn</title>
        <meta name="description" content="Khám phá ý nghĩa sâu sắc đằng sau những con số trong cuộc sống của bạn dựa trên nguyên lý cổ đại của số học Vệ Đà từ chiemtinhvedavn." />
        <meta name="keywords" content="số học Vệ Đà, chiemtinhvedavn, số học, numerology, vedic astrology, Vệ Đà, thần số học" />
        <link rel="canonical" href="https://vedicvn.com/" />
        
        {/* Structured data for website */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://vedicvn.com/",
            "name": "Số học Vệ Đà - chiemtinhvedavn",
            "description": "Khám phá ý nghĩa sâu sắc đằng sau những con số trong cuộc sống của bạn dựa trên nguyên lý cổ đại của số học Vệ Đà.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://vedicvn.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      
      <NavBar />
      <main className="flex-grow">
        <Hero />
        <Calculator />
        
        {/* Ad display example after calculator section */}
        <div className="container mx-auto px-4 py-6">
          <GoogleAd 
            adSlot="1234567890" 
            className="mx-auto my-8" 
            style={{ minHeight: "250px", width: "100%" }} 
          />
        </div>
        
        <section id="about" className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-900/10 text-amber-700 mb-4">
                {t('nav.about')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-900">
                {t('about.title')}
              </h2>
              <p className="text-lg text-amber-800">
                {t('about.subtitle')}
              </p>
            </div>
            
            {/* About Slider */}
            <AboutSlider />
            
            <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
              <div className="glass-card rounded-xl p-6 md:p-8 space-y-6">
                <h3 className="text-2xl font-bold text-amber-900">{t('about.origins.title')}</h3>
                <p className="text-amber-900 leading-relaxed">
                  {t('about.origins.p1')}
                </p>
                <p className="text-amber-900 leading-relaxed">
                  {t('about.origins.p2')}
                </p>
              </div>
              
              <div className="glass-card rounded-xl p-6 md:p-8 space-y-6">
                <h3 className="text-2xl font-bold text-amber-900">{t('about.difference.title')}</h3>
                <p className="text-amber-900 leading-relaxed">
                  {t('about.difference.p1')}
                </p>
                <p className="text-amber-900 leading-relaxed">
                  {t('about.difference.p2')}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="meanings" className="py-24 bg-gradient-to-br from-amber-900/5 to-amber-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-amber-900/10 text-amber-700 mb-4">
                {t('nav.meanings')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-amber-900">
                {t('meanings.title')}
              </h2>
              <p className="text-lg text-amber-800">
                {t('meanings.subtitle')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600/10 flex items-center justify-center">
                      <span className="text-2xl font-serif font-bold text-amber-700">{num}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-amber-900">{t(`number.${num}.title`)}</h3>
                      <p className="text-sm text-amber-700">{t(`number.${num}.planet`)}</p>
                    </div>
                  </div>
                  <p className="text-amber-800">
                    {t(`number.${num}.shortDescription`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;