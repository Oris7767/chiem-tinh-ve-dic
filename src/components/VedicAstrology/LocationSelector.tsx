
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';
import { COUNTRIES } from '@/utils/vedicAstrology/countries';
import { VEDIC_ASTRO_API_CONFIG } from '@/utils/vedicAstrology/config';
import { GeoapifyLocationResponse } from '@/utils/vedicAstrology/config';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

interface LocationSelectorProps {
  onLocationSelected: (locationData: {
    formatted: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => void;
  defaultCountry?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationSelected,
  defaultCountry = "VN"
}) => {
  const [country, setCountry] = useState(defaultCountry);
  const [city, setCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locationInputRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the location dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear the timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Initial setup - select country and send basic location data
  useEffect(() => {
    if (country) {
      const countryName = COUNTRIES.find(c => c.code === country)?.name || '';
      
      // Send initial location data when country is selected
      const selectedCountry = COUNTRIES.find(c => c.code === country);
      if (selectedCountry) {
        onLocationSelected({
          formatted: selectedCountry.name,
          city: '',
          country: selectedCountry.name,
          latitude: 0,  // Default latitude
          longitude: 0, // Default longitude
          timezone: 'UTC' // Default timezone
        });
      }
    }
  }, [country, onLocationSelected]);

  // Function to search for locations using Geoapify Autocomplete API
  const searchLocation = async (query: string, countryCode: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setShowSuggestions(true);
    
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:${countryCode}&format=json&apiKey=${VEDIC_ASTRO_API_CONFIG.GEOAPIFY_API_KEY}`
      );
      
      const data: GeoapifyLocationResponse = await response.json();
      
      if (data && data.results) {
        setSuggestions(data.results);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error during location search:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle city input changes with debounce
  const handleCityInputChange = (value: string) => {
    setCity(value);
    
    // Clear the previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout for the search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value, country);
    }, 300);

    // If the city field has been modified, update location with current input
    const countryName = COUNTRIES.find(c => c.code === country)?.name || '';
    onLocationSelected({
      formatted: `${value}, ${countryName}`,
      city: value,
      country: countryName,
      latitude: 0,  // Will be updated when a specific city is selected
      longitude: 0, // Will be updated when a specific city is selected
      timezone: 'UTC' // Will be updated when a specific city is selected
    });
  };

  // Handle country change
  const handleCountryChange = (value: string) => {
    setCountry(value);
    // Reset city and suggestions when country changes
    if (city) {
      searchLocation(city, value);
    }
    
    // Update with just the country selection
    const countryName = COUNTRIES.find(c => c.code === value)?.name || '';
    onLocationSelected({
      formatted: countryName,
      city: city,
      country: countryName,
      latitude: 0,  // Default latitude
      longitude: 0, // Default longitude
      timezone: 'UTC' // Default timezone
    });
  };

  // Handle location suggestion selection
  const handleSelectLocation = (suggestion: any) => {
    const { formatted, lat, lon, timezone } = suggestion.properties;
    const countryName = COUNTRIES.find(c => c.code === country)?.name || '';
    
    // Extract city from formatted address or use the input
    const cityName = city || formatted.split(',')[0];
    
    onLocationSelected({
      formatted: formatted,
      city: cityName,
      country: countryName,
      latitude: lat,
      longitude: lon,
      timezone: timezone?.name || 'UTC'
    });
    
    // Update city input with selected city name
    setCity(cityName);
    
    // Clear the suggestions and hide dropdown
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4" ref={locationInputRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">Quốc gia</label>
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Chọn quốc gia" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Quốc gia</SelectLabel>
                {COUNTRIES.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <label htmlFor="city" className="block text-sm font-medium mb-1">Thành phố</label>
          <div className="relative">
            <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="city"
              type="text"
              placeholder="Nhập thành phố"
              className="pl-8"
              value={city}
              onChange={(e) => handleCityInputChange(e.target.value)}
              onFocus={() => city && setShowSuggestions(true)}
            />
          </div>

          {isSearching && (
            <div className="text-xs text-amber-600 mt-1 flex items-center">
              <span className="animate-spin mr-1">⏳</span> Đang tìm kiếm địa điểm...
            </div>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                  onClick={() => handleSelectLocation(suggestion)}
                >
                  <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                  <span>{suggestion.properties.formatted}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
