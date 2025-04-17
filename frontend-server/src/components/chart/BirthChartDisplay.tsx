import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChartStore } from '../../store/chartStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';

export function BirthChartDisplay() {
  const { id } = useParams<{ id: string }>();
  const { currentChart, getChartById, isLoading, error } = useChartStore();
  const [activeTab, setActiveTab] = useState('chart');
  
  // Nếu không có id, thử lấy chart từ localStorage (cho người dùng chưa đăng nhập)
  const [tempChart, setTempChart] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      getChartById(id);
    } else {
      // Lấy chart tạm thời từ localStorage
      const storedChart = localStorage.getItem('tempChart');
      if (storedChart) {
        setTempChart(JSON.parse(storedChart));
      }
    }
  }, [id, getChartById]);
  
  const chartData = id ? (currentChart?.chart_data || null) : tempChart;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!chartData) {
    return (
      <Alert>
        <AlertDescription>Không tìm thấy dữ liệu lá số.</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
     <CardHeader>
      <CardTitle className="text-2xl font-bold text-center">
       {currentChart?.name || tempChart?.name || 'Lá số chiêm tinh'}
      </CardTitle>
    </CardHeader>
    <CardContent>
     <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="chart">Lá số</TabsTrigger>
        <TabsTrigger value="planets">Hành tinh</TabsTrigger>
        <TabsTrigger value="houses">Cung</TabsTrigger>
        <TabsTrigger value="aspects">Góc chiếu</TabsTrigger>
      </TabsList>

      <TabsContent value="chart" className="mt-4">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-center text-gray-500">
            Biểu đồ lá số sẽ được hiển thị ở đây
          </p>
        </div>
      </TabsContent>

      <TabsContent value="planets" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Hành tinh</th>
                <th className="p-2 text-left">Cung</th>
                <th className="p-2 text-left">Độ</th>
                <th className="p-2 text-left">Tốc độ</th>
              </tr>
            </thead>
            <tbody>
              {chartData.planets.map((planet: any, index: number) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{planet.name}</td>
                  <td className="p-2">{planet.sign}</td>
                  <td className="p-2">{planet.position.toFixed(2)}°</td>
                  <td className="p-2">{planet.speed.toFixed(4)}°/day</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="houses" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Cung</th>
                <th className="p-2 text-left">Dấu hiệu</th>
                <th className="p-2 text-left">Độ</th>
              </tr>
            </thead>
            <tbody>
              {chartData.houses.map((house: any, index: number) => (
                <tr key={index} className="border-t">
                  <td className="p-2">Cung {house.number}</td>
                  <td className="p-2">{house.sign}</td>
                  <td className="p-2">{house.position.toFixed(2)}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="aspects" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Hành tinh 1</th>
                <th className="p-2 text-left">Hành tinh 2</th>
                <th className="p-2 text-left">Góc chiếu</th>
                <th className="p-2 text-left">Orb</th>
              </tr>
            </thead>
            <tbody>
              {chartData.aspects.map((aspect: any, index: number) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{aspect.planet1}</td>
                  <td className="p-2">{aspect.planet2}</td>
                  <td className="p-2">{aspect.type} ({aspect.angle}°)</td>
                  <td className="p-2">{aspect.orb}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
  );
}
// Đoạn mã này là một component React sử dụng TypeScript để hiển thị lá số chiêm tinh.
// Nó sử dụng các thư viện như React Router để quản lý routing và Zustand để quản lý trạng thái.    
