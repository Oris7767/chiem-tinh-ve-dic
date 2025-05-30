import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { FormattedPanchangData } from '../../utils/panchangUtils';

interface AstrologicalInfoProps {
  isLoading: boolean;
  error: unknown;
  data: FormattedPanchangData | null;
  language: 'vi' | 'en';
  translateAstroName: (type: string, name: string) => string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AstrologicalInfo = ({ isLoading, error, data, language, translateAstroName }: AstrologicalInfoProps) => {
  if (isLoading) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="p-8 rounded-2xl bg-gradient-to-br from-[#3D2317] to-[#2C1810] border border-[#D68C45]/20 lg:col-span-3"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#D68C45]/20 rounded w-3/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[#D68C45]/10 rounded"></div>
            ))}
          </div>
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
        className="p-8 rounded-2xl bg-gradient-to-br from-[#3D2317] to-[#2C1810] border border-[#D68C45]/20 lg:col-span-3"
      >
        <div className="text-[#D68C45]">
          {language === 'vi' 
            ? 'Không thể tải thông tin chiêm tinh' 
            : 'Failed to load astrological information'}
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
  );
}; 