
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

  // Positions for South Indian chart layout (12 houses in a 4x3 grid, with houses in counterclockwise order)
  const gridPositions = [
    [1, 2, 3],
    [12, null, 4],
    [11, 10, 9],
    [8, 7, 6]
  ];

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full border border-amber-200 rounded-lg"
      >
        {/* Draw the grid */}
        {gridPositions.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((houseNumber, colIndex) => {
              if (houseNumber === null) {
                // Center box (empty)
                return null;
              }
              
              const x = colIndex * 100;
              const y = rowIndex * 100;
              const sign = houseToSign[houseNumber];
              const planets = planetsByHouse[houseNumber] || [];
              
              return (
                <g key={`house-${houseNumber}`}>
                  {/* House box */}
                  <rect
                    x={colIndex * 133.33}
                    y={rowIndex * 100}
                    width={133.33}
                    height={100}
                    fill="none"
                    stroke="#B45309"
                    strokeWidth="1"
                  />
                  
                  {/* House number and sign */}
                  <text
                    x={colIndex * 133.33 + 15}
                    y={rowIndex * 100 + 20}
                    fontSize="14"
                    fill="#B45309"
                  >
                    {houseNumber} - {signAbbreviations[sign]}
                  </text>
                  
                  {/* Planets in the house */}
                  <text
                    x={colIndex * 133.33 + 15}
                    y={rowIndex * 100 + 50}
                    fontSize="12"
                    fill="#422006"
                  >
                    {planets.map(planet => 
                      `${planetAbbreviations[planet.id]}${planet.retrograde ? 'ᴿ' : ''}`
                    ).join(' ')}
                  </text>
                </g>
              );
            })}
          </React.Fragment>
        ))}
        
        {/* Center box */}
        <rect
          x={133.33}
          y={100}
          width={133.33}
          height={200}
          fill="none"
          stroke="#B45309"
          strokeWidth="1"
        />
        
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
