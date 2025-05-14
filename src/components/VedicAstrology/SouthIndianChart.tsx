
import React from 'react';
import { PLANETS, getPlanetColor, getPlanetSymbol } from '@/utils/VedicAstro/Planets';
import { SIGNS, getSignColor } from '@/utils/VedicAstro/Signs';

interface Planet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  house: number;
  sign: number;
  retrograde: boolean;
  color: string;
}

interface House {
  number: number;
  longitude: number;
  sign: number;
}

interface ChartData {
  ascendant: number;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
}

interface SouthIndianChartProps {
  chartData: ChartData;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ chartData }) => {
  // Tìm nhà số 1 (ascendant house)
  const ascendantHouse = 1;
  const ascendantSign = Math.floor(chartData.ascendant / 30);
  
  // Vị trí của các ô trong ma trận 4x4 (bỏ 4 ô giữa)
  const positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];
  
  // Ánh xạ từ số cung (house number) sang vị trí trong ma trận 4x4
  const getPositionFromHouseNumber = (house: number) => {
    const index = (house - 1);
    return index >= 0 && index < 12 ? positions[index] : null;
  };
  
  // Tìm các hành tinh trong một cung
  const getPlanetsInHouse = (house: number) => {
    return chartData.planets.filter(planet => planet.house === house);
  };

  // Generate chart grid
  const renderGrid = () => {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Drawing the 4x4 grid (without the center) */}
        {/* Outer square */}
        <rect x="0" y="0" width="400" height="400" fill="none" stroke="#996515" strokeWidth="2" />
        
        {/* Horizontal lines */}
        <line x1="0" y1="100" x2="400" y2="100" stroke="#996515" strokeWidth="1" />
        <line x1="0" y1="300" x2="400" y2="300" stroke="#996515" strokeWidth="1" />
        
        {/* Vertical lines */}
        <line x1="100" y1="0" x2="100" y2="400" stroke="#996515" strokeWidth="1" />
        <line x1="300" y1="0" x2="300" y2="400" stroke="#996515" strokeWidth="1" />
        
        {/* Center square (invisible) */}
        <rect x="100" y="100" width="200" height="200" fill="none" stroke="none" />
        
        {/* Signs - Following Vedic order starting from ascendant */}
        {Array.from({ length: 12 }, (_, i) => {
          const houseNumber = ((i - 1 + 12) % 12) + 1;
          const signIndex = (ascendantSign + i) % 12;
          const signNames = [
            "Ari", "Tau", "Gem", "Can", "Leo", "Vir", 
            "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
          ];
          
          // Calculate positions
          let x, y;
          
          if (i === 0) { x = 10; y = 115; }      // House 1
          else if (i === 1) { x = 10; y = 215; } // House 2
          else if (i === 2) { x = 10; y = 315; } // House 3
          else if (i === 3) { x = 110; y = 315; }// House 4
          else if (i === 4) { x = 210; y = 315; }// House 5
          else if (i === 5) { x = 310; y = 315; }// House 6
          else if (i === 6) { x = 310; y = 215; }// House 7
          else if (i === 7) { x = 310; y = 115; }// House 8
          else if (i === 8) { x = 310; y = 15; } // House 9
          else if (i === 9) { x = 210; y = 15; } // House 10
          else if (i === 10) { x = 110; y = 15; }// House 11
          else { x = 10; y = 15; }               // House 12
          
          return (
            <g key={i}>
              <text x={x} y={y} fill="#996515" fontWeight="bold">
                {signNames[signIndex]} {i === 0 ? "(Asc)" : ""}
              </text>
              
              {/* Planets in this house */}
              {getPlanetsInHouse(houseNumber).map((planet, pIndex) => {
                return (
                  <text 
                    key={planet.id} 
                    x={x} 
                    y={y + 20 + (pIndex * 20)}
                    fill={planet.color}
                    fontWeight="bold"
                  >
                    {planet.symbol} {planet.retrograde ? "R" : ""}
                  </text>
                );
              })}
            </g>
          );
        })}
        
        {/* Center text */}
        <text x="200" y="200" textAnchor="middle" fill="#996515" fontSize="16">
          Vedic Chart
        </text>
        <text x="200" y="220" textAnchor="middle" fill="#996515" fontSize="14">
          Asc: {Math.floor(chartData.ascendant).toFixed(1)}°
        </text>
      </svg>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto aspect-square">
      {renderGrid()}
    </div>
  );
};

export default SouthIndianChart;
