import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useRef } from 'react';
import { Search, Calendar, Clock, MapPin, Mail, User } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateTime } from 'luxon';
import { supabase } from '@/integrations/supabase/client';
import { VEDIC_ASTRO_API_CONFIG } from '@/utils/vedicAstrology/config';

// Define the schema for the form data
const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên của bạn'),
  email: z.string().email('Vui lòng nhập email hợp lệ').optional(),
  birthDate: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  birthTime: z.string().min(1, 'Vui lòng nhập giờ sinh'),
  location: z.string().min(1, 'Vui lòng nhập địa điểm sinh'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1, 'Vui lòng chọn múi giờ'),
});

export type BirthDataFormValues = z.infer<typeof formSchema>;

interface BirthChartFormProps {
  onSubmit: (data: BirthDataFormValues) => void;
  isLoading: boolean;
}

interface LocationSuggestion {
  properties: {
    formatted: string;
    lat: number;
    lon: number;
    timezone?: {
      name: string;
    };
  };
}

const BirthChartForm = ({ onSubmit, isLoading }: BirthChartFormProps) => {
  const [savedCharts, setSavedCharts] = useState<any[]>([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const locationInputRef = useRef<HTMLDivElement>(null);

  const form = useForm<BirthDataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      birthDate: '',
      birthTime: '',
      location: '',
      latitude: 0,
      longitude: 0,
      timezone: 'Asia/Ho_Chi_Minh',
    },
  });

  // Handle clicks outside the location dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsUserLoggedIn(!!user);
      
      if (user) {
        // Fetch user's saved charts
        const { data: charts, error } = await supabase
          .from('birth_charts')
          .select('*')
          .eq('user_id', user.id);
          
        if (charts && !error) {
          setSavedCharts(charts);
          
          // If there's at least one chart, pre-fill the form with the latest one
          if (charts.length > 0) {
            const latestChart = charts[0];
            // Extract birth data from the saved chart
            if (latestChart && latestChart.planets) {
              try {
                const userData = user.user_metadata;
                form.setValue('name', userData?.name || '');
                form.setValue('email', user.email || '');
                // Other fields would be populated if stored in the birth_charts table
              } catch (err) {
                console.error('Error parsing saved chart data', err);
              }
            }
          }
        }
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsUserLoggedIn(!!session?.user);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  const handleFormSubmit = async (values: BirthDataFormValues) => {
    // Call the parent component's onSubmit handler
    onSubmit(values);
    
    // If user is logged in, save the birth chart data
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // The actual chart data will be saved after calculation in the parent component
      console.log('User is logged in, chart data will be saved after calculation');
    }
  };

  // Function to search for locations using Geoapify Autocomplete API
  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowLocationDropdown(true);
    
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&format=json&apiKey=${VEDIC_ASTRO_API_CONFIG.GEOAPIFY_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data && data.results) {
        setLocationSuggestions(data.results);
      } else {
        setLocationSuggestions([]);
      }
    } catch (error) {
      console.error('Error during location search:', error);
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location input changes with debounce
  const handleLocationInputChange = (value: string) => {
    form.setValue('location', value);
    
    // Clear the previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set a new timeout for the search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value);
    }, 300);
  };

  // Handle location suggestion selection
  const handleSelectLocation = (suggestion: LocationSuggestion) => {
    form.setValue('location', suggestion.properties.formatted);
    form.setValue('latitude', suggestion.properties.lat);
    form.setValue('longitude', suggestion.properties.lon);
    
    // Set timezone if available from the API
    if (suggestion.properties.timezone && suggestion.properties.timezone.name) {
      form.setValue('timezone', suggestion.properties.timezone.name);
    }
    
    // Clear the suggestions and hide dropdown
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Nguyễn Văn A" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (không bắt buộc)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="email@example.com" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giờ sinh</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="time" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="relative" ref={locationInputRef}>
              <FormLabel>Nơi sinh</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Thành phố, Quốc gia"
                    className="pl-8"
                    {...field}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    onFocus={() => field.value && setShowLocationDropdown(true)}
                  />
                </div>
              </FormControl>
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
                  {locationSuggestions.map((suggestion, index) => (
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
              {isSearching && (
                <div className="text-xs text-amber-600 mt-1 flex items-center">
                  <span className="animate-spin mr-1">⏳</span> Đang tìm kiếm địa điểm...
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hidden fields for latitude, longitude, and timezone */}
        <input type="hidden" {...form.register('latitude', { valueAsNumber: true })} />
        <input type="hidden" {...form.register('longitude', { valueAsNumber: true })} />
        <input type="hidden" {...form.register('timezone')} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang tính toán..." : "Tính toán bản đồ sao"}
        </Button>
      </form>
    </Form>
  );
};

export default BirthChartForm;
