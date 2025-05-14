
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Navigation, Search } from 'lucide-react';
import { GEOAPIFY_API_KEY } from '@/utils/constants';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type BirthDataFormValues = {
  birthDate: string;
  birthTime: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

const defaultValues: BirthDataFormValues = {
  birthDate: new Date().toISOString().split('T')[0],
  birthTime: new Date().toTimeString().slice(0, 5),
  location: 'Hanoi, Vietnam',
  latitude: 21.03,
  longitude: 105.85,
  timezone: 'Asia/Ho_Chi_Minh',
};

// Common timezones for easy selection
const COMMON_TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Vietnam (GMT+7)' },
  { value: 'Asia/Bangkok', label: 'Thailand (GMT+7)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Asia/Tokyo', label: 'Japan (GMT+9)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
];

const formSchema = z.object({
  birthDate: z.string().min(1, 'Birth date is required'),
  birthTime: z.string().min(1, 'Birth time is required'),
  location: z.string().min(1, 'Location is required'),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string().min(1, 'Timezone is required'),
});

interface BirthChartFormProps {
  onSubmit: (data: BirthDataFormValues) => void;
  isLoading?: boolean;
}

const BirthChartForm = ({ onSubmit, isLoading = false }: BirthChartFormProps) => {
  const { toast } = useToast();
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const form = useForm<BirthDataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Không hỗ trợ",
        description: "Trình duyệt của bạn không hỗ trợ xác định vị trí",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Đang xác định vị trí...",
        description: "Vui lòng chờ trong giây lát",
      });

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get location name and timezone
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`,
              { headers: { 'Accept-Language': 'vi,en' } }
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data.features && data.features.length > 0) {
                const properties = data.features[0].properties;
                const locationName = [
                  properties.city || properties.county || properties.state,
                  properties.country
                ].filter(Boolean).join(', ');

                // Get timezone from coordinates
                const tzResponse = await fetch(
                  `https://api.geoapify.com/v1/timezone?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_API_KEY}`
                );
                
                if (tzResponse.ok) {
                  const tzData = await tzResponse.json();
                  if (tzData.timezone) {
                    form.setValue('timezone', tzData.timezone.name);
                  }
                }

                form.setValue('location', locationName);
                form.setValue('latitude', latitude);
                form.setValue('longitude', longitude);
                
                toast({
                  title: "Đã xác định vị trí",
                  description: locationName,
                });
              }
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
            toast({
              title: "Lỗi xác định chi tiết vị trí",
              description: "Đã xảy ra lỗi khi lấy thông tin địa điểm",
              variant: "destructive",
            });
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Không thể xác định vị trí",
            description: "Vui lòng cấp quyền truy cập vị trí hoặc nhập vị trí thủ công",
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      console.error("Error in detect location:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xác định vị trí",
        variant: "destructive",
      });
    }
  };

  const searchLocation = async (query: string) => {
    if (!query || query.length < 2) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`,
        { headers: { 'Accept-Language': 'vi,en' } }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.features) {
          setLocationSuggestions(data.features.slice(0, 5));
        }
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      toast({
        title: "Lỗi tìm kiếm",
        description: "Không thể tìm kiếm địa điểm",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = async (location: any) => {
    const properties = location.properties;
    const locationName = [
      properties.city || properties.county || properties.state,
      properties.country
    ].filter(Boolean).join(', ');
    
    form.setValue('location', locationName);
    form.setValue('latitude', properties.lat);
    form.setValue('longitude', properties.lon);
    setLocationSuggestions([]);
    
    // Get timezone for selected location
    try {
      const tzResponse = await fetch(
        `https://api.geoapify.com/v1/timezone?lat=${properties.lat}&lon=${properties.lon}&apiKey=${GEOAPIFY_API_KEY}`
      );
      
      if (tzResponse.ok) {
        const tzData = await tzResponse.json();
        if (tzData.timezone) {
          form.setValue('timezone', tzData.timezone.name);
        }
      }
    } catch (error) {
      console.error("Error fetching timezone:", error);
    }
  };

  const handleFormSubmit = (values: BirthDataFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày sinh</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
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
                  <Input type="time" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm sinh</FormLabel>
                  <div className="relative">
                    <div className="flex gap-2">
                      <FormControl>
                        <div className="relative flex-grow">
                          <Input 
                            {...field}
                            placeholder="Tìm kiếm địa điểm..."
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              searchLocation(e.target.value);
                            }}
                          />
                          {isSearching && (
                            <Search className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={handleDetectLocation}
                      >
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {locationSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
                        {locationSuggestions.map((loc, i) => {
                          const properties = loc.properties;
                          const displayName = [
                            properties.city || properties.county || properties.district || properties.state,
                            properties.country
                          ].filter(Boolean).join(', ');
                          
                          return (
                            <div 
                              key={`${properties.lat}-${properties.lon}-${i}`}
                              className="p-2 hover:bg-accent cursor-pointer flex items-center"
                              onClick={() => selectLocation(loc)}
                            >
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{displayName}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Múi giờ</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn múi giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <div className="hidden">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vĩ độ</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="hidden">
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kinh độ</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.000001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-amber-600 hover:bg-amber-700" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? 'Đang tính toán...' : 'Tính toán bản đồ sao'}
        </Button>
      </form>
    </Form>
  );
};

export default BirthChartForm;
