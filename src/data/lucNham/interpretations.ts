export type LucNhamPurpose =
  | 'xay-dung-nhap-trach'
  | 'an-tang-than-su'
  | 'xay-bep-chuong-trai'
  | 'xuat-hanh'
  | 'ket-hon'
  | 'khai-truong-khac'
  | 'thi-dau';

export const PURPOSE_LABELS: Record<LucNhamPurpose, string> = {
  'xay-dung-nhap-trach': 'Xây dựng và nhập trạch',
  'an-tang-than-su': 'An táng và thần sự',
  'xay-bep-chuong-trai': 'Xây bếp và chuồng trại',
  'xuat-hanh': 'Xuất hành',
  'ket-hon': 'Kết hôn',
  'khai-truong-khac': 'Khai trương và việc khác',
  'thi-dau': 'Thi đấu',
};

export type PurposeInterpretationSet = {
  good: string[];
  bad: string[];
};

export const PURPOSE_INTERPRETATIONS: Record<LucNhamPurpose, PurposeInterpretationSet> = {
  'xay-dung-nhap-trach': {
    good: [
      'Ngày này có khí tượng ổn định, thuận để động thổ và khởi công.',
      'Tam truyền sinh trợ, hợp làm việc liên quan nền móng và nhập trạch.',
      'Cục tượng cát, dễ gặp nhân lực hỗ trợ trong quá trình thi công.',
      'Ngày tốt cho việc mở đầu công trình và hoàn thiện hạng mục trọng yếu.',
    ],
    bad: [
      'Ngày có xung phá mạnh, không lợi cho động thổ hoặc sửa chữa lớn.',
      'Quẻ xuất hiện hung khí, dễ phát sinh trục trặc vật tư hoặc nhân công.',
      'Tam truyền bất ổn, nên tránh quyết định xây dựng quan trọng.',
      'Năng lượng ngày này dễ gây hao tổn, không phù hợp nhập trạch.',
    ],
  },
  'an-tang-than-su': {
    good: [
      'Ngày có khí tượng tĩnh hòa, phù hợp cho nghi lễ trang nghiêm.',
      'Tam truyền ổn định, thuận cho các việc cần sự thành kính và trật tự.',
      'Cục tượng thuận pháp, dễ an định tâm lý gia quyến.',
      'Ngày này hỗ trợ tốt cho nghi thức thần sự cần sự chuẩn mực.',
    ],
    bad: [
      'Quẻ có nhiều xung động, không phù hợp cho việc an táng hoặc thần sự.',
      'Hung thần nhập cục, dễ phát sinh bất an và sai sót nghi lễ.',
      'Khí vận tạp loạn, nên tránh tổ chức việc hệ trọng liên quan âm phần.',
      'Ngày này chủ nhiều trở ngại, cần cân nhắc dời lịch phù hợp hơn.',
    ],
  },
  'xay-bep-chuong-trai': {
    good: [
      'Ngày có cát khí, thuận để bố trí bếp và khu vực chăn nuôi.',
      'Tam truyền sinh trợ, phù hợp cải tạo không gian sinh hoạt phụ trợ.',
      'Cục tượng ổn định, thuận cho việc hoàn thiện hạ tầng gia dụng.',
      'Ngày này tốt cho việc chỉnh trang bếp núc và khu vực hậu cần.',
    ],
    bad: [
      'Ngày xuất hiện xung khí, dễ gây bất ổn khi sửa bếp hoặc chuồng trại.',
      'Quẻ bất lợi cho hạng mục liên quan hỏa khí và vệ sinh chuồng trại.',
      'Tam truyền suy, nên tránh khởi công các hạng mục phụ trợ.',
      'Khí vận ngày này không thuận, dễ phát sinh sửa đổi nhiều lần.',
    ],
  },
  'xuat-hanh': {
    good: [
      'Ngày này có Thiên Lộc, rất thuận lợi cho việc ký kết hợp đồng.',
      'Khí vận ổn định, xuất hành dễ gặp trợ lực từ quý nhân.',
      'Cục tượng hanh thông, phù hợp mở đầu công việc mới.',
      'Tam truyền sinh trợ, thuận cho di chuyển và mở rộng quan hệ.',
    ],
    bad: [
      'Quẻ xuất hiện Huyền Vũ, đề phòng mất mát hoặc lừa đảo tài chính.',
      'Khí tượng xung khắc, dễ phát sinh trở ngại trên đường đi.',
      'Tam truyền bất lợi, nên tránh việc quan trọng cần quyết đoán lớn.',
      'Ngày này chủ nhiều biến động, nên ưu tiên an toàn và chậm chắc.',
    ],
  },
  'ket-hon': {
    good: [
      'Ngày có cát khí hòa hợp, thuận cho việc cưới hỏi và kết ước.',
      'Tam truyền sáng sủa, hỗ trợ sự đồng thuận giữa hai gia đình.',
      'Cục tượng chủ hỷ, thích hợp tổ chức nghi lễ thành hôn.',
      'Ngày này tăng năng lượng hòa hợp, tốt cho việc lập gia đạo.',
    ],
    bad: [
      'Ngày mang tượng hình hại, không lợi cho việc kết hôn.',
      'Quẻ chủ bất hòa, dễ phát sinh tranh luận trong quá trình chuẩn bị.',
      'Tam truyền xung phá, nên tránh ký kết việc cưới hỏi quan trọng.',
      'Ngày này cát khí yếu, không phù hợp để tổ chức hỷ sự lớn.',
    ],
  },
  'khai-truong-khac': {
    good: [
      'Ngày có tài khí mở, thuận cho khai trương và công việc thương mại.',
      'Tam truyền vượng, thích hợp công bố sản phẩm và ký kết đối tác.',
      'Cục tượng cát, thuận lợi cho việc mở bán và truyền thông.',
      'Ngày này hỗ trợ tốt cho các quyết định kinh doanh quan trọng.',
    ],
    bad: [
      'Ngày có hao khí, không lợi cho khai trương hoặc mở rộng đầu tư.',
      'Quẻ xuất hiện trở lực, dễ hụt kỳ vọng doanh thu ban đầu.',
      'Tam truyền bất ổn, nên tránh công bố kế hoạch lớn.',
      'Ngày này dễ phát sinh sai lệch giấy tờ hoặc điều khoản giao dịch.',
    ],
  },
  'thi-dau': {
    good: [
      'Ngày có khí thế mạnh, phù hợp thi đấu và cạnh tranh thành tích.',
      'Tam truyền trợ lực, thuận cho việc bứt phá phong độ.',
      'Cục tượng vượng động, thích hợp tham gia thi cử hoặc tranh tài.',
      'Ngày này tăng khả năng tập trung và phản ứng nhanh.',
    ],
    bad: [
      'Ngày có tượng đối kháng bất lợi, cần tránh quyết định mạo hiểm.',
      'Quẻ suy, dễ mất bình tĩnh hoặc giảm hiệu suất thi đấu.',
      'Tam truyền nghịch, nên ưu tiên chuẩn bị hơn là tranh tài lớn.',
      'Ngày này chủ hao tổn thể lực và tinh thần, cần thận trọng.',
    ],
  },
};

