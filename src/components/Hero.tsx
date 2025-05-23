import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

const Hero = () => {
  const numberRef = useRef<HTMLDivElement>(null);

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
        <div className="max-w-3xl mx-auto text-center">
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
            <a 
              href="#calculator" 
              className="btn-primary w-full sm:w-auto"
              aria-label="Tính toán số học ngay"
            >
              Tính toán ngay
            </a>
            <a 
              href="#about" 
              className="px-6 py-3 text-gray-700 hover:text-primary transition-colors w-full sm:w-auto"
              aria-label="Tìm hiểu thêm về số học Vệ Đà"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;