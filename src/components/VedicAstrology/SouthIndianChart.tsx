
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

interface SouthIndianChartProps {
  chartData: VedicChartData;
  showDetails?: boolean;
  userName?: string;
  birthInfo?: string;
}

const SouthIndianChart: React.FC<SouthIndianChartProps> = ({ 
  chartData, 
  showDetails = true,
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
    return (longitude % 30).toFixed(2);
  };

  // Get zodiac sign names for detailed view
  const SIGNS = [
    "Aries", "Taurus", "Gemini", 
    "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", 
    "Capricorn", "Aquarius", "Pisces"
  ];

  // Generate detailed planet information for the side panel
  const renderPlanetDetails = () => {
    return chartData.planets.map((planet, index) => (
      <g key={`planet-detail-${planet.id}`} transform={`translate(430, ${120 + index * 20})`}>
        <text x="0" y="0" fontSize="12" fill="#000000" textAnchor="start">
          {getPlanetAbbr(planet.name)}: {SIGNS[planet.sign]} {getDegreesInSign(planet.longitude)}°
          {planet.retrograde ? 'ᴿ' : ''}
        </text>
      </g>
    ));
  };

  // Generate house details for the side panel
  const renderHouseDetails = () => {
    return chartData.houses.map((house, index) => (
      <g key={`house-detail-${house.number}`} transform={`translate(430, ${270 + index * 20})`}>
        <text x="0" y="0" fontSize="12" fill="#000000" textAnchor="start">
          {house.number === 1 ? "Asc" : `House ${house.number}`}: {SIGNS[house.sign]} {getDegreesInSign(house.longitude)}°
        </text>
      </g>
    ));
  };

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full border border-amber-200 rounded-lg"
        id="birth-chart-svg"
      >
        {/* Add a white background for better image saving */}
        <rect x="0" y="0" width="600" height="600" fill="white" />
        
        {/* Chart Title and Birth Info */}
        {(userName || birthInfo) && (
          <g>
            {userName && (
              <text x="300" y="30" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#B45309">
                Vedic Birth Chart for {userName}
              </text>
            )}
            {birthInfo && (
              <text x="300" y="50" fontSize="12" textAnchor="middle" fill="#666">
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
                  {houseNumber === 1 && " ⬆"} {/* Special symbol for ascendant */}
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

        {/* Detailed information panel if requested */}
        {showDetails && (
          <g>
            {/* Panel Background */}
            <rect x="420" y="70" width="150" height="450" fill="#f9f5eb" fillOpacity="0.5" rx="5" ry="5" />
            
            {/* Panel Title - Planets */}
            <text x="430" y="100" fontSize="14" fontWeight="bold" fill="#B45309">
              Planets
            </text>
            
            {/* Planet Details */}
            {renderPlanetDetails()}
            
            {/* Panel Title - Houses */}
            <text x="430" y="250" fontSize="14" fontWeight="bold" fill="#B45309">
              Houses
            </text>
            
            {/* House Details */}
            {renderHouseDetails()}
            
            {/* Additional Information */}
            <text x="430" y="420" fontSize="14" fontWeight="bold" fill="#B45309">
              Special Information
            </text>
            
            <text x="430" y="440" fontSize="12" fill="#000000">
              Moon Nakshatra: {chartData.moonNakshatra}
            </text>
            
            <text x="430" y="460" fontSize="12" fill="#000000">
              Lunar Day (Tithi): {chartData.lunarDay}
            </text>
            
            <text x="430" y="480" fontSize="12" fill="#000000">
              Ascendant: {SIGNS[Math.floor(chartData.ascendant / 30)]} {getDegreesInSign(chartData.ascendant)}°
            </text>
            
            {/* Watermark */}
            <text x="460" y="520" fontSize="10" fill="#999" textAnchor="middle">
              Generated by VedicAstro
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default SouthIndianChart;
