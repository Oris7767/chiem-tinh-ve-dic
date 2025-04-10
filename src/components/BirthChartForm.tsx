import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
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
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number | null>(0);
  const [longitude, setLongitude] = useState<number | null>(0);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false)
  const [timezone, setTimezone] = useState('');

  const [name, setName] = useState('');
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  }, []);
  const inputRef = useRef<HTMLInputElement>(null)
  const handleDetectLocation = async () => {
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
              const locationName = data.display_name
              setLocation(locationName);
            }
          } catch (error) {
            console.error('Error fetching location name:', error);
          }
          
          setLoading(false);
          toast && toast({
            title: t('birthChart.locationDetected') || 'Location detected',
            description: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          toast && toast({
            title: t('birthChart.locationError') || 'Location Error',
            description: t('birthChart.locationErrorDesc') || 'Could not detect your location',
            variant: 'destructive',
          });
        }
      );
    } else {
      setLoading(false)
      toast({
        title: t('birthChart.geolocationNotSupported') || 'Not Supported',
        description: t('birthChart.geolocationNotSupportedDesc') || 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
    }
  };

  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocationName(newLocation);
    fetchLocationSuggestions(newLocation);
    setIsLocationMenuOpen(true)
  };

  const handleLocationSelect = (suggestion: any) => {
    setLocationName(suggestion.display_name);
    setLatitude(parseFloat(suggestion.lat));
    setLongitude(parseFloat(suggestion.lon));
    setSuggestions([]);
    setIsLocationMenuOpen(false)
    inputRef.current?.blur()
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !date || !time || !locationName) {
      toast && toast({
        title: "Required fields are missing",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      })
      return;
    }
    onCalculate && onCalculate({
      date: date, time: time, location: locationName, latitude: latitude!, longitude: longitude!, timezone: timezone
    })
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-1">
        {/* Name Input */}
        <div className="md:col-span-2 space-y-2">
            <Label htmlFor="name">{t('birthChart.name') || 'Name'}</Label>
            <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('birthChart.namePlaceholder') || "Enter your name"}
            />
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
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
          <Label htmlFor="locationName">
            <MapPin className="mr-2 h-4 w-4 inline-block" />
            {t("birthChart.birthLocation") || "Birth Location"}
          </Label>
          <Command open={isLocationMenuOpen} onOpenChange={setIsLocationMenuOpen}>
            <CommandInput ref={inputRef} onFocus={() => { setIsLocationMenuOpen(true) }} placeholder="Search for a location" value={locationName} onChange={handleLocationChange} className="border border-input" />
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((suggestion) => (
                <CommandItem key={suggestion.place_id} onSelect={() => handleLocationSelect(suggestion)} className="cursor-pointer">
                  {suggestion.display_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
          <div className='mt-2 flex items-center'>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDetectLocation}
                disabled={loading}
              >
                <Navigation className="h-4 w-4" />
            </Button>
            <span className="ml-2 text-sm text-gray-500">{t("birthChart.currentLocation") || "Use Current Location"}</span>
          </div>

        </div>
      </div>

        <div className="md:col-span-2 mt-2">
          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            {t('birthChart.calculateChart') || 'Calculate Birth Chart'}
          </Button>
        </div>
      </form>
      
    </>
  );
};

export default BirthChartForm;
