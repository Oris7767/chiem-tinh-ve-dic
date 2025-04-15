
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
      if (!date || !time || !selectedCity) {
        throw new Error('Please fill in all fields.');
      }

      const city = cities.find((c) => c.name === selectedCity);
      if (!city) {
        throw new Error('Invalid city selected.');
      }

      const result = await calculateBirthChart(
        new Date(`${date}T${time}`),
        city.latitude,
        city.longitude
      );
      setChart(result);
    } catch (err: any) {
      setError(err.message || 'Failed to calculate birth chart');
      console.error('Birth chart calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Generate Birth Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Birth Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Birth Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Select onValueChange={setSelectedCity} required>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Calculating...' : 'Generate Chart'}
            </Button>
          </form>

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
