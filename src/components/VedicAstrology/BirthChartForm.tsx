
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export type BirthDetailsFormData = {
  name: string;
  email: string;
  birth_date: string;
  birth_time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  location: string;
};

const defaultFormData: BirthDetailsFormData = {
  name: '',
  email: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate the data
      if (!formData.birth_date || !formData.birth_time) {
        throw new Error('Birth date and time are required');
      }
      
      // Call the onCalculate callback with the form data
      onCalculate(formData);
    } catch (error) {
      console.error('Error submitting birth data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
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
          <Label htmlFor="name">Họ và tên</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập họ và tên của bạn"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Nhập địa chỉ email của bạn"
            className="w-full"
          />
        </div>
        
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
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Thành phố, Quốc gia"
            className="w-full"
          />
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
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            value={formData.latitude}
            onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="longitude">Kinh độ</Label>
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
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? 'Đang tính toán...' : 'Tính toán bản đồ'}
      </Button>
    </form>
  );
};

export default BirthChartForm;
