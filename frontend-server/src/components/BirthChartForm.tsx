import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, MapPin, Clock, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { BirthChartData } from '../pages/BirthChartPage';

interface BirthChartFormProps {
  onCalculate: (data: BirthChartData) => void;
}

const BirthChartForm: React.FC<BirthChartFormProps> = ({ onCalculate }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  }, []);

  const handleDetectLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setLatitude(lat);
          setLongitude(lng);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
              const locationName = data.display_name.split(',').slice(0, 3).join(', ');
              setLocation(locationName);
            }
          } catch (error) {
            console.error('Error fetching location name:', error);
          }
          
          setLoading(false);
          toast({
            title: t('birthChart.locationDetected') || 'Location detected',
            description: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          toast({
            title: t('birthChart.locationError') || 'Location Error',
            description: t('birthChart.locationErrorDesc') || 'Could not detect your location',
            variant: 'destructive',
          });
        }
      );
    } else {
      setLoading(false);
      toast({
        title: t('birthChart.geolocationNotSupported') || 'Not Supported',
        description: t('birthChart.geolocationNotSupportedDesc') || 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsComingSoonOpen(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">
            <CalendarIcon className="inline-block mr-2 h-4 w-4" />
            {t('birthChart.birthDate') || 'Birth Date'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : (t('birthChart.selectDate') || "Select a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">
            <Clock className="inline-block mr-2 h-4 w-4" />
            {t('birthChart.birthTime') || 'Birth Time'}
          </Label>
          <Input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">
            <MapPin className="inline-block mr-2 h-4 w-4" />
            {t('birthChart.birthLocation') || 'Birth Location'}
          </Label>
          <div className="flex gap-2">
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t('birthChart.locationPlaceholder') || "City, Country"}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleDetectLocation}
              disabled={loading}
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="latitude">{t('birthChart.latitude') || 'Latitude'}</Label>
            <Input
              type="number"
              id="latitude"
              value={latitude !== null ? latitude : ''}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              step="0.0001"
              min="-90"
              max="90"
              placeholder="0.0000"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">{t('birthChart.longitude') || 'Longitude'}</Label>
            <Input
              type="number"
              id="longitude"
              value={longitude !== null ? longitude : ''}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              step="0.0001"
              min="-180"
              max="180"
              placeholder="0.0000"
              required
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            {t('birthChart.calculateChart') || 'Calculate Birth Chart'}
          </Button>
        </div>
      </form>

      <Dialog open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>
              The Vedic Birth Chart feature is currently under development. 
              We're working hard to bring you this exciting new tool. 
              Stay tuned for updates!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BirthChartForm;
