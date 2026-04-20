import React, { useMemo, useState, useEffect } from 'react';
import MiniSouthIndianChart from './MiniSouthIndianChart';
import { calculateAllVargas, PlanetInput, VargaChartData } from '@/utils/vargaCalculations';
import { LOGO_DATA_URL } from '@/utils/logoDataUrl';

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

interface SelectedVarga {
  key: string;
  title: string;
  data: VargaChartData;
}

// 16 Vargas tiêu chuẩn trong chiêm tinh Vệ Đà
const VARGAS_DATA = [
  { id: 'D1', name: 'Rasi', key: 'D1' as const },
  { id: 'D2', name: 'Hora', key: 'D2' as const },
  { id: 'D3', name: 'Drekkana', key: 'D3' as const },
  { id: 'D4', name: 'Chaturamsa', key: 'D4' as const },
  { id: 'D7', name: 'Saptamsa', key: 'D7' as const },
  { id: 'D9', name: 'Navamsa', key: 'D9' as const },
  { id: 'D10', name: 'Dasamsa', key: 'D10' as const },
  { id: 'D12', name: 'Dwadamsa', key: 'D12' as const },
  { id: 'D16', name: 'Shodasamsa', key: 'D16' as const },
  { id: 'D20', name: 'Vimsamsa', key: 'D20' as const },
  { id: 'D24', name: 'Siddhamsa', key: 'D24' as const },
  { id: 'D27', name: 'Nakshatramsa', key: 'D27' as const },
  { id: 'D30', name: 'Trimsamsa', key: 'D30' as const },
  { id: 'D40', name: 'Khavedamsa', key: 'D40' as const },
  { id: 'D45', name: 'Akshvedamsa', key: 'D45' as const },
];

// Large chart component for Modal
const LargeSouthIndianChart: React.FC<{
  vargaData: VargaChartData;
}> = ({ vargaData }) => {
  const shortSignAbbr = [
    "Ar", "Ta", "Ge", "Ca", "Le", "Vi",
    "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
  ];

  const getPlanetAbbr = (name: string) => {
    const map: Record<string, string> = {
      "Sun": "Su",
      "Moon": "Mo",
      "Mercury": "Me",
      "Venus": "Ve",
      "Mars": "Ma",
      "Jupiter": "Ju",
      "Saturn": "Sa",
      "Rahu": "Ra",
      "Ketu": "Ke",
      "Uranus": "Ur",
      "Neptune": "Ne",
      "Pluto": "Pl"
    };
    return map[name] || name.substring(0, 2);
  };

  const formatDegree = (degree: number) => {
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    return `${deg}°${min.toString().padStart(2, '0')}'`;
  };

  // Map planets to houses
  const planetsByHouse = vargaData.planets.reduce((acc, planet) => {
    const houseNumber = planet.house;
    if (!acc[houseNumber]) {
      acc[houseNumber] = [];
    }
    acc[houseNumber].push(planet);
    return acc;
  }, {} as Record<number, typeof vargaData.planets>);

  const positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  const getHouseNumber = (signIndex: number) => {
    const distance = (signIndex - vargaData.ascendantSign + 12) % 12;
    return ((distance + 1) % 12) || 12;
  };

  return (
    <svg
      viewBox="0 0 500 500"
      className="w-full h-full"
    >
      <rect x="0" y="0" width="500" height="500" fill="white" />
      
      <g transform="translate(50, 70)">
        {Array.from({ length: 12 }, (_, index) => {
          const signIndex = index;
          const [row, col] = positions[index];
          const houseNumber = getHouseNumber(signIndex);
          const isAscendant = houseNumber === 1;
          const planetsInHouse = planetsByHouse[houseNumber] || [];
          
          const x = col * 100;
          const y = row * 100;
          
          // Build render items list: ASC first, then planets
          const renderItems: Array<{ id: string; label: string; color: string; subLabel?: string }> = [];
          
          if (isAscendant) {
            renderItems.push({
              id: 'asc',
              label: 'ASC',
              color: '#B45309',
            });
          }
          
          planetsInHouse.slice(0, 3).forEach(planet => {
            renderItems.push({
              id: planet.id,
              label: `${getPlanetAbbr(planet.name)}${planet.retrograde ? 'ᴿ' : ''}`,
              color: '#000000',
              subLabel: formatDegree(planet.vargaDegree),
            });
          });
          
          return (
            <g key={`cell-${row}-${col}`}>
              <rect
                x={x}
                y={y}
                width={100}
                height={100}
                fill="none"
                stroke="#B45309"
                strokeWidth="1.5"
              />
              
              <text
                x={x + 5}
                y={y + 18}
                fontSize="12"
                fill="#B45309"
                fontWeight="bold"
              >
                {shortSignAbbr[signIndex]} {houseNumber}
              </text>
              
              <g>
                {renderItems.map((item, idx) => (
                  <text
                    key={item.id}
                    x={x + 5}
                    y={y + 40 + idx * 14}
                    fontSize="10"
                    fontWeight="bold"
                    fill={item.color}
                  >
                    {item.label}
                    {item.subLabel && (
                      <tspan fontSize="8" fontWeight="normal" fill="#666">
                        {' '}{item.subLabel}
                      </tspan>
                    )}
                  </text>
                ))}
              </g>
            </g>
          );
        })}
        
        {/* Center logo */}
        <image href={LOGO_DATA_URL} x="150" y="150" width="100" height="100" />
      </g>
    </svg>
  );
};

