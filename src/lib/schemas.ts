// Schema for Calculator (Homepage)
export const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Máy tính Số học Vệ Đà",
  "applicationCategory": "CalculatorApplication",
  "description": "Công cụ tính toán số học Vệ Đà dựa trên ngày sinh và tên của bạn",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND"
  },
  "featureList": [
    "Tính số đường đời",
    "Phân tích số cá nhân",
    "Khám phá số vận mệnh",
    "Tương thích với số học Vệ Đà cổ đại"
  ]
};

// Schema for Lục Nhâm (auspicious dates) page — local calculator, no server dependency
export const lucNhamSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Lục Nhâm – Chọn ngày giờ tốt",
  "url": "https://vedicvn.com/luc-nham",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript. Tính toán Lục Nhâm chạy cục bộ trên trình duyệt.",
  "inLanguage": "vi-VN",
  "description":
    "Công cụ tham khảo ngày giờ tốt theo phương pháp Đại Lục Nhâm: xem ngày thuận lợi theo mục đích (xuất hành, cưới hỏi, khai trương…), dữ liệu cục bộ.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND"
  },
  "featureList": [
    "Dự báo 30 ngày theo tháng và mục đích",
    "Can Chi, môn tướng thần và gợi ý ngày thuận / cần thận trọng",
    "Không gửi dữ liệu sinh lên máy chủ cho phần tính Lục Nhâm"
  ],
  "publisher": {
    "@type": "Organization",
    "name": "chiemtinhvedavn",
    "url": "https://vedicvn.com/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vedicvn.com/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png"
    }
  }
};

// Schema for Vedic Chart page
export const vedicChartSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Bản đồ sao Vệ Đà (Jyotish)",
  "url": "https://vedicvn.com/vedic-chart",
  "applicationCategory": "AstrologyApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Requires JavaScript. Lá số được tính qua dịch vụ backend.",
  "inLanguage": "vi-VN",
  "description":
    "Tạo lá số chiêm tinh Vệ Đà (Jyotish): cung Mệnh, vị trí Graha, nhà Bhava, Vimshottari Dasha và bản đồ Nam Ấn.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND"
  },
  "featureList": [
    "Lá số theo ngày giờ sinh, tọa độ và múi giờ",
    "Bảng hành tinh, nhà, Dasha / AntarDasha",
    "Xuất SVG / PNG / PDF",
    "Hệ nhà và ayanamsa tùy chọn"
  ],
  "publisher": {
    "@type": "Organization",
    "name": "chiemtinhvedavn",
    "url": "https://vedicvn.com/"
  }
};

// Panchang (daily Hindu calendar view)
export const panchangSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Panchang — Lịch thiên văn hôm nay",
  "url": "https://vedicvn.com/panchang",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Any",
  "inLanguage": "vi-VN",
  "description":
    "Xem Tithi, Nakshatra, Yoga, Karana, giờ Rahu và các sự kiện Mặt Trời / Mặt Trăng theo Panchang.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND"
  }
};

// Standalone numerology calculator route
export const numerologyPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Máy tính số học Vệ Đà",
  "url": "https://vedicvn.com/numerology",
  "applicationCategory": "CalculatorApplication",
  "operatingSystem": "Any",
  "inLanguage": "vi-VN",
  "description": "Tính số sinh, số tên và số cuộc đời theo số học Vệ Đà từ họ tên và ngày sinh.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND"
  }
};

// Schema for Blog
export const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Blog Số học Vệ Đà",
  "description": "Khám phá kiến thức về số học và chiêm tinh Vệ Đà",
  "publisher": {
    "@type": "Organization",
    "name": "chiemtinhvedavn",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vedicvn.com/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png"
    }
  }
};

// Schema for Blog Post
export const createBlogPostSchema = (post: {
  title: string;
  description: string;
  datePublished: string;
  image?: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.description,
  "image": post.image || "https://vedicvn.com/lovable-uploads/a4ffc284-5fa3-4e81-b16e-11136da35031.png",
  "datePublished": post.datePublished,
  "author": {
    "@type": "Person",
    "name": post.author || "chiemtinhvedavn"
  },
  "publisher": {
    "@type": "Organization",
    "name": "chiemtinhvedavn",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vedicvn.com/lovable-uploads/97fa6e16-3fd9-42cd-887d-d6d1d4d3ee6b.png"
    }
  }
}); 