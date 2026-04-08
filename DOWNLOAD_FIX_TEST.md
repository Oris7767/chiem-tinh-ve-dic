# Download Fix Test Guide

## Các cải tiến mới đã thực hiện:

### 1. Sửa SVG Dimensions
- Thêm `width="500"` và `height="500"` vào SVG element
- Đảm bảo SVG có kích thước cụ thể thay vì chỉ dựa vào CSS

### 2. Cải thiện SVG Cloning
- Set explicit dimensions cho cloned SVG
- Thêm `viewBox`, `width`, `height` attributes
- Thêm inline styles: `width`, `height`, `backgroundColor`
- Log attributes của cloned SVG để debug

### 3. Cải thiện html2canvas Configuration
- Thêm `onclone` callback để đảm bảo SVG được styled đúng
- Force set width/height cho tất cả SVG elements trong cloned document

### 4. Thêm Canvas Content Detection
- Kiểm tra canvas có nội dung thực sự không (không chỉ trắng)
- Log canvas dimensions và dataURL preview
- Detect nếu canvas chỉ có màu trắng/transparent

## Test Steps:

### Test 1: Kiểm tra Console Logs
1. Mở Developer Tools (F12)
2. Tạo birth chart
3. Click "Download PNG"
4. Kiểm tra console logs:

**Expected logs:**
```
Starting PNG download with chart data: [Object]
SVG Debug Info:
- Children count: 3
- ViewBox: 0 0 500 500
- Width: 500
- Height: 500
- InnerHTML length: [number]
- First child: rect
- Last child: g
SVG rendered successfully: 500x500, children: 3
Cloned SVG attributes: {width: "500", height: "500", viewBox: "0 0 500 500", children: 3}
SVG chart cloned successfully for PNG export
Cloned document prepared with [number] SVG elements
Canvas created: {width: 1800, height: [number], dataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB..."}
Canvas has visible content: true
PNG file downloaded successfully: [filename], size: [bytes] bytes
```

### Test 2: Kiểm tra File Content
1. Mở file PNG đã tải về
2. Verify file có nội dung:
   - Background màu vàng nhạt (#fef7cd)
   - Biểu đồ sao ở giữa
   - Bảng thông tin hành tinh
   - Bảng thông tin nhà
   - Header với tên và thông tin sinh

### Test 3: Troubleshooting
Nếu vẫn có vấn đề, kiểm tra:

**A. SVG không render:**
- `Width: null` hoặc `Height: null` → SVG chưa có dimensions
- `Children count: 0` → SVG chưa có nội dung
- `SVG rendered successfully: 0x0` → SVG chưa được render

**B. Canvas trống:**
- `Canvas has visible content: false` → html2canvas không capture được SVG
- `dataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="` → Canvas chỉ có 1 pixel trắng

**C. File size nhỏ:**
- File < 10KB → Có thể chỉ có background
- File > 100KB → Có nội dung đầy đủ

## Next Steps nếu vẫn lỗi:

1. **Kiểm tra SVG rendering timing:**
   - Thêm delay lâu hơn
   - Kiểm tra SVG có được mount đúng không

2. **Alternative approach:**
   - Sử dụng SVG to Canvas conversion trực tiếp
   - Implement custom SVG renderer

3. **Browser compatibility:**
   - Test trên browser khác
   - Kiểm tra html2canvas version 