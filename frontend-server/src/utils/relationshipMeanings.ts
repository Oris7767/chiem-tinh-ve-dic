
// Relationship meanings data structure
export interface RelationshipMeaning {
  number: number;
  planet: string;
  description: {
    en: string;
    vi: string;
  };
}

// Function to get relationship description for a specific number
export const getRelationshipDescription = (number: number, lang: 'en' | 'vi'): string => {
  const relationshipMeaning = relationshipMeanings.find(m => m.number === number);
  if (!relationshipMeaning) {
    return lang === 'en' ? 'Relationship description not available' : 'Mô tả mối quan hệ không có sẵn';
  }
  return relationshipMeaning.description[lang];
};

// Relationship meanings database extracted from Vedic numerology data
export const relationshipMeanings: RelationshipMeaning[] = [
  {
    number: 1, // Sun
    planet: 'Sun',
    description: {
      en: "Number 1 individuals in relationships are dignified and popular. They exhibit confidence while maintaining patience. Their partners find them attractive due to their self-assurance and leadership qualities. While they may experience fluctuating fortunes in life, their honesty attracts loyal partners. In relationships, they prefer to take the lead but should be mindful of their ego to maintain harmony.",
      vi: "Những người có Số 1 trong các mối quan hệ đều đáng kính và được yêu thích. Họ thể hiện sự tự tin trong khi duy trì sự kiên nhẫn. Đối tác của họ thấy họ hấp dẫn nhờ sự tự tin và phẩm chất lãnh đạo. Mặc dù họ có thể trải qua sự thăng trầm trong cuộc sống, nhưng sự trung thực của họ thu hút đối tác trung thành. Trong các mối quan hệ, họ thích dẫn đầu nhưng nên chú ý đến cái tôi của mình để duy trì sự hài hòa."
    }
  },
  {
    number: 2, // Moon
    planet: 'Moon',
    description: {
      en: "Moon's Number 2 people are highly emotional, sensitive, and intuitive in relationships. They often sacrifice for others' welfare and happiness, shouldering their burdens too. Their natural ability to attract people through their speech makes them compelling partners. However, they may experience ups and downs in personal relationships and can be let down by family and friends. Faith in higher powers helps them navigate relationship challenges.",
      vi: "Những người có Số 2 của Mặt trăng rất xúc động, nhạy cảm và trực giác trong các mối quan hệ. Họ thường hy sinh vì phúc lợi và hạnh phúc của người khác, gánh vác gánh nặng của họ. Khả năng tự nhiên của họ trong việc thu hút mọi người thông qua lời nói làm cho họ trở thành những đối tác hấp dẫn. Tuy nhiên, họ có thể trải qua thăng trầm trong các mối quan hệ cá nhân và có thể bị gia đình và bạn bè làm thất vọng. Niềm tin vào các sức mạnh cao hơn giúp họ vượt qua thách thức trong mối quan hệ."
    }
  },
  {
    number: 3, // Jupiter
    planet: 'Jupiter',
    description: {
      en: "Jupiter's Number 3 individuals are often self-centered and focused on their own happiness, yet they can be loyal partners. With great determination, they achieve success and solve problems tactfully. Their dynamism and oratorical skills make them attractive partners. Marital life can be blissful for them. They progress steadily in life and relationships, achieving permanent positions of respect and comfort.",
      vi: "Những người có Số 3 thuộc sao Mộc thường tự trọng và tập trung vào hạnh phúc của chính họ, nhưng họ có thể là những đối tác trung thành. Với quyết tâm lớn, họ đạt được thành công và giải quyết vấn đề một cách khéo léo. Sự năng động và kỹ năng hùng biện khiến họ trở thành những đối tác hấp dẫn. Cuộc sống hôn nhân có thể hạnh phúc đối với họ. Họ tiến bộ đều đặn trong cuộc sống và các mối quan hệ, đạt được vị trí tôn trọng và thoải mái vĩnh viễn."
    }
  },
  {
    number: 4, // Rahu
    planet: 'Rahu',
    description: {
      en: "Rahu's Number 4 people may face challenges in relationships due to needless fears and opposition. Men with this number often have bitter experiences with women. They're drawn toward gambling, speculation, and other vices that can affect their relationships. However, they can be good administrators and face difficulties with courage. They need honest partners who can help them stay grounded and avoid negative influences.",
      vi: "Những người có Số 4 của Rahu có thể gặp thách thức trong các mối quan hệ do sợ hãi và đối lập không cần thiết. Đàn ông có số này thường có những trải nghiệm đắng cay với phụ nữ. Họ bị thu hút bởi cờ bạc, đầu cơ và các tệ nạn khác có thể ảnh hưởng đến các mối quan hệ của họ. Tuy nhiên, họ có thể là những nhà quản lý giỏi và đối mặt với khó khăn một cách can đảm. Họ cần những đối tác trung thực có thể giúp họ giữ vững lập trường và tránh những ảnh hưởng tiêu cực."
    }
  },
  {
    number: 5, // Mercury
    planet: 'Mercury',
    description: {
      en: "Mercury's Number 5 individuals charm people with their dynamism and communication skills. They enjoy success in love and can attract many admirers. However, they should be cautious about relationships formed in haste. They're lucky in love and can find partners who support their ambitions. Their witty nature and intelligence make them engaging partners, though they need someone who can match their versatility and adaptability.",
      vi: "Những người có Số 5 của sao Thủy quyến rũ mọi người bằng sự năng động và kỹ năng giao tiếp. Họ tận hưởng thành công trong tình yêu và có thể thu hút nhiều người ngưỡng mộ. Tuy nhiên, họ nên thận trọng về các mối quan hệ được hình thành trong vội vàng. Họ may mắn trong tình yêu và có thể tìm thấy đối tác hỗ trợ tham vọng của họ. Bản chất hài hước và thông minh khiến họ trở thành những đối tác hấp dẫn, mặc dù họ cần người có thể phù hợp với tính linh hoạt và khả năng thích ứng của họ."
    }
  },
  {
    number: 6, // Venus
    planet: 'Venus',
    description: {
      en: "Venus' Number 6 people enjoy peaceful, satisfying relationships with a balanced mind. Their romantic nature and charm make them attractive partners. They may move toward professional success but have a generous and peaceful disposition in relationships. Their family life is typically happy and idealistic. They excel in fine arts and can charm others with their tact and speech. Marriage can bring them partners of higher status and wealth.",
      vi: "Những người có Số 6 của Kim Tinh tận hưởng các mối quan hệ hòa bình, hài lòng với tâm trí cân bằng. Bản chất lãng mạn và quyến rũ khiến họ trở thành những đối tác hấp dẫn. Họ có thể hướng tới thành công trong nghề nghiệp nhưng có tính cách rộng lượng và hòa bình trong các mối quan hệ. Cuộc sống gia đình của họ thường hạnh phúc và lý tưởng. Họ xuất sắc trong nghệ thuật đẹp và có thể quyến rũ người khác bằng sự khéo léo và lời nói của họ. Hôn nhân có thể mang lại cho họ đối tác có địa vị và sự giàu có cao hơn."
    }
  },
  {
    number: 7, // Ketu
    planet: 'Ketu',
    description: {
      en: "Ketu's Number 7 individuals experience many trials in relationships but emerge stronger with spiritual growth and confidence. They're principled and set high standards for themselves and their partners. Their relationships may start with struggles but end with respect and honor. Some may sacrifice comfort for freedom and following their desires. Their clarity of thought helps them navigate complex relationship dynamics.",
      vi: "Những người có Số 7 của Ketu trải qua nhiều thử thách trong các mối quan hệ nhưng trở nên mạnh mẽ hơn với sự phát triển tâm linh và sự tự tin. Họ có nguyên tắc và đặt ra tiêu chuẩn cao cho bản thân và đối tác. Các mối quan hệ của họ có thể bắt đầu với những cuộc đấu tranh nhưng kết thúc với sự tôn trọng và danh dự. Một số người có thể hy sinh sự thoải mái để được tự do và theo đuổi mong muốn của họ. Sự rõ ràng trong suy nghĩ giúp họ điều hướng động lực phức tạp trong mối quan hệ."
    }
  },
  {
    number: 8, // Saturn
    planet: 'Saturn',
    description: {
      en: "Saturn's Number 8 people face challenges in relationships, especially in married life. They may experience losses due to friends and partners and encounter repeated failures. However, with spiritual practice, they can achieve great success in relationships. Their intelligence and determination help them overcome relationship obstacles. Women under this number attract admiration and respect from society. They can achieve a fearless and balanced approach to relationships through personal growth.",
      vi: "Những người có Số 8 của Sao Thổ phải đối mặt với thách thức trong các mối quan hệ, đặc biệt là trong cuộc sống hôn nhân. Họ có thể gặp tổn thất do bạn bè và đối tác và gặp phải những thất bại lặp đi lặp lại. Tuy nhiên, với thực hành tâm linh, họ có thể đạt được thành công lớn trong các mối quan hệ. Trí thông minh và quyết tâm giúp họ vượt qua trở ngại trong mối quan hệ. Phụ nữ dưới số này thu hút sự ngưỡng mộ và tôn trọng từ xã hội. Họ có thể đạt được cách tiếp cận không sợ hãi và cân bằng đối với các mối quan hệ thông qua sự phát triển cá nhân."
    }
  },
  {
    number: 9, // Mars
    planet: 'Mars',
    description: {
      en: "Mars' Number 9 individuals experience both travel and struggles in relationships but usually achieve victory in the end. Their wisdom and capability help them navigate the complexities of personal connections. Marital life can be blissful, especially after overcoming initial challenges. They create problems for themselves when attempting things beyond their capacity but have the determination to succeed eventually. Their lives ultimately lead to luxury and comfort in relationships.",
      vi: "Những người có Số 9 của Sao Hỏa trải qua cả du lịch và đấu tranh trong các mối quan hệ nhưng thường đạt được chiến thắng cuối cùng. Sự khôn ngoan và khả năng giúp họ vượt qua những phức tạp của các kết nối cá nhân. Cuộc sống hôn nhân có thể rất hạnh phúc, đặc biệt là sau khi vượt qua những thách thức ban đầu. Họ tạo ra vấn đề cho chính mình khi cố gắng làm những việc vượt quá khả năng nhưng có quyết tâm cuối cùng thành công. Cuộc sống của họ cuối cùng dẫn đến sự xa xỉ và thoải mái trong các mối quan hệ."
    }
  }
];
