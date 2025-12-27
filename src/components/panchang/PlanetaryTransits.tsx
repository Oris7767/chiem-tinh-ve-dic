import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { FormattedTransit } from '../../utils/panchangUtils';

interface PlanetaryTransitsProps {
  isLoading: boolean;
  error: unknown;
  data: FormattedTransit[] | null;
  language: 'vi' | 'en';
  translateAstroName: (type: string, name: string) => string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const PlanetaryTransits = ({ isLoading, error, data, language, translateAstroName }: PlanetaryTransitsProps) => {
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
          <div className="h-40 bg-[#D68C45]/10 rounded"></div>
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
            ? 'Không thể tải thông tin quá cảnh hành tinh' 
            : 'Failed to load planetary transits'}
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
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn(
        "p-8 rounded-2xl",
        "bg-gradient-to-br from-[#3D2317] to-[#2C1810]",
        "border border-[#D68C45]/20",
        "shadow-xl shadow-[#D68C45]/10"
      )}
    >
      <div className="flex items-center mb-6">
        <span className="text-4xl mr-4">🪐</span>
        <h2 className="text-2xl font-semibold text-[#D68C45]">
          {language === 'vi' ? 'Quá Cảnh Hành Tinh Gần Đây' : 'Recent Planetary Transits'}
        </h2>
      </div>
      <div className="space-y-4">
        {data.map((transit, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-[#3D2317]">
            <span className="text-2xl">
              {transit.planet === 'MOON' ? '☽' :
               transit.planet === 'VENUS' ? '♀️' :
               transit.planet === 'MERCURY' ? '☿' :
               transit.planet === 'MARS' ? '♂️' :
               transit.planet === 'JUPITER' ? '♃' :
               transit.planet === 'SATURN' ? '♄' :
               transit.planet === 'SUN' ? '☉' :
               transit.planet === 'RAHU' ? '☊' :
               transit.planet === 'KETU' ? '☋' : '✨'}
            </span>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-[#E5B583] font-medium">
                  {language === 'vi' 
                    ? translateAstroName('planets', transit.planet)
                    : transit.planet}
                </p>
                <p className="text-[#D68C45] text-sm">
                  {transit.formattedDate}
                </p>
              </div>
              {transit.type === 'INGRESS' && transit.fromSign && transit.toSign && (
                <p className="text-lg font-semibold text-[#D68C45]">
                  {language === 'vi' 
                    ? `${translateAstroName('zodiacSigns', transit.fromSign)} → ${translateAstroName('zodiacSigns', transit.toSign)}`
                    : `${transit.fromSign} → ${transit.toSign}`}
                </p>
              )}
              {transit.type === 'RETROGRADE_START' && (
                <p className="text-lg font-semibold text-[#D68C45]">
                  {language === 'vi' ? 'Bắt đầu nghịch hành' : 'Retrograde Start'}
                </p>
              )}
              {transit.type === 'RETROGRADE_END' && (
                <p className="text-lg font-semibold text-[#D68C45]">
                  {language === 'vi' ? 'Kết thúc nghịch hành' : 'Retrograde End'}
                </p>
              )}
              <p className="text-sm text-[#E5B583]">
                {transit.formattedTime}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}; 