
// Career meanings data structure
export interface CareerMeaning {
  number: number;
  planet: string;
  description: {
    en: string;
    vi: string;
  };
}

// Function to get career description for a specific number
export const getCareerDescription = (number: number, lang: 'en' | 'vi'): string => {
  const careerMeaning = careerMeanings.find(m => m.number === number);
  if (!careerMeaning) {
    return lang === 'en' ? 'Career description not available' : 'Mô tả nghề nghiệp không có sẵn';
  }
  return careerMeaning.description[lang];
};

// Career meanings database extracted from Vedic numerology data
export const careerMeanings: CareerMeaning[] = [
  {
    number: 1, // Sun
    planet: 'Sun',
    description: {
      en: "People with Number 1 excel in leadership positions, government roles, and entrepreneurship. Their confidence, dignity, and popular nature make them suitable for high-visibility careers. They may experience ups and downs like a revolving wheel, but with honesty, they gain popularity and financial stability. They are natural leaders who can rise to prestigious positions.",
      vi: "Người có Số 1 thành công trong các vị trí lãnh đạo, vai trò chính phủ và kinh doanh. Sự tự tin, phẩm giá và tính cách được yêu thích giúp họ phù hợp với các nghề nghiệp có tầm nhìn cao. Họ có thể trải qua thăng trầm như một bánh xe quay, nhưng với sự trung thực, họ đạt được sự nổi tiếng và ổn định tài chính. Họ là những nhà lãnh đạo tự nhiên có thể vươn lên vị trí danh giá."
    }
  },
  {
    number: 2, // Moon
    planet: 'Moon',
    description: {
      en: "Number 2 individuals thrive in careers related to spirituality, social reforms, and medical fields. They have the ability to provide relief to masses from grief and struggles, earning admiration. Their faith in higher powers helps them overcome challenges. They can be excellent counselors and often work in roles that involve helping others through their emotional intelligence.",
      vi: "Người có Số 2 phát triển mạnh trong sự nghiệp liên quan đến tâm linh, cải cách xã hội và các lĩnh vực y tế. Họ có khả năng mang lại sự cứu trợ cho đại chúng khỏi đau buồn và khó khăn, nhận được sự ngưỡng mộ. Niềm tin vào các sức mạnh cao hơn giúp họ vượt qua thách thức. Họ có thể là những cố vấn xuất sắc và thường làm việc trong các vai trò liên quan đến việc giúp đỡ người khác thông qua trí tuệ cảm xúc của họ."
    }
  },
  {
    number: 3, // Jupiter
    planet: 'Jupiter',
    description: {
      en: "Jupiter's Number 3 people excel in education, communication, and creative fields. They are hardworking, intelligent, and gradually progress in their careers. Their oratorical skills, dynamism, and perfection in fine arts bring them recognition and patronage from authorities. They can become excellent writers, poets, and teachers, spreading their wisdom and earning popularity through their expressive talents.",
      vi: "Người có Số 3 thuộc Sao Mộc xuất sắc trong giáo dục, truyền thông và các lĩnh vực sáng tạo. Họ chăm chỉ, thông minh và dần tiến bộ trong sự nghiệp. Kỹ năng hùng biện, sự năng động và sự hoàn hảo trong nghệ thuật đẹp mang lại cho họ sự công nhận và sự bảo trợ từ các cơ quan chức năng. Họ có thể trở thành những nhà văn, nhà thơ và giáo viên xuất sắc, truyền bá sự khôn ngoan của họ và kiếm được sự nổi tiếng thông qua tài năng biểu đạt của họ."
    }
  },
  {
    number: 4, // Rahu
    planet: 'Rahu',
    description: {
      en: "Those with Number 4 (Rahu) may work as subordinates despite their knowledge and worldly wisdom. They excel in fields requiring determination and methodical approaches. Their ability to overcome afflictions and solve others' problems makes them valuable in medicine and healing professions. Those with favorable birth numbers can achieve distinction and honor in their careers, often through extensive travel and trade.",
      vi: "Những người có Số 4 (Rahu) có thể làm việc như cấp dưới mặc dù kiến thức và sự thông thái của họ. Họ xuất sắc trong các lĩnh vực đòi hỏi sự quyết tâm và phương pháp tiếp cận có phương pháp. Khả năng vượt qua khó khăn và giải quyết vấn đề của người khác làm cho họ có giá trị trong các nghề y học và chữa bệnh. Những người có số sinh thuận lợi có thể đạt được sự khác biệt và danh dự trong sự nghiệp của họ, thường thông qua du lịch và thương mại mở rộng."
    }
  },
  {
    number: 5, // Mercury
    planet: 'Mercury',
    description: {
      en: "Mercury's Number 5 individuals excel in trades, research, and communication fields. Their charm, dynamism, and intelligence help them find success in various endeavors. They're natural writers, especially with humor, and can achieve things that others can't even imagine. Their accomplishments often astonish those around them, and they gain patronage and respect from people in high positions. They do well in jobs requiring analysis, travel, and versatility.",
      vi: "Những người có Số 5 (Thủy tinh) xuất sắc trong các ngành thương mại, nghiên cứu và lĩnh vực truyền thông. Sự quyến rũ, năng động và thông minh giúp họ tìm thấy thành công trong nhiều nỗ lực khác nhau. Họ là những nhà văn tự nhiên, đặc biệt là với sự hài hước, và có thể đạt được những điều mà người khác thậm chí không thể tưởng tượng. Thành tích của họ thường làm ngạc nhiên những người xung quanh, và họ nhận được sự bảo trợ và tôn trọng từ những người ở vị trí cao. Họ làm tốt trong các công việc đòi hỏi phân tích, đi lại và đa năng."
    }
  },
  {
    number: 6, // Venus
    planet: 'Venus',
    description: {
      en: "Those with Number 6 (Venus) find success in fine arts, beauty-related fields, and peaceful professions. Their alluring personality, charm, and determination help them achieve material success. Many excel in uniformed services, rising to high positions despite humble beginnings. They attract wealth and prosperity, especially when they use their talents in creative and aesthetic fields. They're skilled conversationalists with logical arguments and can achieve positions of high rank.",
      vi: "Những người có Số 6 (Kim tinh) tìm thấy thành công trong nghệ thuật đẹp, các lĩnh vực liên quan đến vẻ đẹp và các nghề nghiệp hòa bình. Tính cách quyến rũ, sự quyến rũ và quyết tâm giúp họ đạt được thành công về vật chất. Nhiều người xuất sắc trong các dịch vụ đồng phục, vươn lên vị trí cao dù xuất thân khiêm tốn. Họ thu hút sự giàu có và thịnh vượng, đặc biệt là khi họ sử dụng tài năng của mình trong các lĩnh vực sáng tạo và thẩm mỹ. Họ là những người trò chuyện khéo léo với những lập luận hợp lý và có thể đạt được các vị trí có hạng cao."
    }
  },
  {
    number: 7, // Ketu
    planet: 'Ketu',
    description: {
      en: "Ketu's Number 7 people excel in spiritual and intellectual pursuits. They typically face many trials in life but gain wisdom, spiritual growth, and clarity of thought through these experiences. They can achieve eminence in spiritual careers and proficiency in scriptures and fine arts. Some become revolutionary thinkers with extraordinary powers of imagination, speaking, and writing. They often bring new ideas about religion and nature and can be successful in all their efforts.",
      vi: "Người Số 7 của Ketu xuất sắc trong các hoạt động tâm linh và trí tuệ. Họ thường phải đối mặt với nhiều thử thách trong cuộc sống nhưng đạt được sự khôn ngoan, phát triển tâm linh và sự rõ ràng trong suy nghĩ thông qua những trải nghiệm này. Họ có thể đạt được sự nổi bật trong sự nghiệp tâm linh và thành thạo trong kinh thánh và nghệ thuật đẹp. Một số trở thành những nhà tư tưởng cách mạng với sức mạnh phi thường của trí tưởng tượng, nói và viết. Họ thường mang lại những ý tưởng mới về tôn giáo và thiên nhiên và có thể thành công trong tất cả các nỗ lực của họ."
    }
  },
  {
    number: 8, // Saturn
    planet: 'Saturn',
    description: {
      en: "Saturn's Number 8 individuals find success in industries involving many people, like cinema, printing, mining, and sports. They can be excellent counselors due to their intelligence. With proper spiritual practice, they may develop mystic powers and succeed in theological research. Those with favorable birth numbers can acquire great wealth and property. They work with determination and persistence, often achieving success after significant struggles.",
      vi: "Những cá nhân Số 8 của Sao Thổ tìm thấy thành công trong các ngành công nghiệp liên quan đến nhiều người, như điện ảnh, in ấn, khai thác mỏ và thể thao. Họ có thể là những cố vấn xuất sắc nhờ vào trí thông minh của họ. Với thực hành tâm linh đúng đắn, họ có thể phát triển sức mạnh huyền bí và thành công trong nghiên cứu thần học. Những người có số sinh thuận lợi có thể có được tài sản và tài sản lớn. Họ làm việc với quyết tâm và kiên trì, thường đạt được thành công sau những cuộc đấu tranh đáng kể."
    }
  },
  {
    number: 9, // Mars
    planet: 'Mars',
    description: {
      en: "Mars' Number 9 people excel in positions requiring leadership, strategy, and courage. They thrive in uniformed services like police and military, often rising to high ranks. Their clear mind, intelligence, and hard work bring them success in positions of prominence. They can be good conversationalists and entertainers. Even those who start from humble beginnings can achieve high status and wealth that remains intact for generations. They have natural teaching abilities.",
      vi: "Những người Số 9 của Sao Hỏa xuất sắc trong các vị trí đòi hỏi lãnh đạo, chiến lược và lòng can đảm. Họ phát triển mạnh trong các dịch vụ đồng phục như cảnh sát và quân đội, thường vươn lên hàng ngũ cao. Tâm trí trong sáng, trí thông minh và làm việc chăm chỉ mang lại cho họ thành công ở các vị trí nổi bật. Họ có thể là những người trò chuyện và giải trí tốt. Ngay cả những người bắt đầu từ xuất thân khiêm tốn cũng có thể đạt được địa vị cao và sự giàu có vẫn còn nguyên vẹn trong nhiều thế hệ. Họ có khả năng giảng dạy tự nhiên."
    }
  }
];
