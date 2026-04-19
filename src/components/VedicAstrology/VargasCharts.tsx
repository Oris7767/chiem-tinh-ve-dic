import React from 'react';
import MiniSouthIndianChart from './MiniSouthIndianChart';

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
  ascendant: number;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
}

interface VargasChartsProps {
  chartData: VedicChartData;
}

const VARGAS_DATA = [
  { id: 'D1', name: 'Rasi (Bản thể)', division: 1 },
  { id: 'D2', name: 'Hora (Tài lộc)', division: 2 },
  { id: 'D3', name: 'Drekkana (An bạn)', division: 3 },
  { id: 'D4', name: 'Chaturthamsa (Nhà cửa)', division: 4 },
  { id: 'D5', name: 'Panchamsa (Sự phát triển)', division: 5 },
  { id: 'D6', name: 'Shashtamsa (Sức khỏe)', division: 6 },
  { id: 'D7', name: 'Saptamsa (Con cái)', division: 7 },
  { id: 'D8', name: 'Ashtamsa (Tuổi thọ)', division: 8 },
  { id: 'D9', name: 'Navamsa (Hôn nhân/Tiềm năng)', division: 9 },
  { id: 'D10', name: 'Dasamsa (Sự nghiệp)', division: 10 },
  { id: 'D11', name: 'Rudhamsa (Thu nhập)', division: 11 },
  { id: 'D12', name: 'Dwadamsa (Cha mẹ)', division: 12 },
  { id: 'D16', name: 'Shodasamsa (Phương tiện)', division: 16 },
  { id: 'D20', name: 'Vimsamsa (Sự tu tập)', division: 20 },
  { id: 'D24', name: 'Chaturvimsamsa (Học vấn)', division: 24 },
  { id: 'D27', name: 'Saptavimsamsa (Điểm mạnh)', division: 27 },
];

const VargasCharts: React.FC<VargasChartsProps> = ({ chartData }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-votive-red">16 Bản đồ sao phụ (Vargas)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Các divisional charts theo hệ thống Vimshottari
        </p>
      </div>
      
      {/* Grid layout: 4 columns desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
        {VARGAS_DATA.map((varga) => (
          <div 
            key={varga.id}
            className="bg-white rounded-lg border border-votive-border p-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <MiniSouthIndianChart
              chartData={chartData}
              title={`${varga.id} - ${varga.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VargasCharts;
