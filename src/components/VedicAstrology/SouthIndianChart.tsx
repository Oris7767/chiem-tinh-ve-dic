
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
  const planetsByHouse = chartData.planets.reduce((acc, planet) => {
    const houseNumber = planet.house;
    if (!acc[houseNumber]) {
      acc[houseNumber] = [];
    }
    acc[houseNumber].push(planet);
    return acc;
  }, {} as Record<number, Planet[]>);

  // Get sign for each house
  const houseToSign = chartData.houses.reduce((acc, house) => {
    acc[house.number] = house.sign;
    return acc;
  }, {} as Record<number, number>);

  // Shortened sign abbreviations (3 characters)
  const shortSignAbbr = [
    "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
    "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
  ];

  // Planet abbreviations
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
      "Ketu": "Ke"
    };
    return map[name] || name.substring(0, 2);
  };

  // Determine the ascendant sign
  const ascSign = Math.floor(chartData.ascendant / 30);
  
  // In South Indian Chart, the houses are fixed at specific positions (4x4 grid with middle cells removed)
  // We need to map each house to the correct position based on the ascendant
  const positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Calculate which house goes where based on the ascendant
  // In South Indian chart, the 1st house (where ascendant is) is always at the same position
  // but we need to adjust which houses show in each position
  const getHouseNumber = (posIndex: number) => {
    // House 1 is at positions[0], where ascendant falls
    return ((posIndex + 1) % 12) || 12;
  };

  // Check if a position is one of the center cells to be removed
  const isCenterCell = (row: number, col: number) => {
    return (row === 1 && col === 1) || 
           (row === 1 && col === 2) ||
           (row === 2 && col === 1) ||
           (row === 2 && col === 2);
  };

  // Calculate degrees within sign (0-29.99)
  const getDegreesInSign = (longitude: number) => {
    return (longitude % 30).toFixed(2);
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
            
            // Find the position in the chart order
            const positionIndex = positions.findIndex(p => 
              p[0] === row && p[1] === col
            );
            
            if (positionIndex === -1) return null;
            
            // Calculate house number for this position
            const houseNumber = getHouseNumber(positionIndex);
            
            // Get sign for this house
            const signIndex = (positionIndex + ascSign) % 12;
            
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
                
                {/* Show sign abbreviation and house number */}
                <text
                  x={x + 10}
                  y={y + 20}
                  fontSize="12"
                  fill="#B45309"
                  fontWeight="bold"
                >
                  {shortSignAbbr[signIndex]} {houseNumber}
                  {houseNumber === 1 && " ⬆"} {/* Special symbol for ascendant */}
                </text>
                
                {/* Display planets in this house */}
                <g>
                  {planetsInHouse.map((planet, idx) => (
                    <text
                      key={planet.id}
                      x={x + 10}
                      y={y + 40 + idx * 14}
                      fontSize="12"
                      fill="#000000" // Changed to black for all planets
                    >
                      {getPlanetAbbr(planet.name)} {getDegreesInSign(planet.longitude)}°
                      {planet.retrograde ? 'ᴿ' : ''}
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
          Asc: {shortSignAbbr[ascSign]} {getDegreesInSign(chartData.ascendant)}°
        </text>
      </svg>
    </div>
  );
};

export default SouthIndianChart;
