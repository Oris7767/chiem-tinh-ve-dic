import { BirthChart } from '../types/chart';
import { getPlanetColor } from '../utils/VedicAstro/Planets';

interface Props {
  chart: BirthChart;
}

export default function PlanetTable({ chart }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Planetary Positions</h3>
      <table className="w-full text-sm" aria-label="Planetary positions">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Planet</th>
            <th className="p-2 text-left">Rashi</th>
            <th className="p-2 text-left">Nakshatra</th>
            <th className="p-2 text-left">Pada</th>
            <th className="p-2 text-left">Longitude</th>
            <th className="p-2 text-left">Dignity</th>
          </tr>
        </thead>
        <tbody>
          {chart.planets.map((planet) => (
            <tr key={planet.name} className="border-t">
              <td className="p-2" style={{ color: getPlanetColor(planet.name) }}>
                {planet.name}
              </td>
              <td className="p-2">{planet.rashi}</td>
              <td className="p-2">{planet.nakshatra}</td>
              <td className="p-2">{planet.pada}</td>
              <td className="p-2">{planet.longitude.toFixed(2)}°</td>
              <td className="p-2">{planet.dignity || 'Neutral'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}