
import React from 'react';
import { VedicChartData, Planet, House } from './VedicChart';
import { SIGNS } from '@/utils/constants';

interface SouthIndianChartProps {
  chartData: VedicChartData;
}

const SouthIndianChart = ({ chartData }: SouthIndianChartProps) => {
  const { houses, planets, ascendant } = chartData;
  
  // Get the ascendant sign (1-12)
  const ascendantSign = Math.floor(ascendant / 30) + 1;
  
  // Organize planets by house
  const planetsByHouse: { [key: number]: Planet[] } = {};
  planets.forEach(planet => {
    if (!planetsByHouse[planet.house]) {
      planetsByHouse[planet.house] = [];
    }
    planetsByHouse[planet.house].push(planet);
  });

  // Define the grid positions for the 12 houses in South Indian style
  // Houses are arranged in a 3x3 grid with the center empty
  // [1, 12, 11]
  // [2,  X, 10]
  // [3,  4,  9]
  // [4,  5,  8]
  // [5,  6,  7]
  const housePositions = [
    [1, 12, 11],
    [2, null, 10],
    [3, 4, 9],
    [4, 5, 8],
    [5, 6, 7],
  ];

  return (
    <div className="relative w-full h-full border-2 border-amber-900 bg-amber-50/30">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {/* Houses */}
        {housePositions.flat().map((houseNumber, index) => {
          if (houseNumber === null) return (
            <div key="center" className="border border-amber-600 flex justify-center items-center">
              <div className="text-amber-800 text-sm text-center">
                वेदिक ज्योतिष<br />
                Vedic Astrology
              </div>
            </div>
          );
          
          // Calculate the actual house number based on the ascendant
          const actualHouseNumber = ((houseNumber - ascendantSign + 12) % 12) + 1;
          const house = houses.find(h => h.number === actualHouseNumber);
          const housePlanets = planetsByHouse[actualHouseNumber] || [];
          
          return (
            <div 
              key={houseNumber} 
              className="border border-amber-600 p-2 flex flex-col"
            >
              <div className="text-xs text-amber-900 font-bold mb-1">{houseNumber}</div>
              <div className="text-xs text-amber-800 mb-1">
                {house ? SIGNS[house.sign] : ''}
              </div>
              <div className="flex flex-wrap gap-1">
                {housePlanets.map((planet) => (
                  <div 
                    key={planet.id} 
                    className="text-xs font-bold flex items-center justify-center w-5 h-5 rounded-full"
                    style={{ backgroundColor: planet.color + '40', color: planet.color }}
                    title={`${planet.name} - ${planet.longitude.toFixed(2)}° ${planet.retrograde ? 'R' : ''}`}
                  >
                    {planet.symbol}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SouthIndianChart;
