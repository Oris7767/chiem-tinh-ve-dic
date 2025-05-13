
import React from 'react';

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

  // Planet abbreviations
  const planetAbbreviations: Record<string, string> = {
    "su": "Su",
    "mo": "Mo",
    "me": "Me",
    "ve": "Ve",
    "ma": "Ma",
    "ju": "Ju",
    "sa": "Sa",
    "ra": "Ra",
    "ke": "Ke"
  };

  // Define the positions for the South Indian chart (4x4 grid with middle 4 cells removed)
  const vedic_order_positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Map house numbers to positions in the chart
  const housePositions = vedic_order_positions.map((pos, index) => {
    const houseNumber = (index + 1) % 12 || 12; // Houses are 1-12
    return {
      position: pos,
      houseNumber: houseNumber,
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
            
            // Find the house corresponding to this position
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
                
                <text
                  x={x + 10}
                  y={y + 50}
                  fontSize="10"
                  fill="#422006"
                >
                  {houseData.planets.map(planet => 
                    `${planetAbbreviations[planet.id]}${planet.retrograde ? 'ᴿ' : ''}`
                  ).join(' ')}
                </text>
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
        >
          Lagna: {signAbbreviations[Math.floor(chartData.ascendant / 30)]}
        </text>
      </svg>
    </div>
  );
};

export default SouthIndianChart;
