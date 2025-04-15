import React, { useState } from 'react';
import { calculateBirthChart } from '../services/astrology';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input'; // Import Input separately
import { Button } from '@/components/ui/button';

const BirthChartForm = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [city, setCity] = useState('');
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      const birthDate = new Date(year, month - 1, day, hours, minutes);
      const lat = 21.0285; // Hà Nội latitude
      const lon = 105.8542; // Hà Nội longitude

      const data = await calculateBirthChart(birthDate, lat, lon);
      setChartData(data);
      setError('');
    } catch (err) {
      setError('Không thể tính lá số. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tính Lá Số Vedic</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Ngày sinh (YYYY-MM-DD):</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label>Giờ sinh (HH:MM):</label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div>
          <label>Thành phố:</label>
          <Select onValueChange={setCity} value={city}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn thành phố" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hà Nội">Hà Nội</SelectItem>
              <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Tính Lá Số</Button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {chartData && <p>Chart data loaded: {JSON.stringify(chartData)}</p>}
    </div>
  );
};

export default BirthChartForm;