import { BirthChart } from '../types/chart';
import SouthIndianChart from './SouthIndianChart';
import PlanetTable from './PlanetTable';

interface Props {
  chart: BirthChart;
  className?: string;
}

export default function BirthChartDisplay({ chart, className }: Props) {
  return (
    <div className={`p-4 max-w-4xl mx-auto ${className}`}>
      <h2 className="text-3xl font-bold mb-4 text-center">Your Vedic Birth Chart</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SouthIndianChart chart={chart} />
        <PlanetTable chart={chart} />
      </div>
    </div>
  );
}