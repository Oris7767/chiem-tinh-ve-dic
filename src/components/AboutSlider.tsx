
import React from 'react';
import { Sparkles } from 'lucide-react';
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
      content: "Votive ra đời trong thời điểm Thổ Tinh ngự tại Bảo Bình – một biểu tượng chiêm tinh cho sự tái cấu trúc tri thức qua lăng kính nhân đạo và công nghệ. Chúng tôi kế thừa tinh hoa của Chiêm Tinh Học Vệ Đà (Jyotish) – hệ thống chiêm tinh đã được đúc kết qua hơn 4000 năm – và tái hiện lại chúng trong bối cảnh đời sống hiện đại."
    },
    {
      content: "Với tinh thần của Bảo Bình, Votive không ngừng đổi mới cách tiếp cận tri thức cổ xưa bằng công nghệ tiên tiến, nhưng vẫn luôn đặt Con Người làm trung tâm. Mỗi bản đồ sao không chỉ là dữ liệu – mà là hành trình cá nhân cần được lắng nghe, thấu hiểu và soi sáng."
    },
    {
      content: "Chúng tôi hướng đến sự cân bằng giữa hiện đại và truyền thống, giúp bạn khám phá bản thân, định hình con đường riêng, và kết nối sâu sắc hơn với chính mình."
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
                  <CardContent className="flex flex-col justify-center items-center p-6 md:p-10 text-center min-h-[300px]">
                    <Sparkles className="h-8 w-8 mb-4 text-amber-600" />
                    <p className="text-lg md:text-xl text-amber-900 leading-relaxed">{slide.content}</p>
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
