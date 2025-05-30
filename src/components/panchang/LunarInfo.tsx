import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { FormattedPanchangData } from '../../utils/panchangUtils';

interface LunarInfoProps {
  isLoading: boolean;
  error: unknown;
  data: FormattedPanchangData | null;
  language: 'vi' | 'en';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const LunarInfo = ({ isLoading, error, data, language }: LunarInfoProps) => {
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
          <div className="h-24 bg-[#D68C45]/10 rounded"></div>
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
            ? 'Không thể tải thông tin âm lịch' 
            : 'Failed to load lunar information'}
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
  );
}; 