import React from 'react';
import { motion } from 'framer-motion';
import { usePanchang } from '../hooks/usePanchang';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

const Panchang: React.FC = () => {
  const { data, isLoading, error } = usePanchang();
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <h1 className="text-3xl font-bold text-center text-amber-500 mb-8">
          {language === 'vi' ? 'Đang tải Panchang...' : 'Loading Panchang...'}
        </h1>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-8">
          {language === 'vi' ? 'Lỗi khi tải dữ liệu' : 'Error loading data'}
        </h1>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent mb-8">
        {language === 'vi' ? 'Lịch Panchang Hôm Nay' : 'Today\'s Panchang'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            {language === 'vi' ? 'Ngày Âm Lịch' : 'Lunar Day'}
          </h2>
          <p className="text-gray-200">Tithi: {data.lunarDay.tithiName}</p>
          <p className="text-gray-200">
            {language === 'vi' ? 'Kết thúc lúc' : 'Ends at'}: {data.lunarDay.tithiEndFormatted}
          </p>
          <p className="text-gray-200">
            {language === 'vi' ? 'Tháng Âm Lịch' : 'Lunar Month'}: {data.lunarMonth.name}
            {data.lunarMonth.isLeap && ` (${language === 'vi' ? 'Tháng Nhuận' : 'Leap Month'})`}
          </p>
        </motion.div>

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
            {language === 'vi' ? 'Sự Kiện Mặt Trời' : 'Solar Events'}
          </h2>
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
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          className={cn(
            "p-6 rounded-lg backdrop-blur-md",
            "bg-white/10 shadow-xl"
          )}
        >
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Nakshatra</h2>
          <p className="text-gray-200">{language === 'vi' ? 'Tên' : 'Name'}: {data.nakshatra.name}</p>
          <p className="text-gray-200">
            {language === 'vi' ? 'Kết thúc lúc' : 'Ends at'}: {data.nakshatra.endTimeFormatted}
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
          className={cn(
            "p-6 rounded-lg backdrop-blur-md",
            "bg-white/10 shadow-xl"
          )}
        >
          <h2 className="text-xl font-semibold text-amber-400 mb-4">Yoga & Karana</h2>
          <p className="text-gray-200">Yoga: {data.yoga.name}</p>
          <p className="text-gray-200">
            {language === 'vi' ? 'Kết thúc lúc' : 'Ends at'}: {data.yoga.endTimeFormatted}
          </p>
          <p className="text-gray-200">Karana: {data.karana.name}</p>
          <p className="text-gray-200">
            {language === 'vi' ? 'Kết thúc lúc' : 'Ends at'}: {data.karana.endTimeFormatted}
          </p>
        </motion.div>

        {(data.specialEvents.solarEclipse.isEclipse || data.specialEvents.lunarEclipse.isEclipse) && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.8 }}
            className={cn(
              "p-6 rounded-lg backdrop-blur-md",
              "bg-white/10 shadow-xl",
              "md:col-span-2 lg:col-span-3"
            )}
          >
            <h2 className="text-xl font-semibold text-amber-400 mb-4">
              {language === 'vi' ? 'Sự Kiện Đặc Biệt' : 'Special Events'}
            </h2>
            {data.specialEvents.solarEclipse.isEclipse && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-amber-300 mb-2">
                  {language === 'vi' ? 'Nhật Thực' : 'Solar Eclipse'}: {data.specialEvents.solarEclipse.type}
                </h3>
                <p className="text-gray-200">
                  {language === 'vi' ? 'Bắt đầu' : 'Start'}: {data.specialEvents.solarEclipse.timings.startFormatted}
                </p>
                <p className="text-gray-200">
                  {language === 'vi' ? 'Cực đại' : 'Maximum'}: {data.specialEvents.solarEclipse.timings.maximumFormatted}
                </p>
                <p className="text-gray-200">
                  {language === 'vi' ? 'Kết thúc' : 'End'}: {data.specialEvents.solarEclipse.timings.endFormatted}
                </p>
              </div>
            )}
            {data.specialEvents.lunarEclipse.isEclipse && (
              <div>
                <h3 className="text-lg font-medium text-amber-300 mb-2">
                  {language === 'vi' ? 'Nguyệt Thực' : 'Lunar Eclipse'}: {data.specialEvents.lunarEclipse.type}
                </h3>
                <p className="text-gray-200">
                  {language === 'vi' ? 'Bắt đầu' : 'Start'}: {data.specialEvents.lunarEclipse.timings.startFormatted}
                </p>
                <p className="text-gray-200">
                  {language === 'vi' ? 'Cực đại' : 'Maximum'}: {data.specialEvents.lunarEclipse.timings.maximumFormatted}
                </p>
                <p className="text-gray-200">
                  {language === 'vi' ? 'Kết thúc' : 'End'}: {data.specialEvents.lunarEclipse.timings.endFormatted}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Panchang; 