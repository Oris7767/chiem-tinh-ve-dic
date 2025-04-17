
import { enDetailedMeanings } from './numberDetailedMeanings/en';
import { viDetailedMeanings } from './numberDetailedMeanings/vi';

// Define a type for detailed meanings
export interface DetailedMeaning {
  number: number;
  description: {
    en: string;
    vi: string;
  };
}

// Create an array of detailed meanings from the language-specific objects
const detailedMeanings: DetailedMeaning[] = Object.keys(enDetailedMeanings).map(numStr => {
  const number = parseInt(numStr, 10);
  return {
    number,
    description: {
      en: enDetailedMeanings[number] || "Description not available",
      vi: viDetailedMeanings[number] || "Mô tả không có sẵn"
    }
  };
});

// Function to get detailed meaning for a specific number
export const getDetailedMeaning = (number: number): DetailedMeaning | undefined => {
  return detailedMeanings.find(meaning => meaning.number === number);
};

// Direct access to get description based on number and language
export const getDescription = (number: number, language: 'en' | 'vi' = 'en'): string => {
  const meaning = detailedMeanings.find(m => m.number === number);
  if (meaning && meaning.description && meaning.description[language]) {
    return meaning.description[language];
  }
  return language === 'en' ? "Description not available" : "Mô tả không có sẵn";
};
