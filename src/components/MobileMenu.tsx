
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, BookOpen } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";

const MobileMenu = () => {
  const { t } = useLanguage();
  
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 rounded-full bg-amber-600/30 hover:bg-amber-600/50 text-amber-50 transition-colors">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="bg-gradient-to-b from-amber-900 to-amber-800 text-amber-50">
          <SheetHeader>
            <SheetTitle className="text-amber-50">
              <img 
                src="/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png" 
                alt="Votic Logo" 
                className="h-12 mx-auto mb-4"
              />
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 px-4 text-lg font-medium hover:bg-amber-800/50 rounded-md transition-colors"
                >
                  {t('nav.home') || 'Home'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/numerology" 
                  className="block py-2 px-4 text-lg font-medium hover:bg-amber-800/50 rounded-md transition-colors"
                >
                  {t('nav.numerology') || 'Numerology'}
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="flex items-center py-2 px-4 text-lg font-medium bg-amber-600/30 hover:bg-amber-600/50 rounded-md transition-colors"
                >
                  <BookOpen className="mr-2" size={20} />
                  {t('nav.blog') || 'Blog'} 
                  <span className="ml-2 px-2 py-0.5 text-xs bg-amber-500 rounded-full">New</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <Link 
              to="/#calculator" 
              className="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-center rounded-md font-medium transition-colors"
            >
              {t('nav.start')}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
