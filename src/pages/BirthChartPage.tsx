import { useState } from 'react';
import BirthChartForm from '../components/BirthChartForm';
import BirthChartDisplay from '../components/BirthChartDisplay';
import { BirthChart } from '../types/chart';

export default function BirthChartPage() {
  const [chart, setChart] = useState<BirthChart | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-8">
        <BirthChartForm onChartGenerated={setChart} />
        {chart && <BirthChartDisplay chart={chart} />}
      </main>
    </div>
  );
}