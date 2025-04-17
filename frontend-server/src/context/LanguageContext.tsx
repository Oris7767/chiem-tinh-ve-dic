
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, translations, getNestedTranslation, TranslationKey } from '../utils/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    const translation = getNestedTranslation(translations[language], key);
    
    if (translation === key && language !== 'en') {
      // Fallback to English if translation not found in current language
      const englishTranslation = getNestedTranslation(translations['en'], key);
      if (englishTranslation !== key) {
        return englishTranslation;
      }
      
      console.warn(`Translation missing for key: ${key} in language ${language}`);
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
