
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from '../context/LanguageContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { SEO } from '../utils/seo';

const NotFound = () => {
  const location = useLocation();
  const { t, language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEO 
        title={language === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found'} 
        description={language === 'vi' ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.' : 'The page you are looking for does not exist or has been moved.'}
        keywords="404, not found, error"
        noindex={true}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-800 to-amber-950">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-lg mx-auto bg-amber-50 p-8 rounded-xl shadow-2xl">
              <h1 className="text-6xl font-bold text-amber-900 mb-2">404</h1>
              <h2 className="text-xl font-medium text-amber-800 mb-6">
                {language === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found'}
              </h2>
              <p className="text-gray-600 mb-8">
                {language === 'vi' 
                  ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.' 
                  : 'The page you are looking for does not exist or has been moved.'}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild variant="default" className="flex items-center gap-2">
                  <Link to="/">
                    <Home size={18} />
                    {language === 'vi' ? 'Trang chủ' : 'Home'}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link to="/blog">
                    <ArrowLeft size={18} />
                    {language === 'vi' ? 'Blog' : 'Blog'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
