import React from 'react';
import { GraduationCap, Stars, Users } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide

const AboutSlider = () => {
  const slides = [
    {
      icon: GraduationCap,
      title: "Khóa học Số học & Chiêm tinh Vệ Đà",
      content: "Khám phá lớp học chuyên sâu về Chiêm tinh Vệ Đà (Jyotish) & Số học Vệ Đà (Sankhya) – nơi bạn học cách giải mã bản đồ tâm hồn, thời vận và karmic patterns. Lớp nhỏ 6 người, học trực tiếp cùng giảng viên, hỗ trợ suốt hành trình chiêm nghiệm."
    },
    {
      icon: Stars,
      title: "Dịch vụ tư vấn chiêm tinh cá nhân hóa",
      content: "Luận giải lá số chi tiết theo hệ thống Vệ Đà chính thống:\n→ Khám phá bản chất linh hồn, nghiệp cũ\n→ Hỏi đáp về tình yêu, công việc, thời điểm tốt\n→ Gợi mở hướng đi phù hợp với bản mệnh.\nTư vấn 1:1 – sâu sắc, chữa lành, định hướng rõ ràng."
    },
    {
      icon: Users,
      title: "Cộng đồng chiêm tinh & kênh kết nối",
      content: "Tham gia Patreon để nhận dự báo chiêm tinh hàng tháng.\nTrò chuyện trong Discord cùng những tâm hồn đồng điệu.\nTheo dõi nội dung hàng ngày trên Facebook, X (Twitter) và Instagram.\nChúng ta cùng kết nối qua ánh sáng các vì sao"
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [activeIndex, setActiveIndex] = useState(0);

  // Function to autoplay the carousel
  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  // Set up autoplay with interval
  useEffect(() => {
    if (!emblaApi) return;
    
    // Handle slide change
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    
    // Initialize autoplay
    const autoplayInterval = setInterval(autoplay, AUTOPLAY_INTERVAL);
    
    // Clean up
    return () => {
      clearInterval(autoplayInterval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, autoplay]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0 pl-4">
              <div className="p-1">
                <Card className="border-none glass-card overflow-hidden">
                  <CardContent className="flex flex-col justify-center items-center p-6 md:p-10 text-center min-h-[400px]">
                    {React.createElement(slide.icon, { className: "h-12 w-12 mb-6 text-amber-600" })}
                    <h3 className="text-2xl font-semibold text-amber-900 mb-4">{slide.title}</h3>
                    <p className="text-lg md:text-xl text-amber-900 leading-relaxed whitespace-pre-line">{slide.content}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Slide indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-amber-600' : 'bg-amber-300'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutSlider;
