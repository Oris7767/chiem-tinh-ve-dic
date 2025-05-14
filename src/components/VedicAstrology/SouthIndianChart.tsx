
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
  // In South Indian style, Aries is fixed at the top second position
  const vedic_order_positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Map zodiac signs to fixed positions in the chart
  // Starting with Aries at the second position from the left in the top row
  const signPositions = Array.from({ length: 12 }, (_, i) => {
    const signIndex = i; // 0 = Aries, 1 = Taurus, etc.
    const position = vedic_order_positions[i];
    return {
      position,
      signIndex,
      planets: chartData.planets.filter(planet => planet.sign === signIndex)
    };
  });

  // Calculate house numbers based on the ascendant
  // The house number 1 is where the ascendant falls
  const ascSign = Math.floor(chartData.ascendant / 30);
  
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
            
            // Find the position in the vedic order
            const positionIndex = vedic_order_positions.findIndex(p => 
              p[0] === row && p[1] === col
            );
            
            if (positionIndex === -1) return null;
            
            // Get the sign for this position
            const signIndex = positionIndex; // In South Indian chart, signs are fixed
            
            // Calculate house number based on ascendant
            const houseNumber = ((signIndex - ascSign + 12) % 12) + 1;
            
            // Get planets in this house
            const planetsInHouse = planetsByHouse[houseNumber] || [];
            
            const x = col * 100;
            const y = row * 100;
            
            return (
              <g key={`cell-${row}-${col}`}>
                <rect
                  x={x}
                  y={y}
                  width={100}
                  height={100}
                  fill="none"
                  stroke="#B45309"
                  strokeWidth="1"
                />
                
                {/* Show sign and house number */}
                <text
                  x={x + 10}
                  y={y + 20}
                  fontSize="12"
                  fill="#B45309"
                >
                  {signAbbreviations[signIndex]} - {houseNumber}
                </text>
                
                {/* Display planets in this house */}
                <g>
                  {planetsInHouse.map((planet, idx) => (
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
        
        {/* Ascendant marker in the center */}
        <text
          x={200}
          y={200}
          fontSize="16"
          fill="#B45309"
          textAnchor="middle"
          fontWeight="bold"
        >
          Lagna: {signAbbreviations[ascSign]}
        </text>
      </svg>
    </div>
  );
};

export default SouthIndianChart;
