import React from 'react';
import { motion } from 'framer-motion';
import { usePanchang } from '../hooks/usePanchang';
import { useTransits } from '../hooks/useTransits';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { mockPanchangData, viPanchangNames } from '../mocks/panchangMock';
import { FormattedPanchangData } from '../utils/panchangUtils';
import { formatPanchangData } from '../utils/panchangUtils';
import { PanchangData } from '../services/panchangService';
import DiyaLamp from '../components/DiyaLamp';
import { SolarEvents } from '../components/panchang/SolarEvents';
import { PlanetaryTransits } from '../components/panchang/PlanetaryTransits';
import { AstrologicalInfo } from '../components/panchang/AstrologicalInfo';
import { LunarInfo } from '../components/panchang/LunarInfo';

// For development, set this to true to use mock data
const USE_MOCK = false;

const Panchang: React.FC = () => {
  const { data: panchangData, isLoading: isPanchangLoading, error: panchangError } = usePanchang();
  const { data: transitsData, isLoading: isTransitsLoading, error: transitsError } = useTransits();
  const { language } = useLanguage();
  
  // Use mock data if USE_MOCK is true, otherwise use live data
  const rawData = USE_MOCK ? mockPanchangData : panchangData;
  const data = rawData ? formatPanchangData(rawData as PanchangData, language as 'vi' | 'en') : null;

  const translateAstroName = (type: keyof typeof viPanchangNames, name: string): string => {
    if (language === 'vi' && viPanchangNames[type][name]) {
      return viPanchangNames[type][name];
    }
    return name;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#D68C45] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#D68C45]">
          {language === 'vi' ? 'Đang tải...' : 'Loading...'}
        </p>
      </div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="text-center py-8">
      <p className="text-red-500">
        {language === 'vi' ? 'Lỗi khi tải dữ liệu' : 'Error loading data'}
      </p>
      <p className="text-[#D68C45] text-sm">
        {language === 'vi' ? 'Vui lòng thử lại sau' : 'Please try again later'}
      </p>
    </div>
  );

  const renderContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        {isPanchangLoading && !USE_MOCK ? (
          <LoadingSpinner />
        ) : panchangError && !USE_MOCK ? (
          <ErrorMessage />
        ) : (
          <LunarInfo
            isLoading={isPanchangLoading}
            error={panchangError}
            data={data}
            language={language as 'vi' | 'en'}
          />
        )}
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        {isPanchangLoading && !USE_MOCK ? (
          <LoadingSpinner />
        ) : panchangError && !USE_MOCK ? (
          <ErrorMessage />
        ) : (
          <SolarEvents
            isLoading={isPanchangLoading}
            error={panchangError}
            data={data}
            language={language as 'vi' | 'en'}
          />
        )}
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        {isTransitsLoading && !USE_MOCK ? (
          <LoadingSpinner />
        ) : transitsError && !USE_MOCK ? (
          <ErrorMessage />
        ) : (
          <PlanetaryTransits
            isLoading={isTransitsLoading}
            error={transitsError}
            data={transitsData}
            language={language as 'vi' | 'en'}
            translateAstroName={translateAstroName}
          />
        )}
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        {isPanchangLoading && !USE_MOCK ? (
          <LoadingSpinner />
        ) : panchangError && !USE_MOCK ? (
          <ErrorMessage />
        ) : (
          <AstrologicalInfo
            isLoading={isPanchangLoading}
            error={panchangError}
            data={data}
            language={language as 'vi' | 'en'}
            translateAstroName={translateAstroName}
          />
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-[#2C1810] bg-[url('/images/panchang-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-[#2C1810]/90 backdrop-blur-sm"></div>
      <DiyaLamp />
      <div className="relative">
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

        {renderContent()}
      </div>
    </div>
  );
};

export default Panchang; 