# Chức năng Tải Bản Đồ Sao Hoàn Chỉnh

## Tổng quan

Chức năng tải bản đồ sao đã được hoàn thiện để đóng gói tất cả thông tin quan trọng thành file SVG có thể tải về. Người dùng có thể chọn giữa 2 tùy chọn:

### 1. Tải file hoàn chỉnh (1 file SVG)
- **Kích thước**: 1200x1600 pixels
- **Nội dung bao gồm**:
  - Biểu đồ bản đồ sao (South Indian Chart)
  - Bảng chi tiết các hành tinh (Graha) với thông tin:
    - Tên hành tinh và ký hiệu
    - Tên Sanskrit
    - Cung hoàng đạo
    - Vị trí chính xác (độ, phút)
    - Nhà (Bhava)
    - Nakshatra và Pada
    - Trạng thái nghịch hành
  - Bảng chi tiết các nhà (Bhava) với thông tin:
    - Số nhà
    - Tên Sanskrit
    - Ý nghĩa của nhà
    - Cung hoàng đạo
    - Các hành tinh trong nhà
  - Thông tin Vimshottari Dasha:
    - Chu kỳ hiện tại với thời gian đã qua và còn lại
    - Trình tự các chu kỳ Dasha tiếp theo
  - Thông tin sinh (tên, ngày sinh, giờ sinh, địa điểm)
  - Footer với ngày tạo file

### 2. Tải file riêng biệt (2 file SVG)
- **File 1 - Bản đồ sao**: 600x600 pixels
  - Chỉ chứa biểu đồ South Indian Chart
  - Thông tin sinh cơ bản
- **File 2 - Thông tin chi tiết**: 1200x1000 pixels
  - Bảng chi tiết hành tinh
  - Bảng chi tiết các nhà
  - Thông tin Vimshottari Dasha

## Cách sử dụng

1. Tạo bản đồ sao bằng cách nhập thông tin sinh
2. Sau khi bản đồ được tạo, click vào nút "Tải bản đồ"
3. Chọn một trong hai tùy chọn:
   - "Tải file hoàn chỉnh (1 file SVG)" - cho file tổng hợp
   - "Tải file riêng biệt (2 file SVG)" - cho 2 file tách biệt

## Định dạng file

- **Định dạng**: SVG (Scalable Vector Graphics)
- **Ưu điểm**:
  - Có thể phóng to/thu nhỏ không mất chất lượng
  - Kích thước file nhỏ
  - Có thể mở bằng trình duyệt web
  - Có thể chuyển đổi sang PNG/PDF bằng các công cụ online
  - Có thể in với chất lượng cao

## Tên file

### File hoàn chỉnh:
- Có tên: `vedic-chart-complete-[tên]-[ngày-sinh].svg`
- Ví dụ: `vedic-chart-complete-Nguyen-Van-A-1990-01-01.svg`

### File riêng biệt:
- Bản đồ: `vedic-chart-[tên]-[ngày-sinh]-chart.svg`
- Chi tiết: `vedic-chart-[tên]-[ngày-sinh]-details.svg`

## Thông tin kỹ thuật

### Fonts và Styling
- Font chính: Arial, sans-serif
- Màu chủ đạo: #B45309 (màu vàng nâu)
- Background: Trắng với viền xám nhạt
- Tables có alternating row colors để dễ đọc

### Cấu trúc SVG
- Sử dụng CSS embedded trong SVG
- Responsive design với viewBox
- Structured layout với groups (g elements)
- Proper text positioning và alignment

## Xử lý lỗi

- Nếu chức năng hoàn chỉnh gặp lỗi, hệ thống sẽ fallback về chức năng tải cơ bản
- Toast notifications thông báo trạng thái tải xuống
- Error handling cho các trường hợp không có dữ liệu

## Tương lai

Chức năng có thể được mở rộng để:
- Thêm các định dạng export khác (PNG, PDF)
- Tùy chỉnh layout và styling
- Thêm thông tin bổ sung (aspects, transits)
- Multi-language support
- Batch export cho nhiều charts 