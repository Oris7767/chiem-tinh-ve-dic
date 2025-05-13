
import React from 'react';
import { getPlanetColor, getPlanetSymbol } from '@/utils/VedicAstro/Planets';
import { SIGN_COLORS, getSignSymbol } from '@/utils/VedicAstro/Signs';

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
}

interface SouthIndianChartProps {
  chartData: VedicChartData;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ chartData }) => {
  // Map planets to houses
  const planetsByHouse = chartData.houses.reduce((acc, _, index) => {
    const houseNumber = index + 1;
    acc[houseNumber] = chartData.planets.filter(planet => planet.house === houseNumber);
    return acc;
  }, {} as Record<number, Planet[]>);

  // Get sign for each house
  const houseToSign = chartData.houses.reduce((acc, house) => {
    acc[house.number] = house.sign;
    return acc;
  }, {} as Record<number, number>);

  // Zodiac sign abbreviations
  const signAbbreviations = [
    "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
    "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
  ];

  // Define the positions for the South Indian chart (4x4 grid with middle 4 cells removed)
  // This follows the provided pattern in the Python code
  const vedic_order_positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Map house numbers to positions in the chart (clockwise starting from house 1)
  const housePositions = Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    return {
      position: vedic_order_positions[i],
      houseNumber,
      sign: houseToSign[houseNumber] || 0,
      planets: planetsByHouse[houseNumber] || []
    };
  });

  // Check if a position is one of the center cells to be removed
  const isCenterCell = (row: number, col: number) => {
    return (row === 1 && col === 1) || 
           (row === 1 && col === 2) ||
           (row === 2 && col === 1) ||
           (row === 2 && col === 2);
  };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full border border-amber-200 rounded-lg"
      >
        {/* Draw the 4x4 grid with middle cells removed */}
        {Array.from({ length: 4 }, (_, row) => (
          Array.from({ length: 4 }, (_, col) => {
            // Skip center cells
            if (isCenterCell(row, col)) {
              return null;
            }
            
            // Find the house that corresponds to this position
            const houseData = housePositions.find(h => 
              h.position[0] === row && h.position[1] === col
            );
            
            if (!houseData) return null;
            
            const x = col * 100;
            const y = row * 100;
            
            return (
              <g key={`house-${houseData.houseNumber}`}>
                <rect
                  x={x}
                  y={y}
                  width={100}
                  height={100}
                  fill="none"
                  stroke="#B45309"
                  strokeWidth="1"
                />
                
                <text
                  x={x + 10}
                  y={y + 20}
                  fontSize="12"
                  fill="#B45309"
                >
                  {houseData.houseNumber} - {signAbbreviations[houseData.sign]}
                </text>
                
                <g>
                  {houseData.planets.map((planet, idx) => (
                    <text
                      key={planet.id}
                      x={x + 10}
                      y={y + 40 + idx * 14}
                      fontSize="12"
                      fill={getPlanetColor(planet.name)}
                    >
                      {getPlanetSymbol(planet.name)} {planet.retrograde ? 'ᴿ' : ''}
                    </text>
                  ))}
                </g>
              </g>
            );
          })
        ))}
        
        {/* Ascendant marker */}
        <text
          x={200}
          y={200}
          fontSize="16"
          fill="#B45309"
          textAnchor="middle"
          fontWeight="bold"
        >
          Lagna: {signAbbreviations[Math.floor(chartData.ascendant / 30)]}
        </text>
      </svg>
    </div>
  );
};

export default SouthIndianChart;
