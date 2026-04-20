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
  lunarDay: number;
}

// Props cho MiniSouthIndianChart
interface MiniSouthIndianChartProps {
  // Dữ liệu gốc từ D1
  chartData: VedicChartData;
  // Props tùy chọn cho Varga charts
  vargaPlanets?: Planet[];
  vargaAscendantSign?: number;
  title?: string;
}

const MiniSouthIndianChart: React.FC<MiniSouthIndianChartProps> = ({ 
  chartData, 
  vargaPlanets,
  vargaAscendantSign,
  title = '',
}) => {
  // Shortened sign abbreviations (2 characters)
  const shortSignAbbr = [
    "Ar", "Ta", "Ge", "Ca", "Le", "Vi",
    "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
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
      "Ketu": "Ke",
      "Uranus": "Ur",
      "Neptune": "Ne",
      "Pluto": "Pl"
    };
    return map[name] || name.substring(0, 2);
  };

  // Xác định dữ liệu để render
  // Nếu có vargaPlanets -> dùng vargaPlanets, ngược lại dùng chartData.planets
  const planetsToRender = vargaPlanets || chartData.planets;
  
  // Xác định ascendant sign
  // Nếu có vargaAscendantSign -> dùng nó, ngược lại tính từ chartData.ascendant
  const ascendantSign = vargaAscendantSign ?? Math.floor(chartData.ascendant / 30);

  // Map planets to houses
  const planetsByHouse = planetsToRender.reduce((acc, planet) => {
    const houseNumber = planet.house;
    if (!acc[houseNumber]) {
      acc[houseNumber] = [];
    }
    acc[houseNumber].push(planet);
    return acc;
  }, {} as Record<number, Planet[]>);

  // In South Indian Chart, the signs are fixed, houses move based on the ascendant
  const positions = [
    [0, 1], [0, 2], [0, 3], [1, 3],
    [2, 3], [3, 3], [3, 2], [3, 1],
    [3, 0], [2, 0], [1, 0], [0, 0]
  ];

  // Calculate which house goes in each position
  const getHouseNumber = (signIndex: number) => {
    const distance = (signIndex - ascendantSign + 12) % 12;
    return ((distance + 1) % 12) || 12;
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {title && (
        <h3 className="text-center text-sm font-semibold text-votive-red mb-1 truncate px-1">
          {title}
        </h3>
      )}
      <div className="flex-1 min-h-0">
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full border border-votive-border rounded"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* White background */}
          <rect x="0" y="0" width="300" height="300" fill="white" />
          
          {/* Main Chart Grid */}
          <g transform="translate(30, 40)">
            {/* Draw the 4x4 grid with middle cells removed */}
            {Array.from({ length: 12 }, (_, index) => {
              const signIndex = index;
              const [row, col] = positions[index];
              const houseNumber = getHouseNumber(signIndex);
              
              const planetsInHouse = planetsByHouse[houseNumber] || [];
              
              const x = col * 60;
              const y = row * 60;
              
              return (
                <g key={`cell-${row}-${col}`}>
                  <rect
                    x={x}
                    y={y}
                    width={60}
                    height={60}
                    fill="none"
                    stroke="#B45309"
                    strokeWidth="0.5"
                  />
                  
                  {/* Show fixed sign abbreviation and moving house number */}
                  <text
                    x={x + 2}
                    y={y + 10}
                    fontSize="6"
                    fill="#B45309"
                    fontWeight="bold"
                  >
                    {shortSignAbbr[signIndex]} {houseNumber}
                  </text>
                  
                  {/* Display planets in this house */}
                  <g>
                    {planetsInHouse.slice(0, 4).map((planet, idx) => (
                      <text
                        key={planet.id}
                        x={x + 2}
                        y={y + 22 + idx * 9}
                        fontSize="5"
                        fill="#000000"
                      >
                        {getPlanetAbbr(planet.name)}
                        {planet.retrograde ? 'ᴿ' : ''}
                      </text>
                    ))}
                  </g>
                </g>
              );
            })}
            
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MiniSouthIndianChart;
