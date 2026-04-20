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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 bg-votive-text/40 backdrop-blur-md",
        scrolled ? "py-3 bg-votive-text/80 shadow-sm" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a 
          href="/" 
          className="flex items-center space-x-3 animate-fade-in"
        >
          <img 
            src="/images/logo.png" 
            alt="Votive Logo" 
            className="h-10"
          />
          <span className="text-xl md:text-2xl font-serif font-semibold text-votive-bg">
            {language === 'vi' ? 'Số học Vệ Đà' : 'Vedic Numerology'}
          </span>
        </a>
        
        <div className="flex items-center space-x-4 md:space-x-8">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full bg-primary/30 hover:bg-primary/50 text-votive-bg transition-colors"
            aria-label="Switch Language"
          >
            <Languages size={18} />
          </button>
          
          <ul className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <>
                <li>
                  <Link to="/blog" className="text-votive-bg/80 hover:text-votive-bg subtle-underline animate-fade-in-delay">
                    {t('nav.blog')}
                  </Link>
                </li>
                {/* Vedic Chart menu with dropdown */}
                <li className="relative group">
                  <Link to="/vedic-chart" className="text-votive-bg/80 hover:text-votive-bg subtle-underline animate-fade-in-delay flex items-center gap-1">
                    {language === 'vi' ? 'Chiêm Tinh Vệ Đà' : 'Vedic Astrology'}
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white/95 backdrop-blur-md border border-votive-border rounded-lg shadow-lg overflow-hidden">
                      <Link 
                        to="/vedic-chart" 
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-white transition-colors"
                      >
                        Bản đồ sao cá nhân
                      </Link>
                      <div className="border-t border-votive-border" />
                      <Link 
                        to="/matchmaking" 
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-white transition-colors"
                      >
                        Bản đồ cặp đôi
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <Link to="/luc-nham" className="text-votive-bg/80 hover:text-votive-bg subtle-underline animate-fade-in-delay">
                    {t('nav.lucNham')}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="text-votive-bg/80 hover:text-votive-bg subtle-underline animate-fade-in">
                    {t('nav.home') || 'Home'}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-votive-bg/80 hover:text-votive-bg subtle-underline animate-fade-in-delay">
                    {t('nav.blog') || 'Blog'}
                  </Link>
                </li>
                {/* Vedic Chart menu with dropdown */}
                <li className="relative group">
                  <Link to="/vedic-chart" className="text-votive-bg/80 hover:text-votive-bg subtle-underline animate-fade-in-delay flex items-center gap-1">
                    {language === 'vi' ? 'Chiêm Tinh Vệ Đà' : 'Vedic Astrology'}
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white/95 backdrop-blur-md border border-votive-border rounded-lg shadow-lg overflow-hidden">
                      <Link 
                        to="/vedic-chart" 
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-white transition-colors"
                      >
                        Bản đồ sao cá nhân
                      </Link>
                      <div className="border-t border-votive-border" />
                      <Link 
                        to="/matchmaking" 
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-white transition-colors"
                      >
                        Bản đồ cặp đôi
                      </Link>
                    </div>
                  </div>
                </li>
                <li>
                  <Link to="/luc-nham" className="text-votive-bg/80 hover:text-votive-bg subtle-underline animate-fade-in-delay">
                    {t('nav.lucNham')}
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
