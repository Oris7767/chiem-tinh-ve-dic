import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChartStore } from '../../store/chartStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function BirthChartForm() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [latitude, setLatitude] = useState<number | ''>('');
  const [longitude, setLongitude] = useState<number | ''>('');
  const [timezone, setTimezone] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const { isAuthenticated } = useAuthStore();
  const { calculateChart, saveChart, isLoading, error } = useChartStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!latitude || !longitude) {
      alert('Vui lòng nhập vĩ độ và kinh độ');
      return;
    }
    
    const chartData = {
      name,
      birthDate,
      birthTime,
      birthPlace,
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone,
      isPublic
    };
    
    if (isAuthenticated) {
      // Nếu đã đăng nhập, lưu chart
      await saveChart(chartData);
      if (!error) {
        navigate('/dashboard/charts');
      }
    } else {
      // Nếu chưa đăng nhập, chỉ tính toán chart
      const result = await calculateChart(chartData);
      if (result) {
        // Lưu kết quả vào localStorage để hiển thị
        localStorage.setItem('tempChart', JSON.stringify(result));
        navigate('/chart-result');
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Tạo lá số chiêm tinh
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Tên lá số</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lá số của tôi"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Ngày sinh</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthTime">Giờ sinh</Label>
              <Input
                id="birthTime"
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthPlace">Nơi sinh</Label>
            <Input
              id="birthPlace"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="Hà Nội, Việt Nam"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Vĩ độ</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value ? Number(e.target.value) : '')}
                placeholder="21.0278"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Kinh độ</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value ? Number(e.target.value) : '')}
                placeholder="105.8342"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Múi giờ</Label>
            <Input
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="Asia/Ho_Chi_Minh"
              required
            />
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              />
              <Label htmlFor="isPublic" className="text-sm font-medium leading-none cursor-pointer">
                Công khai lá số này
              </Label>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang tính toán...' : 'Tạo lá số'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
