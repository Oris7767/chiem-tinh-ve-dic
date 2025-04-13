export interface City {
  name: string;
  vietnameseName: string;
  latitude: number;
  longitude: number;
}

export const cities: City[] = [
  { name: 'Hanoi', vietnameseName: 'Hà Nội', latitude: 21.0285, longitude: 105.8542 },
  { name: 'Ho Chi Minh City', vietnameseName: 'TP. Hồ Chí Minh', latitude: 10.7769, longitude: 106.7009 },
  { name: 'Da Nang', vietnameseName: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022 },
  { name: 'Hai Phong', vietnameseName: 'Hải Phòng', latitude: 20.8449, longitude: 106.6881 },
  { name: 'Can Tho', vietnameseName: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469 },
  { name: 'Hue', vietnameseName: 'Huế', latitude: 16.4667, longitude: 107.5792 },
  { name: 'Nha Trang', vietnameseName: 'Nha Trang', latitude: 12.2388, longitude: 109.1967 },
  // Optional international cities
  { name: 'Delhi', vietnameseName: 'Delhi (Ấn Độ)', latitude: 28.7041, longitude: 77.1025 },
  { name: 'Bangkok', vietnameseName: 'Bangkok (Thái Lan)', latitude: 13.7563, longitude: 100.5018 },
  { name: 'Singapore', vietnameseName: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
];