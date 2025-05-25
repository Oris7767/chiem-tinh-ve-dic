import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import MobileMenu from './MobileMenu';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();  
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  // Determine if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 bg-black/40 backdrop-blur-md",
        scrolled ? "py-3 bg-black/80 shadow-sm" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="/" 
          className="flex items-center space-x-3 animate-fade-in"
        >
          <img 
            src="/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png" 
            alt="Votive Logo" 
            className="h-10"
          />
          <span className="text-xl md:text-2xl font-serif font-semibold text-amber-50">
            {language === 'vi' ? 'Số học Vệ Đà' : 'Vedic Numerology'}
          </span>
        </a>
        
        <div className="flex items-center space-x-4 md:space-x-8">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-amber-600/30 hover:bg-amber-600/50 text-amber-50 transition-colors"
            aria-label="Switch Language"
          >
            <Languages size={18} />
          </button>
          
          <ul className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <>
                <li>
                  <Link to="/blog" className="text-amber-100 hover:text-amber-50 subtle-underline animate-fade-in-delay">
                    {t('nav.blog')}
                  </Link>
                </li>
                {/* Vedic Chart menu item */}
                <li>
                  <Link to="/vedic-chart" className="text-amber-100 hover:text-amber-50 subtle-underline animate-fade-in-delay">
                    {language === 'vi' ? 'Chiêm Tinh Vệ Đà' : 'Vedic Astrology'}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="text-amber-100 hover:text-amber-50 subtle-underline animate-fade-in">
                    {t('nav.home') || 'Home'}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-amber-100 hover:text-amber-50 subtle-underline animate-fade-in-delay">
                    {t('nav.blog') || 'Blog'}
                  </Link>
                </li>
                {/* Vedic Chart menu item */}
                <li>
                  <Link to="/vedic-chart" className="text-amber-100 hover:text-amber-50 subtle-underline animate-fade-in-delay">
                    {language === 'vi' ? 'Chiêm Tinh Vệ Đà' : 'Vedic Astrology'}
                  </Link>
                </li>
              </>
            )}
          </ul>
           {isMobile ? (
             <div className='flex items-center gap-4'>
               <Link
                 to={isHomePage ? "/#calculator" : "/numerology"}
                 className="btn-primary animate-fade-in-delay"
               >
                 {t('nav.start')}
               </Link>
               <MobileMenu />
             </div>
           ) : (
            <Link
              to={isHomePage ? "/#calculator" : "/numerology"} 
              className="btn-primary animate-fade-in-delay"
            >
              {t('nav.start')}
            </Link>
           )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
