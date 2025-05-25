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

// Schema for Vedic Chart page
export const vedicChartSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Bản đồ sao Vệ Đà",
  "applicationCategory": "AstrologyApplication",
  "description": "Công cụ tạo và phân tích bản đồ sao theo chiêm tinh Vệ Đà",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "VND"
  },
  "featureList": [
    "Tạo bản đồ sao cá nhân",
    "Phân tích vị trí các hành tinh",
    "Xem xét các cung hoàng đạo",
    "Giải đoán theo chiêm tinh Vệ Đà"
  ]
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