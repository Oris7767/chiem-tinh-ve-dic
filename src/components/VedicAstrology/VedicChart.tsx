
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BirthChartForm, { BirthDetailsFormData } from './BirthChartForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import SouthIndianChart from './SouthIndianChart';

// Define chart data types
interface Planet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  house: number;
  sign: number;
  retrograde: boolean;
  color: string;
}

interface House {
  number: number;
  longitude: number;
  sign: number;
}

interface VedicChartData {
  ascendant: number;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
}

const VedicChart = () => {
  const { toast } = useToast();
  const [chartData, setChartData] = useState<VedicChartData | null>(null);
  const [chartStyle, setChartStyle] = useState<'North Indian' | 'South Indian'>('South Indian');
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async (formData: BirthDetailsFormData) => {
    setIsLoading(true);
    
    try {
      console.log("Calculating chart with data:", formData);
      
      // Call the Supabase Edge Function to calculate the chart
      const { data, error } = await supabase.functions.invoke('calculate-vedic-chart', {
        body: {
          birth_date: formData.birth_date,
          birth_time: formData.birth_time,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone: formData.timezone,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message || "Lỗi khi tính toán bản đồ sao");
      }

      console.log("Received chart data:", data);
      setChartData(data);
      
      toast({
        title: "Bản đồ sao đã được tính toán thành công!",
        description: `${formData.birth_date} ${formData.birth_time} tại ${formData.location}`,
      });
    } catch (error) {
      console.error("Error calculating chart:", error);
      toast({
        title: "Lỗi khi tính toán bản đồ sao",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Constants for zodiac signs and planets
  const SIGNS = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
    "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
    "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
    "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Tạo bản đồ sao chiêm tinh Vệ Đà</CardTitle>
        </CardHeader>
        <CardContent>
          <BirthChartForm onCalculate={handleCalculate} />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2 text-amber-700">Đang tính toán bản đồ sao...</span>
        </div>
      )}

      {chartData && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bản đồ sao</CardTitle>
              <Select value={chartStyle} onValueChange={(value: any) => setChartStyle(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Kiểu bản đồ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="South Indian">Nam Ấn</SelectItem>
                  <SelectItem value="North Indian">Bắc Ấn</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="aspect-square max-w-full md:max-w-xl mx-auto">
                {chartStyle === 'South Indian' ? (
                  <SouthIndianChart chartData={chartData} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Sparkles className="h-12 w-12 text-amber-500 animate-pulse" />
                    <p className="text-amber-700 ml-2">Bản đồ Bắc Ấn đang được phát triển...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết bản đồ sao</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="planets">
                <TabsList className="mb-4">
                  <TabsTrigger value="planets">Các hành tinh</TabsTrigger>
                  <TabsTrigger value="houses">Các cung</TabsTrigger>
                  <TabsTrigger value="details">Chi tiết</TabsTrigger>
                </TabsList>
                
                <TabsContent value="planets">
                  <div className="space-y-1">
                    {chartData.planets.map((planet) => (
                      <div key={planet.id} className="flex items-center justify-between p-2 border-b">
                        <div className="flex items-center">
                          <span 
                            className="text-xl mr-2" 
                            style={{ color: planet.color }}
                          >
                            {planet.symbol}
                          </span>
                          <span>{planet.name}</span>
                          {planet.retrograde && <span className="ml-2 text-red-500">R</span>}
                        </div>
                        <div className="text-right">
                          <div>{SIGNS[planet.sign]}</div>
                          <div className="text-sm text-gray-500">
                            Cung {planet.house} • {planet.longitude.toFixed(2)}°
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="houses">
                  <div className="space-y-1">
                    {chartData.houses.map((house) => (
                      <div key={house.number} className="flex items-center justify-between p-2 border-b">
                        <div>Cung {house.number}</div>
                        <div className="text-right">
                          <div>{SIGNS[house.sign]}</div>
                          <div className="text-sm text-gray-500">{house.longitude.toFixed(2)}°</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold">Ascendant (Lagna)</h3>
                      <p>{SIGNS[Math.floor(chartData.ascendant / 30)]} • {chartData.ascendant.toFixed(2)}°</p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold">Nakshatra của Mặt Trăng</h3>
                      <p>{chartData.moonNakshatra}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold">Ngày Âm lịch (Tithi)</h3>
                      <p>{chartData.lunarDay}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VedicChart;
