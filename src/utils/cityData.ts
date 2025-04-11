// src/utils/cityData.ts

export interface City {
  name: string;
  latitude: number;
  longitude: number;
}

export const cities: City[] = [
  { name: "New York", latitude: 40.7128, longitude: -74.0060 },
  { name: "London", latitude: 51.5074, longitude: 0.1278 },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { name: "Delhi", latitude: 28.7041, longitude: 77.1025 },
  { name: "Sao Paulo", latitude: -23.5505, longitude: -46.6333 },
];