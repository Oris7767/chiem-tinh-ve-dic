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
  ascendantDetails?: {
    longitude: number;
    nakshatra: {
      name: string;
      lord: string;
      pada: number;
      startDegree: number;
      endDegree: number;
    };
    sign: {
      name: string;
      degree: number;
    };
  };
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
}

interface SouthIndianChartProps {
  chartData: VedicChartData;
  userName?: string;
  birthInfo?: string;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ 
  chartData, 
  userName = '',
  birthInfo = ''
}) => {
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

  // Calculate degrees within sign (0-29.99)
  const getDegreesInSign = (longitude: number) => {
    const totalDegrees = longitude % 30;
    const degrees = Math.floor(totalDegrees);
    const minutes = Math.floor((totalDegrees - degrees) * 60);
    return `${degrees}°${minutes.toString().padStart(2, '0')}'`;
  };

  // Format ascendant coordinates
  const formatAscendantCoord = () => {
    if (chartData.ascendantDetails?.longitude) {
      return getDegreesInSign(chartData.ascendantDetails.longitude);
    }
    return getDegreesInSign(chartData.ascendant);
  };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full border border-amber-200 rounded-lg"
        id="birth-chart-svg"
      >
        {/* Add a white background for better image saving */}
        <rect x="0" y="0" width="400" height="400" fill="white" />
        
        {/* Chart Title and Birth Info */}
        {(userName || birthInfo) && (
          <g>
            {userName && (
              <text x="200" y="30" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#B45309">
                Vedic Birth Chart for {userName}
              </text>
            )}
            {birthInfo && (
              <text x="200" y="50" fontSize="12" textAnchor="middle" fill="#666">
                {birthInfo}
              </text>
            )}
          </g>
        )}
        
        {/* Main Chart Grid - positioned with padding for details */}
        <g transform="translate(50, 70)">
          {/* Draw the 4x4 grid with middle cells removed */}
          {Array.from({ length: 12 }, (_, index) => {
            const signIndex = index;
            const [row, col] = positions[index];
            const houseNumber = getHouseNumber(signIndex);
            
            // Get planets in this house
            const planetsInHouse = planetsByHouse[houseNumber] || [];
            
            const x = col * 75;
            const y = row * 75;
            
            return (
              <g key={`cell-${row}-${col}`}>
                <rect
                  x={x}
                  y={y}
                  width={75}
                  height={75}
                  fill="none"
                  stroke="#B45309"
                  strokeWidth="1"
                />
                
                {/* Show fixed sign abbreviation and moving house number */}
                <text
                  x={x + 5}
                  y={y + 15}
                  fontSize="10"
                  fill="#B45309"
                  fontWeight="bold"
                >
                  {shortSignAbbr[signIndex]} {houseNumber}
                  {houseNumber === 1 && ` ASC ${formatAscendantCoord()}`}
                </text>
                
                {/* Display planets in this house */}
                <g>
                  {planetsInHouse.map((planet, idx) => (
                    <text
                      key={planet.id}
                      x={x + 5}
                      y={y + 30 + idx * 14}
                      fontSize="10"
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
            x="112.5" 
            y="112.5" 
            width="75" 
            height="75"
          />
        </g>
      </svg>
    </div>
  );
};

export default SouthIndianChart;
