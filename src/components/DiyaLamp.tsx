import React from 'react';
import { motion } from 'framer-motion';

const DiyaLamp: React.FC = () => {
  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Top right diya */}
      <div className="absolute top-4 right-4 w-32 h-32">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-full"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            mixBlendMode: 'screen'
          }}
        >
          <source src="/videos/diya-flame.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-radial from-[#D68C45]/30 to-transparent rounded-full animate-pulse" />
      </div>

      {/* Top left diya */}
      <div className="absolute top-4 left-4 w-32 h-32">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-full"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            mixBlendMode: 'screen'
          }}
        >
          <source src="/videos/diya-flame.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-radial from-[#D68C45]/30 to-transparent rounded-full animate-pulse" />
      </div>

      {/* Floating diyas */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute bottom-8 left-1/4 w-24 h-24"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-full"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            mixBlendMode: 'screen'
          }}
        >
          <source src="/videos/diya-flame.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-radial from-[#D68C45]/30 to-transparent rounded-full animate-pulse" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 2,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="absolute bottom-8 right-1/4 w-24 h-24"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-full"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            mixBlendMode: 'screen'
          }}
        >
          <source src="/videos/diya-flame.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-radial from-[#D68C45]/30 to-transparent rounded-full animate-pulse" />
      </motion.div>
    </div>
  );
};

export default DiyaLamp; 