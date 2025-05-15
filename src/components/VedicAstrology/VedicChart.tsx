
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BirthChartForm, { BirthDataFormValues } from './BirthChartForm';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import SouthIndianChart from './SouthIndianChart';
import { calculateVedicChart } from '@/services/vedicAstroService';
import { supabase } from "@/integrations/supabase/client"; // Fixed import to use the correct export name

// Types
export interface Planet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  sign: number;
  house: number;
  retrograde: boolean;
  color: string;
}

export interface House {
  number: number;
  longitude: number;
  sign: number;
}

export interface VedicChartData {
  ascendant: number;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
}

const VedicChart = () => {
  const { toast } = useToast();
  const [chartData, setChartData] = useState<VedicChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: BirthDataFormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Calculating chart with data:", formData);
      
      // Call our service to calculate the chart
      const data = await calculateVedicChart(formData);
      
      console.log("Chart data received:", data);
      setChartData(data);
      
      toast({
        title: "Bản đồ sao đã được tính toán thành công!",
        description: `${formData.birthDate} ${formData.birthTime} tại ${formData.location}`,
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Tạo bản đồ sao chiêm tinh Vệ Đà</CardTitle>
        </CardHeader>
        <CardContent>
          <BirthChartForm onSubmit={handleSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2 text-amber-700">Đang tính toán bản đồ sao...</span>
        </div>
      )}

      {chartData && (
        <ChartDisplay chartData={chartData} />
      )}
    </div>
  );
};

interface ChartDisplayProps {
  chartData: VedicChartData;
}

const ChartDisplay = ({ chartData }: ChartDisplayProps) => {
  // Constants for zodiac signs
  const SIGNS = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
    "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
    "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
    "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bản đồ sao</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square max-w-full md:max-w-xl mx-auto">
            <SouthIndianChart chartData={chartData} />
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
                      <span className="font-semibold text-lg mr-2" style={{ color: planet.color }}>
                        {planet.symbol}
                      </span>
                      <span>{planet.name}</span>
                    </div>
                    <div className="text-right">
                      <div>{SIGNS[planet.sign]}</div>
                      <div className="text-sm text-gray-500">
                        Cung {planet.house} • {planet.longitude.toFixed(2)}°
                        {planet.retrograde && <span className="ml-1 text-red-500">R</span>}
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
                  <h3 className="font-bold">Ngày âm lịch (Tithi)</h3>
                  <p>{chartData.lunarDay}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VedicChart;
