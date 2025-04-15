import { BirthChart } from '../types/chart';
import { SIGNS } from '../utils/VedicAstro/Signs';
import { getPlanetSymbol } from '../utils/VedicAstro/Planets';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

<svg className="max-w-full h-auto" viewBox="0 0 400 400" />
const zodiacSigns = Object.values(SIGNS).map((s) => s.sanskritName);
const vedicOrderPositions: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 3],
  [2, 3], [3, 3], [3, 2], [3, 1],
  [3, 0], [2, 0], [1, 0], [0, 0],
];
const gridSize = 4;
const cellSize = 100;
const chartX = 0;
const chartY = 0;

interface Props {
  chart: BirthChart;
  className?: string;
}

export default function SouthIndianChart({ chart, className }: Props) {
  const width = gridSize * cellSize;
  const height = gridSize * cellSize;

  // Group planets by rashi
  const planetPositions: Record<string, { row: number; col: number; planets: Array<{ name: string; symbol: string }> }> = {};
  zodiacSigns.forEach((rashi, index) => {
    const [row, col] = vedicOrderPositions[index];
    planetPositions[rashi] = { row, col, planets: [] };
  });
  chart.planets.forEach((planet) => {
    if (planet.rashi in planetPositions) {
      planetPositions[planet.rashi].planets.push({
        name: planet.name,
        symbol: getPlanetSymbol(planet.name),
      });
    }
  });

  return (
    <TooltipProvider>
      <div className={`border rounded-lg p-4 bg-white shadow ${className}`}>
        <h3 className="text-lg font-semibold mb-2">South Indian Chart</h3>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="max-w-full h-auto"
          aria-label="South Indian Vedic astrology chart"
        >
          {/* Grid */}
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => {
              if ([1, 2].includes(row) && [1, 2].includes(col)) return null;
              const x = chartX + col * cellSize;
              const y = chartY + row * cellSize;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  stroke="black"
                  fill="none"
                  strokeWidth={2}
                />
              );
            }),
          )}

          {/* Rashis */}
          {zodiacSigns.map((sign, index) => {
            const [row, col] = vedicOrderPositions[index];
            const x = chartX + col * cellSize + 5;
            const y = chartY + row * cellSize + 15;
            return (
              <text
                key={sign}
                x={x}
                y={y}
                fontSize="12"
                fill="black"
                aria-label={`Rashi: ${sign}`}
              >
                {sign}
              </text>
            );
          })}

          {/* Planets */}
          {Object.entries(planetPositions).map(([rashi, { row, col, planets }]) => {
            if (!planets.length) return null;
            const x = chartX + col * cellSize + cellSize / 2;
            const y = chartY + row * cellSize + cellSize / 2;
            return (
              <Tooltip key={rashi}>
                <TooltipTrigger asChild>
                  <text
                    x={x}
                    y={y}
                    fontSize="10"
                    fill="blue"
                    textAnchor="middle"
                    aria-label={`Planets in ${rashi}: ${planets.map((p) => p.name).join(', ')}`}
                  >
                    {planets.map((p) => p.symbol).join(' ')}
                  </text>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{planets.map((p) => p.name).join(', ')} in {rashi}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>
        <p className="text-sm text-gray-600 mt-2">
          Ascendant: {chart.ascendant.rashi} ({chart.ascendant.degree.toFixed(2)}°)
        </p>
      </div>
    </TooltipProvider>
  );
}