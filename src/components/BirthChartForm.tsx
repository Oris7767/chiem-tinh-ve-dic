import React, { useState } from 'react';
import { calculateBirthChart } from '../services/astrology';
import SouthIndianChart from './SouthIndianChart';
import { BirthChart } from '../types/chart';
import { City, cities } from '../utils/cities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarIcon, ClockIcon, MapPinIcon, AlertCircle } from 'lucide-react';

const BirthChartForm: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [chart, setChart] = useState<BirthChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate inputs
      if (!date || !time || !selectedCity) {
        throw new Error('Vui lòng điền đầy đủ thông tin.');
      }

      const parsedDate = new Date(`${date}T${time}`);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Ngày hoặc giờ không hợp lệ.');
      }

      // Find city coordinates
      const city = cities.find((c) => c.name === selectedCity);
      if (!city) {
        throw new Error('Thành phố không hợp lệ.');
      }

      // Calculate chart
      const result = await calculateBirthChart(parsedDate, city.latitude, city.longitude);
      setChart(result);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tính lá số.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Tạo Lá Số Tử Vi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" /> Ngày sinh (YYYY-MM-DD)
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                aria-required="true"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="time" className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4" /> Giờ sinh (HH:MM)
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                aria-required="true"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="city" className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" /> Thành phố
              </Label>
              <Select onValueChange={setSelectedCity} required>
                <SelectTrigger id="city" className="mt-1">
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.vietnameseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Đang tính toán...' : 'Tạo lá số'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && <Skeleton className="mt-4 h-96 w-full" />}

          {chart && !isLoading && (
            <div className="mt-4">
              <SouthIndianChart chart={chart} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BirthChartForm;