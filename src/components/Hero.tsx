import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Hero = () => {
  const numberRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  // Mouse move effect
  useEffect(() => {
    if (!numberRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = numberRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const moveX = (clientX - centerX) * 0.01;
      const moveY = (clientY - centerY) * 0.01;

      numberRef.current!.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(timer);
  }, []);

  // JSON-LD for FAQ structured data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Số học Vệ Đà là gì?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Số học Vệ Đà là một hệ thống cổ đại từ Ấn Độ giúp hiểu về ý nghĩa của các con số trong cuộc sống. Mỗi con số có năng lượng riêng biệt và ảnh hưởng đến các khía cạnh cuộc sống khác nhau."
        }
      },
      {
        "@type": "Question",
        "name": "Làm thế nào để tính số cá nhân trong số học Vệ Đà?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Số cá nhân (Số đường đời) được tính bằng cách cộng tất cả các chữ số trong ngày sinh của bạn và giảm xuống một chữ số duy nhất (trừ khi là số chủ đạo 11, 22). Ví dụ: ngày 15/7/1990 = 1+5+7+1+9+9+0 = 32 = 3+2 = 5."
        }
      }
    ]
  };

  // Structured data for the main service offered
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Vedic Numerology Analysis",
    "provider": {
      "@type": "Organization",
      "name": "chiemtinhvedavn",
      "url": "https://vedicvn.com/"
    },
    "description": "Dịch vụ phân tích số học Vệ Đà trực tuyến miễn phí, giúp bạn hiểu về các con số trong cuộc sống.",
    "areaServed": {
      "@type": "Country",
      "name": "Vietnam"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Người quan tâm đến chiêm tinh và số học"
    }
  };

  const slides = [
    // Hero Slide
    <motion.div
      key="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto text-center"
    >
      <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary mb-4 animate-fade-in">
        Khám phá con số của bạn
      </span>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
        Số học <span className="text-primary">Vệ Đà</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
        Khám phá ý nghĩa sâu sắc đằng sau những con số trong cuộc sống của bạn dựa trên nguyên lý cổ đại của số học Vệ Đà.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay">
        <Link 
          to="/numerology" 
          className="btn-primary w-full sm:w-auto"
          aria-label="Số Học Vệ Đà"
        >
          Số Học Vệ Đà
        </Link>
        <Link 
          to="/vedic-chart" 
          className="btn-primary w-full sm:w-auto"
          aria-label="Chiêm Tinh Vệ Đà"
        >
          Chiêm Tinh Vệ Đà
        </Link>
      </div>
    </motion.div>,

    // About Us Slide
    <motion.div
      key="about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto text-center"
    >
      <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary mb-4 animate-fade-in">
        Về Votive
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">
        Chiêm Tinh Học Vệ Đà Trong Thời Đại Mới
      </h2>
      <div className="space-y-6 text-left">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <p className="text-gray-700 leading-relaxed">
            Votive ra đời trong thời điểm Thổ Tinh ngự tại Bảo Bình – một biểu tượng chiêm tinh cho sự tái cấu trúc tri thức qua lăng kính nhân đạo và công nghệ. Chúng tôi kế thừa tinh hoa của Chiêm Tinh Học Vệ Đà (Jyotish) – hệ thống chiêm tinh đã được đúc kết qua hơn 4000 năm – và tái hiện lại chúng trong bối cảnh đời sống hiện đại.
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <p className="text-gray-700 leading-relaxed">
            Với tinh thần của Bảo Bình, Votive không ngừng đổi mới cách tiếp cận tri thức cổ xưa bằng công nghệ tiên tiến, nhưng vẫn luôn đặt Con Người làm trung tâm. Mỗi bản đồ sao không chỉ là dữ liệu – mà là hành trình cá nhân cần được lắng nghe, thấu hiểu và soi sáng.
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi hướng đến sự cân bằng giữa hiện đại và truyền thống, giúp bạn khám phá bản thân, định hình con đường riêng, và kết nối sâu sắc hơn với chính mình.
          </p>
        </div>
      </div>
    </motion.div>
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(serviceJsonLd)}
        </script>
      </Helmet>
      
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 z-0"></div>

      <div ref={numberRef} className="absolute opacity-5 text-[30rem] font-serif text-primary/20 select-none z-0 animate-float" aria-hidden="true">
        9
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {slides[currentSlide]}
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-primary w-4' : 'bg-primary/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;