// Component cho Modal hiển thị lá số phóng to
const VargaModal: React.FC<{
  varga: SelectedVarga;
  onClose: () => void;
}> = ({ varga, onClose }) => {
  // Đóng modal khi nhấn Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    // Khóa scroll body khi modal mở
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-votive-bg rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-votive-border/50 hover:bg-votive-red/20 text-votive-muted hover:text-votive-red transition-colors"
          aria-label="Đóng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header */}
        <div className="pt-6 pb-2 px-4 text-center border-b border-votive-border/30">
          <h2 className="text-2xl font-bold text-votive-red">
            {varga.title}
          </h2>
        </div>

        {/* Nội dung - Chart SVG */}
        <div className="p-4 md:p-6">
          <div className="w-full h-auto aspect-square max-w-[500px] mx-auto">
            <LargeSouthIndianChart vargaData={varga.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

const VargasCharts: React.FC<VargasChartsProps> = ({ chartData }) => {
  // State quản lý lá số được chọn để phóng to
  const [selectedVarga, setSelectedVarga] = useState<SelectedVarga | null>(null);

  // Trích xuất ascendant longitude từ API response
  const ascendantLongitude = typeof chartData.ascendant === 'number' 
    ? chartData.ascendant 
    : (chartData.ascendant as any).longitude;

  // Tính toán tất cả Vargas từ D1 data
  const vargaCharts = useMemo(() => {
    const planetsInput: PlanetInput[] = chartData.planets.map(planet => ({
      id: planet.id,
      name: planet.name,
      longitude: planet.longitude,
      house: planet.house,
      sign: planet.sign,
      retrograde: planet.retrograde,
    }));

    return calculateAllVargas(planetsInput, ascendantLongitude);
  }, [chartData, ascendantLongitude]);

  const handleVargaClick = (varga: typeof VARGAS_DATA[0]) => {
    const vargaData = vargaCharts[varga.key];
    setSelectedVarga({
      key: varga.key,
      title: `${varga.id} - ${varga.name}`,
      data: vargaData,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-votive-red">16 Bản đồ sao phụ (Vargas)</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Các divisional charts theo hệ thống Parashara. Click vào lá số để phóng to.
        </p>
      </div>
      
      {/* Grid layout: 4 columns desktop, 3 tablet, 2 mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {VARGAS_DATA.map((varga) => {
          const vargaData = vargaCharts[varga.key];
          
          return (
            <div 
              key={varga.id}
              className="bg-white rounded-lg border border-votive-border p-3 shadow-sm cursor-pointer hover:shadow-lg hover:border-votive-red/50 transition-all duration-200"
              onClick={() => handleVargaClick(varga)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleVargaClick(varga);
                }
              }}
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

      {/* Modal hiển thị lá số phóng to */}
      {selectedVarga && (
        <VargaModal 
          varga={selectedVarga} 
          onClose={() => setSelectedVarga(null)} 
        />
      )}
    </div>
  );
};

export default VargasCharts;
