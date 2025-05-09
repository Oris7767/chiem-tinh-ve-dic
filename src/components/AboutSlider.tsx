
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-none glass-card overflow-hidden">
                  <CardContent className="flex flex-col justify-center items-center p-6 md:p-10 text-center min-h-[300px]">
                    <Sparkles className="h-8 w-8 mb-4 text-amber-600" />
                    <p className="text-lg md:text-xl text-amber-900 leading-relaxed">{slide.content}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
          <CarouselPrevious className="relative left-0 translate-y-0 bg-amber-600 text-white hover:bg-amber-700 border-none" />
          <CarouselNext className="relative right-0 translate-y-0 bg-amber-600 text-white hover:bg-amber-700 border-none" />
        </div>
      </Carousel>
    </div>
  );
};

export default AboutSlider;
