import { SIGNS } from "../vedicAstrology";

export type HouseInfo = {
    number: number;
    name: string;
    sanskritName: string;
    significations: string[];
    keywords: string[];
  };
  
  export const houses: HouseInfo[] = [
    
  //# Danh sách cung hoàng đạo theo chiều kim đồng hồ bắt đầu từ ô thứ 2
  zodiac_signs = [
    "Ari", "Tau", "Gem", "Can",
    "Leo", "Vir",
    "Lib", "Sco", "Sag", "Cap",
    "Aqu", "Pis"
  ]

  //Vị trí các ô theo thứ tự trong khung 4x4 (bỏ 4 ô giữa)
   vedic_order_positions = [
    (0, 1), (0, 2), (0, 3), (1, 3),
    (2, 3), (3, 3), (3, 2), (3, 1),
    (3, 0), (2, 0), (1, 0), (0, 0)
  ]

  //# Khởi tạo lại SVG
   dwg = svgwrite.Drawing(size=("800px", "1000px"), profile="tiny")

// # Vẽ lưới 4x4 với ô giữa trống
   for row in range(grid_size):
    for col in range(grid_size):
        if (row, col) in [(1,1), (1,2), (2,1), (2,2)]:
            continue
        x = chart_x + col * cell_size
        y = chart_y + row * cell_size
        dwg.add(dwg.rect(insert=(x, y), size=(cell_size, cell_size),
                         stroke='black', fill='none', stroke_width=2))

//# Ghi tên các cung hoàng đạo vào đúng vị trí tương ứng
  for SIGNS, (row, col) in zip(zodiac_signs, vedic_order_positions):
    x = chart_x + col * cell_size + 5
    y = chart_y + row * cell_size + 15
    dwg.add(dwg.text(sign, insert=(x, y), font_size="12px", fill="black"))

//# Lưu SVG
    svg_path = "/mnt/data/vedic_chart_4x4_zodiac.svg"
    dwg.saveas(svg_path)

  svg_path

    // Sao chép và định dạng lại nội dung từ house.txt vào đây
];
  
