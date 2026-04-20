import React, { useMemo } from 'react';
import MiniSouthIndianChart from './MiniSouthIndianChart';
import { calculateAllVargas, PlanetInput } from '@/utils/vargaCalculations';

interface Planet {
  id: string;
  name: string;
  longitude: number;
  house: number;
  sign: number;
  retrograde: boolean;
}

interface House {
  number: number;
  longitude: number;
  sign: number;
}

interface VedicChartData {
  ascendant: number | { longitude: number; nakshatra?: { name: string; lord: string; startDegree: number; endDegree: number; pada: number } };
  ascendantNakshatra?: NakshatraInfo;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
}

interface VargasChartsProps {
  chartData: VedicChartData;
}

// 16 Vargas tiêu chuẩn trong chiêm tinh Vệ Đà
const VARGAS_DATA = [
  { id: 'D1', name: 'Rasi (Bản thể)', key: 'D1' as const },
  { id: 'D2', name: 'Hora (Tài lộc)', key: 'D2' as const },
  { id: 'D3', name: 'Drekkana (An bạn)', key: 'D3' as const },
  { id: 'D4', name: 'Chaturamsa (May mắn)', key: 'D4' as const },
  { id: 'D7', name: 'Saptamsa (Con cái)', key: 'D7' as const },
  { id: 'D9', name: 'Navamsa (Hôn nhân)', key: 'D9' as const },
  { id: 'D10', name: 'Dasamsa (Sự nghiệp)', key: 'D10' as const },
  { id: 'D12', name: 'Dwadamsa (Cha mẹ)', key: 'D12' as const },
  { id: 'D16', name: 'Shodasamsa (Phúc lộc)', key: 'D16' as const },
  { id: 'D20', name: 'Vimsamsa (Đạo đức)', key: 'D20' as const },
  { id: 'D24', name: 'Siddhamsa (Học vấn)', key: 'D24' as const },
  { id: 'D27', name: 'Nakshatramsa (Năng lực)', key: 'D27' as const },
  { id: 'D30', name: 'Trimsamsa (Karma)', key: 'D30' as const },
  { id: 'D40', name: 'Khavedamsa (An khang)', key: 'D40' as const },
  { id: 'D45', name: 'Akshvedamsa (Tổng thể)', key: 'D45' as const },
];

const VargasCharts: React.FC<VargasChartsProps> = ({ chartData }) => {
  // Trích xuất ascendant longitude từ API response
  // API có thể trả về: number hoặc { longitude: number, nakshatra: {...} }
  const ascendantLongitude = typeof chartData.ascendant === 'number' 
    ? chartData.ascendant 
    : (chartData.ascendant as any).longitude;

  // Tính toán tất cả Vargas từ D1 data
  const vargaCharts = useMemo(() => {
    // Chuyển đổi planets từ D1 sang format PlanetInput
    const planetsInput: PlanetInput[] = chartData.planets.map(planet => ({
      id: planet.id,
      name: planet.name,
      longitude: planet.longitude,
      house: planet.house,
      sign: planet.sign,
      retrograde: planet.retrograde,
    }));

    // Tính toán tất cả Vargas
    return calculateAllVargas(planetsInput, ascendantLongitude);
  }, [chartData, ascendantLongitude]);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-votive-red">16 Bản đồ sao phụ (Vargas)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Các divisional charts theo hệ thống Vimshottari Dasa
        </p>
      </div>
      
      {/* Grid layout: 4 columns desktop, 3 tablet, 2 mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {VARGAS_DATA.map((varga) => {
          const vargaData = vargaCharts[varga.key];
          
          return (
            <div 
              key={varga.id}
              className="bg-white rounded-lg border border-votive-border p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <MiniSouthIndianChart
                chartData={chartData}
                vargaPlanets={vargaData.planets}
                vargaAscendantSign={vargaData.ascendantSign}
                title={`${varga.id} - ${varga.name}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VargasCharts;
