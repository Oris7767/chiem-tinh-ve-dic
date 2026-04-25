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
  vargaAscendantLongitude?: number; // Longitude thực của ASC trong Varga chart
  title?: string;
  // Tùy chọn hiển thị
  showCoordinates?: boolean; // Hiển thị tọa độ độ của hành tinh
}

// Hàm trích xuất ascendant longitude từ chart data
const getAscendantLongitude = (ascendant: VedicChartData['ascendant']): number => {
  return ascendant;
};

const MiniSouthIndianChart: React.FC<MiniSouthIndianChartProps> = ({ 
  chartData, 
  vargaPlanets,
  vargaAscendantSign,
  vargaAscendantLongitude,
  title = '',
  showCoordinates = true, // Mặc định bật hiển thị tọa độ
}) => {
  // Shortened sign abbreviations (2 characters)
  const shortSignAbbr = [
    "Ar", "Ta", "Ge", "Ca", "Le", "Vi",
    "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
  ];

  // Hàm format độ để hiển thị (ví dụ: 15°30')
  const formatDegree = (degree: number) => {
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    return `${deg}°${min.toString().padStart(2, '0')}'`;
  };

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
  
  // Xác định ascendant sign (sign index 0-11) cho việc tính house
  // Chỉ dùng vargaAscendantSign khi có, ngược lại tính từ longitude
  const rawAscendant = getAscendantLongitude(chartData.ascendant);
  const ascendantSignIndex = vargaAscendantSign ?? Math.floor(rawAscendant / 30);
  
  // Xác định ascendant longitude đầy đủ để hiển thị độ
  const ascendantLongitudeValue = vargaAscendantLongitude ?? rawAscendant;

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
    const distance = (signIndex - ascendantSignIndex + 12) % 12;
    return ((distance + 1) % 12) || 12;
  };

  // Tính độ trong cung cho ASC
  const ascDegree = ascendantSignIndex !== undefined ? (ascendantLongitudeValue % 30) : (ascendantLongitudeValue % 30);

  return (
    <div className="relative w-full h-full flex flex-col">
      {title && (
        <h3 className="text-center text-sm font-semibold text-votive-red mb-1 truncate px-1">
          {title}
        </h3>
      )}
      <div className="flex-1 min-h-0">
        <svg
          viewBox="0 0 350 350"
          className="w-full h-full border border-votive-border rounded"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* White background */}
          <rect x="0" y="0" width="350" height="350" fill="white" />
          
          {/* Main Chart Grid */}
          <g transform="translate(25, 35)">
            {/* Draw the 4x4 grid with middle cells removed */}
            {Array.from({ length: 12 }, (_, index) => {
              const signIndex = index;
              const [row, col] = positions[index];
              const houseNumber = getHouseNumber(signIndex);
              const isAscendant = houseNumber === 1;
              
              const planetsInHouse = planetsByHouse[houseNumber] || [];
              
              const x = col * 70;
              const y = row * 70;
              
              // Build render items list: ASC first, then planets
              const renderItems: Array<{ id: string; label: string; color: string; subLabel?: string }> = [];
              
              if (isAscendant) {
                renderItems.push({
                  id: 'asc',
                  label: 'ASC',
                  color: '#B45309',
                  subLabel: formatDegree(ascDegree),
                });
              }
              
              // Show all planets (no slice limit)
              planetsInHouse.forEach(planet => {
                renderItems.push({
                  id: planet.id,
                  label: `${getPlanetAbbr(planet.name)}${planet.retrograde ? 'ᴿ' : ''}`,
                  color: '#000000',
                  subLabel: showCoordinates ? formatDegree(planet.vargaDegree || planet.longitude % 30) : undefined,
                });
              });
              
              // Dynamic font sizing based on item count
              const itemCount = renderItems.length;
              const needsCompact = itemCount > 4;
              const fontSize = needsCompact ? 5 : 7;
              const subFontSize = needsCompact ? 3.5 : 5;
              const lineHeight = needsCompact ? 7 : 11;
              
              return (
                <g key={`cell-${row}-${col}`}>
                  <rect
                    x={x}
                    y={y}
                    width={70}
                    height={70}
                    fill="none"
                    stroke="#B45309"
                    strokeWidth="0.5"
                  />
                  
                  {/* Show fixed sign abbreviation and moving house number */}
                  <text
                    x={x + 3}
                    y={y + 12}
                    fontSize="8"
                    fill="#B45309"
                    fontWeight="normal"
                  >
                    {shortSignAbbr[signIndex]} {houseNumber}
                  </text>
                  
                  {/* Display ASC and planets in this house */}
                  <g>
                    {renderItems.map((item, idx) => (
                      <text
                        key={item.id}
                        x={x + 3}
                        y={y + 22 + idx * lineHeight}
                        fontSize={fontSize}
                        fontWeight="normal"
                        fill={item.color}
                      >
                        {item.label}
                        {item.subLabel && (
                          <tspan fontSize={subFontSize} fontWeight="normal" fill="#666">
                            {' '}{item.subLabel}
                          </tspan>
                        )}
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
