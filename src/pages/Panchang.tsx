import React from 'react';
import { motion } from 'framer-motion';
import { usePanchang } from '../hooks/usePanchang';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { mockPanchangData, viPanchangNames } from '../mocks/panchangMock';
import { FormattedPanchangData } from '../utils/panchangUtils';
import { formatPanchangData } from '../utils/panchangUtils';
import { PanchangData } from '../services/panchangService';

// For development, set this to true to use mock data
const USE_MOCK = true;

const Panchang: React.FC = () => {
  const { data: liveData, isLoading, error } = usePanchang();
  const { language } = useLanguage();
  
  // Use mock data if USE_MOCK is true, otherwise use live data
  const rawData = USE_MOCK ? mockPanchangData : liveData;
  const data = rawData ? formatPanchangData(rawData as PanchangData, language as 'vi' | 'en') : null;

  const translateAstroName = (type: keyof typeof viPanchangNames, name: string): string => {
    if (language === 'vi' && viPanchangNames[type][name]) {
      return viPanchangNames[type][name];
    }
    return name;
  };

  if (isLoading && !USE_MOCK) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold text-amber-500">
              {language === 'vi' ? 'Đang tải Panchang...' : 'Loading Panchang...'}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (error && !USE_MOCK) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            {language === 'vi' ? 'Lỗi khi tải dữ liệu' : 'Error loading data'}
          </h1>
          <p className="text-gray-400">
            {language === 'vi' ? 'Vui lòng thử lại sau' : 'Please try again later'}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent mb-8">
        {language === 'vi' ? 'Lịch Panchang Hôm Nay' : 'Today\'s Panchang'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Lunar Information */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className={cn(
            "p-6 rounded-lg backdrop-blur-md",
            "bg-white/10 shadow-xl"
          )}
        >
          <h2 className="text-xl font-semibold text-amber-400 mb-4">
            {language === 'vi' ? 'Thông Tin Âm Lịch' : 'Lunar Information'}
          </h2>
          <div className="space-y-2">
            <p className="text-gray-200">
              {language === 'vi' ? 'Ngày' : 'Day'}: {data.lunarInfo.day}
            </p>
            <p className="text-gray-200">
              {language === 'vi' ? 'Tháng' : 'Month'}: {data.lunarInfo.month}
            </p>
            <p className="text-gray-200">
              {language === 'vi' ? 'Năm' : 'Year'}: {data.lunarInfo.year}
            </p>
          </div>
        </motion.div>

        {/* Solar Events */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "p-6 rounded-lg backdrop-blur-md",
            "bg-white/10 shadow-xl"
          )}
        >
          <h2 className="text-xl font-semibold text-amber-400 mb-4">
            {language === 'vi' ? 'Mặt Trời & Mặt Trăng' : 'Solar & Lunar Events'}
          </h2>
          <div className="space-y-2">
            <p className="text-gray-200">
              {language === 'vi' ? 'Mặt trời mọc' : 'Sunrise'}: {data.solarEvents.sunriseFormatted}
            </p>
            <p className="text-gray-200">
              {language === 'vi' ? 'Mặt trời lặn' : 'Sunset'}: {data.solarEvents.sunsetFormatted}
            </p>
            <p className="text-gray-200">
              {language === 'vi' ? 'Mặt trăng mọc' : 'Moonrise'}: {data.solarEvents.moonriseFormatted}
            </p>
            <p className="text-gray-200">
              {language === 'vi' ? 'Mặt trăng lặn' : 'Moonset'}: {data.solarEvents.moonsetFormatted}
            </p>
          </div>
        </motion.div>

        {/* Astrological Information */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "p-6 rounded-lg backdrop-blur-md",
            "bg-white/10 shadow-xl",
            "lg:col-span-3"
          )}
        >
          <h2 className="text-xl font-semibold text-amber-400 mb-4">
            {language === 'vi' ? 'Thông Tin Chiêm Tinh' : 'Astrological Information'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-300">Tithi</h3>
              <p className="text-gray-200">{translateAstroName('tithi', data.astrologicalInfo.tithi)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-300">Nakshatra</h3>
              <p className="text-gray-200">{translateAstroName('nakshatra', data.astrologicalInfo.nakshatra)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-300">Yoga</h3>
              <p className="text-gray-200">{translateAstroName('yoga', data.astrologicalInfo.yoga)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-300">Karana</h3>
              <p className="text-gray-200">{translateAstroName('karana', data.astrologicalInfo.karana)}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Panchang; 