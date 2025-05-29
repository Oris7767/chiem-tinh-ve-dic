import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { FormattedPanchangData } from '../../utils/panchangUtils';

interface SolarEventsProps {
  isLoading: boolean;
  error: unknown;
  data: FormattedPanchangData | null;
  language: 'vi' | 'en';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const SolarEvents = ({ isLoading, error, data, language }: SolarEventsProps) => {
  if (isLoading) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="p-8 rounded-2xl bg-gradient-to-br from-[#3D2317] to-[#2C1810] border border-[#D68C45]/20"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#D68C45]/20 rounded w-3/4"></div>
          <div className="h-32 bg-[#D68C45]/10 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="p-8 rounded-2xl bg-gradient-to-br from-[#3D2317] to-[#2C1810] border border-[#D68C45]/20"
      >
        <div className="text-[#D68C45]">
          {language === 'vi' 
            ? 'Không thể tải thông tin mặt trời và mặt trăng' 
            : 'Failed to load solar and lunar events'}
        </div>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
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
  );
}; 