
// Strengths and challenges data structure
export interface StrengthsAndChallenges {
  number: number;
  planet: string;
  strengths: {
    en: string[];
    vi: string[];
  };
  challenges: {
    en: string[];
    vi: string[];
  };
}

// Function to get strengths for a specific number
export const getStrengths = (number: number, lang: 'en' | 'vi'): string[] => {
  const data = strengthsAndChallengesData.find(item => item.number === number);
  if (!data) {
    return lang === 'en' 
      ? ['No specific strengths available'] 
      : ['Không có thông tin cụ thể về điểm mạnh'];
  }
  return data.strengths[lang];
};

// Function to get challenges for a specific number
export const getChallenges = (number: number, lang: 'en' | 'vi'): string[] => {
  const data = strengthsAndChallengesData.find(item => item.number === number);
  if (!data) {
    return lang === 'en' 
      ? ['No specific challenges available'] 
      : ['Không có thông tin cụ thể về thách thức'];
  }
  return data.challenges[lang];
};

// Strengths and challenges database extracted from Vedic numerology data
export const strengthsAndChallengesData: StrengthsAndChallenges[] = [
  {
    number: 1, // Sun
    planet: 'Sun',
    strengths: {
      en: [
        "Natural leadership abilities",
        "Dignified and popular presence",
        "Self-confidence and patience",
        "Progressive and ambitious",
        "Ability to gain popularity through honesty"
      ],
      vi: [
        "Khả năng lãnh đạo tự nhiên",
        "Hiện diện đường hoàng và được yêu thích",
        "Tự tin và kiên nhẫn",
        "Tiến bộ và đầy tham vọng",
        "Khả năng đạt được sự nổi tiếng thông qua sự trung thực"
      ]
    },
    challenges: {
      en: [
        "Fortunes change frequently like a revolving wheel",
        "Must maintain honesty in all activities",
        "May become over-adamant in nature",
        "Can be too focused on status and recognition",
        "Might risk losing focus due to popularity"
      ],
      vi: [
        "Vận may thay đổi thường xuyên như một bánh xe quay",
        "Phải duy trì sự trung thực trong mọi hoạt động",
        "Có thể trở nên quá cứng đầu",
        "Có thể quá tập trung vào địa vị và sự công nhận",
        "Có thể có nguy cơ mất tập trung do nổi tiếng"
      ]
    }
  },
  {
    number: 2, // Moon
    planet: 'Moon',
    strengths: {
      en: [
        "Strong faith and spiritual connection",
        "Ability to provide relief to others",
        "Capacity for social reforms",
        "Honest, peace-loving and gentle nature",
        "Attractive to influential people"
      ],
      vi: [
        "Đức tin mạnh mẽ và kết nối tâm linh",
        "Khả năng mang lại sự nhẹ nhõm cho người khác",
        "Năng lực thực hiện cải cách xã hội",
        "Bản chất trung thực, yêu hòa bình và dịu dàng",
        "Thu hút những người có ảnh hưởng"
      ]
    },
    challenges: {
      en: [
        "May be let down by family and friends",
        "Often faces legal disputes",
        "Can encounter sudden dangers and difficulties",
        "Risk of being cheated by bad people",
        "Religious reforms may face opposition"
      ],
      vi: [
        "Có thể bị gia đình và bạn bè làm thất vọng",
        "Thường đối mặt với tranh chấp pháp lý",
        "Có thể gặp phải nguy hiểm và khó khăn đột ngột",
        "Nguy cơ bị lừa dối bởi người xấu",
        "Cải cách tôn giáo có thể đối mặt với sự phản đối"
      ]
    }
  },
  {
    number: 3, // Jupiter
    planet: 'Jupiter',
    strengths: {
      en: [
        "Intelligence and hard work lead to success",
        "Excellent oratorical skills",
        "Perfection in fine arts",
        "Strong dynamism and enthusiasm",
        "Good poetic and writing abilities"
      ],
      vi: [
        "Trí thông minh và chăm chỉ dẫn đến thành công",
        "Kỹ năng hùng biện xuất sắc",
        "Sự hoàn hảo trong nghệ thuật tinh tế",
        "Năng động và nhiệt tình mạnh mẽ",
        "Khả năng sáng tác thơ và viết lách tốt"
      ]
    },
    challenges: {
      en: [
        "Can face opposition in social matters",
        "May create problems by attempting things beyond capacity",
        "Risk of losing interest after initial success",
        "Often doesn't get rewards commensurate to their efforts",
        "May focus too much on religious matters"
      ],
      vi: [
        "Có thể đối mặt với sự phản đối trong các vấn đề xã hội",
        "Có thể tạo ra vấn đề bằng cách cố gắng làm những điều vượt quá khả năng",
        "Nguy cơ mất hứng thú sau thành công ban đầu",
        "Thường không nhận được phần thưởng tương xứng với nỗ lực của họ",
        "Có thể tập trung quá nhiều vào các vấn đề tôn giáo"
      ]
    }
  },
  {
    number: 4, // Rahu
    planet: 'Rahu',
    strengths: {
      en: [
        "Wealth accumulation through varied sources",
        "Ability to overcome afflictions",
        "Helpful in solving others' problems",
        "Worldly wisdom and information",
        "Excellence in medicine and healing fields"
      ],
      vi: [
        "Tích lũy của cải thông qua nhiều nguồn khác nhau",
        "Khả năng vượt qua khó khăn",
        "Giúp ích trong việc giải quyết vấn đề của người khác",
        "Sự thông thái và thông tin về thế giới",
        "Xuất sắc trong y học và các lĩnh vực chữa bệnh"
      ]
    },
    challenges: {
      en: [
        "Needless fears and opposition",
        "Often work as subordinates despite knowledge",
        "May have bitter experiences with opposite gender",
        "Face numerous unexpected events",
        "Risk of losing worldly possessions"
      ],
      vi: [
        "Nỗi sợ không cần thiết và sự phản đối",
        "Thường làm việc như cấp dưới mặc dù có kiến thức",
        "Có thể có những trải nghiệm đắng cay với giới tính đối lập",
        "Đối mặt với nhiều sự kiện không lường trước",
        "Nguy cơ mất đi tài sản thế gian"
      ]
    }
  },
  {
    number: 5, // Mercury
    planet: 'Mercury',
    strengths: {
      en: [
        "Charm and dynamic personality",
        "Success in trade and business ventures",
        "Excellent analytical and research abilities",
        "Above-average intelligence and wit",
        "Adaptability and progressive energy"
      ],
      vi: [
        "Cá tính quyến rũ và năng động",
        "Thành công trong thương mại và kinh doanh",
        "Khả năng phân tích và nghiên cứu xuất sắc",
        "Trí thông minh và sự dí dỏm trên trung bình",
        "Khả năng thích ứng và năng lượng tiến bộ"
      ]
    },
    challenges: {
      en: [
        "May face disappointment by trusting others",
        "Risk from natural elements (thunder, water, fire)",
        "Needs to cultivate perseverance and concentration",
        "Tendency to spend money lavishly",
        "Potential for nervous disorders if not careful"
      ],
      vi: [
        "Có thể đối mặt với thất vọng khi tin tưởng người khác",
        "Rủi ro từ các yếu tố tự nhiên (sấm sét, nước, lửa)",
        "Cần rèn luyện sự kiên trì và tập trung",
        "Xu hướng chi tiêu tiền một cách xa hoa",
        "Tiềm ẩn rối loạn thần kinh nếu không cẩn thận"
      ]
    }
  },
  {
    number: 6, // Venus
    planet: 'Venus',
    strengths: {
      en: [
        "Peaceful life and contented mind",
        "Excellence in fine arts",
        "Charming appearance and forceful speech",
        "Alluring personality attracts others",
        "Divine grace combined with material prosperity"
      ],
      vi: [
        "Cuộc sống bình yên và tâm trí hài lòng",
        "Xuất sắc trong nghệ thuật tinh tế",
        "Vẻ ngoài quyến rũ và lời nói mạnh mẽ",
        "Cá tính cuốn hút thu hút người khác",
        "Ân sủng thiêng liêng kết hợp với sự thịnh vượng vật chất"
      ]
    },
    challenges: {
      en: [
        "Tendency toward lust, revenge, and malice",
        "May become increasingly selfish",
        "Can develop greed and miserly tendencies",
        "Risk of being overly swayed by emotions",
        "May spend money lavishly for self-satisfaction"
      ],
      vi: [
        "Xu hướng hướng tới dục vọng, trả thù và ác ý",
        "Có thể trở nên ngày càng ích kỷ",
        "Có thể phát triển tính tham lam và keo kiệt",
        "Nguy cơ bị cảm xúc chi phối quá mức",
        "Có thể chi tiêu tiền một cách xa hoa để thỏa mãn bản thân"
      ]
    }
  },
  {
    number: 7, // Ketu
    planet: 'Ketu',
    strengths: {
      en: [
        "High principles and virtuous qualities",
        "Clarity of thought and well-planned actions",
        "Extraordinary powers of imagination",
        "Excellence in speaking and writing",
        "Ability to bring new ideas about religion and nature"
      ],
      vi: [
        "Nguyên tắc cao và phẩm chất đức hạnh",
        "Suy nghĩ rõ ràng và hành động có kế hoạch",
        "Sức mạnh phi thường của trí tưởng tượng",
        "Xuất sắc trong nói và viết",
        "Khả năng đưa ra ý tưởng mới về tôn giáo và thiên nhiên"
      ]
    },
    challenges: {
      en: [
        "Faces many trials throughout life",
        "Experiences unexpected changes",
        "Revolutionary nature creates new enemies",
        "Efforts often do not produce desired results",
        "May quit comfortable life for new, unstable paths"
      ],
      vi: [
        "Đối mặt với nhiều thử thách trong suốt cuộc đời",
        "Trải nghiệm những thay đổi không lường trước",
        "Bản chất cách mạng tạo ra kẻ thù mới",
        "Nỗ lực thường không mang lại kết quả mong muốn",
        "Có thể từ bỏ cuộc sống thoải mái để theo đuổi con đường mới, không ổn định"
      ]
    }
  },
  {
    number: 8, // Saturn
    planet: 'Saturn',
    strengths: {
      en: [
        "Success in spiritual pursuits",
        "Ability to develop mystic powers",
        "Strong determination and persistence",
        "Counseling abilities due to intelligence",
        "Success in theological research"
      ],
      vi: [
        "Thành công trong theo đuổi tâm linh",
        "Khả năng phát triển sức mạnh huyền bí",
        "Quyết tâm và kiên trì mạnh mẽ",
        "Khả năng tư vấn nhờ trí thông minh",
        "Thành công trong nghiên cứu thần học"
      ]
    },
    challenges: {
      en: [
        "Must control pleasures or success will be delayed",
        "Faces unexpected dangers and difficulties",
        "Risk of losses due to friends and partners",
        "Circumstances leading to failure and confusion",
        "Potential reduction in lifespan due to challenges"
      ],
      vi: [
        "Phải kiểm soát những thú vui hoặc thành công sẽ bị trì hoãn",
        "Đối mặt với nguy hiểm và khó khăn không lường trước",
        "Nguy cơ tổn thất do bạn bè và đối tác",
        "Hoàn cảnh dẫn đến thất bại và nhầm lẫn",
        "Khả năng giảm tuổi thọ do những thách thức"
      ]
    }
  },
  {
    number: 9, // Mars
    planet: 'Mars',
    strengths: {
      en: [
        "Clear mind, intelligence, and success",
        "Hard work leads to prominent positions",
        "Excellent conversational and entertainment skills",
        "Wealth that remains intact for generations",
        "Natural teaching abilities"
      ],
      vi: [
        "Tâm trí rõ ràng, thông minh và thành công",
        "Làm việc chăm chỉ dẫn đến vị trí nổi bật",
        "Kỹ năng trò chuyện và giải trí xuất sắc",
        "Tài sản còn nguyên vẹn qua nhiều thế hệ",
        "Khả năng giảng dạy tự nhiên"
      ]
    },
    challenges: {
      en: [
        "Selfishness may lead to antisocial activities",
        "Jealousy, malice, and dangers from weapons",
        "Early life struggles and challenges",
        "Stubbornness and thoughtless decisions",
        "Potential for being attacked by enemies"
      ],
      vi: [
        "Tính ích kỷ có thể dẫn đến các hoạt động chống đối xã hội",
        "Ghen tị, ác ý và nguy hiểm từ vũ khí",
        "Cuộc sống ban đầu đầy vất vả và thách thức",
        "Cứng đầu và quyết định thiếu suy nghĩ",
        "Tiềm ẩn bị tấn công bởi kẻ thù"
      ]
    }
  }
];
