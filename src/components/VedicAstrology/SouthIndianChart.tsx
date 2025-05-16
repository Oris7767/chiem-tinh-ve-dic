
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

  // Determine the ascendant sign and house
  const ascSign = Math.floor(chartData.ascendant / 30);
  const ascHouse = 1; // The ascendant is always in the 1st house
  
  // In South Indian Chart, the signs are fixed, houses move based on the ascendant
  // The positions in a 4x4 grid (with middle removed)
  const positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Calculate which house goes in each position
  const getHouseNumber = (signIndex: number) => {
    // Find the distance from this sign to the ascendant sign
    const distance = (signIndex - ascSign + 12) % 12;
    // House 1 is always where ascendant is
    return ((distance + 1) % 12) || 12;
  };

  // Check if a position is one of the center cells
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
        {Array.from({ length: 12 }, (_, index) => {
          const signIndex = index;
          const [row, col] = positions[index];
          const houseNumber = getHouseNumber(signIndex);
          
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
              
              {/* Show fixed sign abbreviation and moving house number */}
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
                    fill="#000000"
                  >
                    {getPlanetAbbr(planet.name)} {getDegreesInSign(planet.longitude)}°
                    {planet.retrograde ? 'ᴿ' : ''}
                  </text>
                ))}
              </g>
            </g>
          );
        })}
        
        {/* Logo in the center */}
        <image 
          href="/lovable-uploads/caad05e4-b4c3-4988-9357-3e27463a7041.png" 
          x="150" 
          y="150" 
          width="100" 
          height="100"
        />
      </svg>
    </div>
  );
};

export default SouthIndianChart;
