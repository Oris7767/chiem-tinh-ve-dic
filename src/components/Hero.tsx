
import { useEffect, useRef } from 'react';

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

  return (
    <section className="relative min-h-screen pt-24 pb-16 flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-50 z-0"></div>
      
      <div ref={numberRef} className="absolute opacity-5 text-[30rem] font-serif text-primary/20 select-none z-0 animate-float">
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
            <a href="#calculator" className="btn-primary w-full sm:w-auto">
              Tính toán ngay
            </a>
            <a href="#about" className="px-6 py-3 text-gray-700 hover:text-primary transition-colors w-full sm:w-auto">
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
