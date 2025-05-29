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
      <div className="container mx-auto px-4 py-8 min-h-screen bg-[#2C1810]">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D68C45] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-3xl font-bold text-[#D68C45]">
              {language === 'vi' ? 'Đang tải Panchang...' : 'Loading Panchang...'}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (error && !USE_MOCK) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-[#2C1810]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            {language === 'vi' ? 'Lỗi khi tải dữ liệu' : 'Error loading data'}
          </h1>
          <p className="text-[#D68C45]">
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
    <div className="container mx-auto px-4 py-8 min-h-screen bg-[#2C1810] bg-[url('/images/panchang-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-[#2C1810]/90 backdrop-blur-sm"></div>
      <div className="relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#D68C45] to-[#E5B583] bg-clip-text text-transparent mb-4">
            {language === 'vi' ? 'Lịch Panchang Hôm Nay' : 'Today\'s Panchang'} ✨
          </h1>
          <p className="text-[#E5B583] text-lg">
            {language === 'vi' 
              ? 'Khám phá sự kết nối giữa vũ trụ và cuộc sống của bạn' 
              : 'Discover the cosmic connection to your daily life'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Lunar Information */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            className={cn(
              "p-8 rounded-2xl",
              "bg-gradient-to-br from-[#3D2317] to-[#2C1810]",
              "border border-[#D68C45]/20",
              "shadow-xl shadow-[#D68C45]/10"
            )}
          >
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">🌙</span>
              <h2 className="text-2xl font-semibold text-[#D68C45]">
                {language === 'vi' ? 'Thông Tin Âm Lịch' : 'Lunar Information'}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-[#E5B583] font-medium">
                    {language === 'vi' ? 'Ngày' : 'Day'}
                  </p>
                  <p className="text-2xl font-bold text-[#D68C45]">{data.lunarInfo.day}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
                <span className="text-2xl">📆</span>
                <div>
                  <p className="text-[#E5B583] font-medium">
                    {language === 'vi' ? 'Tháng' : 'Month'}
                  </p>
                  <p className="text-2xl font-bold text-[#D68C45]">{data.lunarInfo.month}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
                <span className="text-2xl">✨</span>
                <div>
                  <p className="text-[#E5B583] font-medium">
                    {language === 'vi' ? 'Năm' : 'Year'}
                  </p>
                  <p className="text-2xl font-bold text-[#D68C45]">{data.lunarInfo.year}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solar Events */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "p-8 rounded-2xl",
              "bg-gradient-to-br from-[#3D2317] to-[#2C1810]",
              "border border-[#D68C45]/20",
              "shadow-xl shadow-[#D68C45]/10"
            )}
          >
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">☀️</span>
              <h2 className="text-2xl font-semibold text-[#D68C45]">
                {language === 'vi' ? 'Mặt Trời & Mặt Trăng' : 'Solar & Lunar Events'}
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
                <span className="text-2xl">🌅</span>
                <div>
                  <p className="text-[#E5B583] font-medium">
                    {language === 'vi' ? 'Mặt trời mọc' : 'Sunrise'}
                  </p>
                  <p className="text-2xl font-bold text-[#D68C45]">{data.solarEvents.sunriseFormatted}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
                <span className="text-2xl">🌇</span>
                <div>
                  <p className="text-[#E5B583] font-medium">
                    {language === 'vi' ? 'Mặt trời lặn' : 'Sunset'}
                  </p>
                  <p className="text-2xl font-bold text-[#D68C45]">{data.solarEvents.sunsetFormatted}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
                <span className="text-2xl">🌕</span>
                <div>
                  <p className="text-[#E5B583] font-medium">
                    {language === 'vi' ? 'Mặt trăng mọc' : 'Moonrise'}
                  </p>
                  <p className="text-2xl font-bold text-[#D68C45]">{data.solarEvents.moonriseFormatted}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
                <span className="text-2xl">🌑</span>
                <div>
                  <p className="text-[#E5B583] font-medium">
                    {language === 'vi' ? 'Mặt trăng lặn' : 'Moonset'}
                  </p>
                  <p className="text-2xl font-bold text-[#D68C45]">{data.solarEvents.moonsetFormatted}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Astrological Information */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            className={cn(
              "p-8 rounded-2xl",
              "bg-gradient-to-br from-[#3D2317] to-[#2C1810]",
              "border border-[#D68C45]/20",
              "shadow-xl shadow-[#D68C45]/10",
              "lg:col-span-3"
            )}
          >
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">🔮</span>
              <h2 className="text-2xl font-semibold text-[#D68C45]">
                {language === 'vi' ? 'Thông Tin Chiêm Tinh' : 'Astrological Information'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-[#3D2317] space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌠</span>
                  <h3 className="text-xl font-medium text-[#E5B583]">Tithi</h3>
                </div>
                <p className="text-xl font-semibold text-[#D68C45]">
                  {translateAstroName('tithi', data.astrologicalInfo.tithi)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#3D2317] space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⭐</span>
                  <h3 className="text-xl font-medium text-[#E5B583]">Nakshatra</h3>
                </div>
                <p className="text-xl font-semibold text-[#D68C45]">
                  {translateAstroName('nakshatra', data.astrologicalInfo.nakshatra)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#3D2317] space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌟</span>
                  <h3 className="text-xl font-medium text-[#E5B583]">Yoga</h3>
                </div>
                <p className="text-xl font-semibold text-[#D68C45]">
                  {translateAstroName('yoga', data.astrologicalInfo.yoga)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#3D2317] space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✨</span>
                  <h3 className="text-xl font-medium text-[#E5B583]">Karana</h3>
                </div>
                <p className="text-xl font-semibold text-[#D68C45]">
                  {translateAstroName('karana', data.astrologicalInfo.karana)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Panchang; 