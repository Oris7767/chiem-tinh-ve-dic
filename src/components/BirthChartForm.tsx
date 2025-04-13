import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateBirthChart } from '../services/astrology';
import { BirthChart } from '../types/chart';

interface Props {
  onChartGenerated: (chart: BirthChart) => void;
}

export default function BirthChartForm({ onChartGenerated }: Props) {
  const [form, setForm] = useState({ date: '', lat: '', lon: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const date = new Date(form.date);
      const lat = Number(form.lat);
      const lon = Number(form.lon);
      if (isNaN(lat) || isNaN(lon) || isNaN(date.getTime())) {
        throw new Error('Invalid input');
      }
      const chart = await calculateBirthChart(date, lat, lon); // Your logic
      onChartGenerated(chart);
    } catch (err) {
      setError('Failed to generate chart. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Generate Vedic Birth Chart</h2>
      <div>
        <label htmlFor="date" className="block text-sm font-medium">
          Date & Time of Birth
        </label>
        <Input
          id="date"
          type="datetime-local"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="lat" className="block text-sm font-medium">
          Latitude
        </label>
        <Input
          id="lat"
          type="number"
          step="any"
          value={form.lat}
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
          placeholder="e.g., 21.0285"
          required
        />
      </div>
      <div>
        <label htmlFor="lon" className="block text-sm font-medium">
          Longitude
        </label>
        <Input
          id="lon"
          type="number"
          step="any"
          value={form.lon}
          onChange={(e) => setForm({ ...form, lon: e.target.value })}
          placeholder="e.g., 105.8542"
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Generating...' : 'Generate Chart'}
      </Button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}