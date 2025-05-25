import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, BookOpen, Star, Globe } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MobileMenu = () => {
  const { t, language, setLanguage } = useLanguage();
  
  const menuItems = [
    { to: '/', label: 'nav.home', icon: null },
    { 
      to: '/vedic-chart', 
      label: language === 'vi' ? 'Chiêm Tinh Vệ Đà' : 'Vedic Astrology', 
      icon: Star, 
      highlight: true 
    },
    { to: '/blog', label: 'nav.blog', icon: BookOpen, badge: 'New' }
  ];

  const languages = [
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'en', label: 'English' }
  ];
  
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
            <SheetTitle className="text-amber-50 flex items-center justify-between">
              <img 
                src="/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png" 
                alt="Votic Logo" 
                className="h-12"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-amber-800/50 transition-colors">
                    <Globe size={24} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-amber-800 border-amber-700">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      className={`text-amber-50 hover:bg-amber-700 cursor-pointer ${
                        language === lang.code ? 'bg-amber-700' : ''
                      }`}
                      onClick={() => setLanguage(lang.code === 'vi' ? 'vi' : 'en')}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SheetTitle>
          </SheetHeader>
          
          <nav className="mt-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <SheetClose asChild>
                    <Link 
                      to={item.to} 
                      className={`flex items-center py-3 px-4 text-lg font-medium rounded-md transition-colors
                        ${item.highlight 
                          ? 'bg-amber-600/30 hover:bg-amber-600/50' 
                          : 'hover:bg-amber-800/50'
                        }`}
                    >
                      {item.icon && <item.icon className="mr-3" size={20} />}
                      {item.label.startsWith('nav.') ? t(item.label) : item.label}
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-amber-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="absolute bottom-6 left-6 right-6">
            <SheetClose asChild>
              <Link 
                to="/#calculator" 
                className="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-center rounded-md font-medium transition-colors"
              >
                {t('nav.start')}
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
