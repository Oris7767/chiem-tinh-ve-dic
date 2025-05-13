
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation } from 'lucide-react';

export type BirthDetailsFormData = {
  birth_date: string;
  birth_time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  location: string;
};

const defaultFormData: BirthDetailsFormData = {
  birth_date: new Date().toISOString().split('T')[0],
  birth_time: new Date().toTimeString().slice(0, 5),
  latitude: 21.03, // Default to Hanoi
  longitude: 105.85,
  timezone: 'Asia/Ho_Chi_Minh',
  location: 'Hanoi, Vietnam',
};

interface BirthChartFormProps {
  onCalculate: (data: BirthDetailsFormData) => void;
}

const BirthChartForm = ({ onCalculate }: BirthChartFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<BirthDetailsFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof BirthDetailsFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDetectLocation = async () => {
    setIsLoading(true);
    
    try {
      // Try to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            setFormData(prev => ({
              ...prev,
              latitude: lat,
              longitude: lng
            }));
            
            try {
              // Get location name from coordinates using OpenStreetMap Nominatim
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
                { headers: { 'Accept-Language': 'vi,en' } }
              );
              
              if (response.ok) {
                const data = await response.json();
                if (data && data.display_name) {
                  const locationName = data.display_name.split(',').slice(0, 3).join(', ');
                  setFormData(prev => ({
                    ...prev,
                    location: locationName
                  }));
                }
                
                // Try to get timezone from coordinates
                const tzResponse = await fetch(
                  `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`
                );
                
                if (tzResponse.ok) {
                  const tzData = await tzResponse.json();
                  if (tzData && tzData.timeZone) {
                    setFormData(prev => ({
                      ...prev,
                      timezone: tzData.timeZone
                    }));
                  }
                }
              }
            } catch (error) {
              console.error("Error getting location details:", error);
            }
            
            toast({
              title: "Vị trí đã được xác định",
              description: `Vĩ độ: ${lat.toFixed(4)}, Kinh độ: ${lng.toFixed(4)}`,
            });
            
            setIsLoading(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Không thể xác định vị trí",
              description: "Vui lòng nhập vị trí thủ công hoặc kiểm tra quyền truy cập vị trí",
              variant: "destructive",
            });
            setIsLoading(false);
          }
        );
      } else {
        toast({
          title: "Trình duyệt không hỗ trợ",
          description: "Trình duyệt của bạn không hỗ trợ xác định vị trí",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi xác định vị trí",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleLocationSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Search for location using OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'vi,en' } }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const location = data[0];
          setFormData(prev => ({
            ...prev,
            latitude: parseFloat(location.lat),
            longitude: parseFloat(location.lon),
            location: location.display_name.split(',').slice(0, 3).join(', ')
          }));
          
          // Try to get timezone from coordinates
          try {
            const tzResponse = await fetch(
              `https://timeapi.io/api/TimeZone/coordinate?latitude=${location.lat}&longitude=${location.lon}`
            );
            
            if (tzResponse.ok) {
              const tzData = await tzResponse.json();
              if (tzData && tzData.timeZone) {
                setFormData(prev => ({
                  ...prev,
                  timezone: tzData.timeZone
                }));
              }
            }
          } catch (error) {
            console.error("Error getting timezone:", error);
          }
          
          toast({
            title: "Đã tìm thấy vị trí",
            description: location.display_name.split(',').slice(0, 3).join(', '),
          });
        } else {
          toast({
            title: "Không tìm thấy",
            description: "Không tìm thấy vị trí phù hợp với tìm kiếm",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error searching location:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tìm kiếm vị trí",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // If location is entered but not coordinates, try to get coordinates
      if (formData.location && (formData.latitude === 0 || formData.longitude === 0)) {
        await handleLocationSearch(formData.location);
      }
      
      // Call the onCalculate callback with the form data
      onCalculate(formData);
    } catch (error) {
      console.error('Error submitting birth data:', error);
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="birth_date">Ngày sinh</Label>
          <Input
            id="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={(e) => handleChange('birth_date', e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birth_time">Giờ sinh</Label>
          <Input
            id="birth_time"
            type="time"
            value={formData.birth_time}
            onChange={(e) => handleChange('birth_time', e.target.value)}
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Địa điểm sinh</Label>
          <div className="flex space-x-2">
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              onBlur={() => formData.location && handleLocationSearch(formData.location)}
              placeholder="Thành phố, Quốc gia"
              className="w-full"
            />
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              onClick={handleDetectLocation}
              disabled={isLoading}
              title="Phát hiện vị trí hiện tại"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Múi giờ</Label>
          <Select 
            value={formData.timezone} 
            onValueChange={(value) => handleChange('timezone', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn múi giờ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
              <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
              <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
              <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
              <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
              <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="latitude">Vĩ độ</Label>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="longitude">Kinh độ</Label>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
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
  );
};

export default BirthChartForm;
