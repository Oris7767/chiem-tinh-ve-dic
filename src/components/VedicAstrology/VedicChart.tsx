
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BirthChartForm, { BirthDataFormValues } from './BirthChartForm';
import { LoginForm, RegisterForm } from './AuthForms';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut } from 'lucide-react';
import SouthIndianChart from './SouthIndianChart';
import DashaCalculator from './DashaCalculator';
import { calculateVedicChart } from '@/services/vedicAstroService';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';

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
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState<BirthDataFormValues | null>(null);
  
  // Check for user session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkSession();
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (formData: BirthDataFormValues) => {
    setIsLoading(true);
    setFormData(formData);
    
    try {
      console.log("Calculating chart with data:", formData);
      
      // Call our service to calculate the chart
      const data = await calculateVedicChart(formData);
      
      console.log("Chart data received:", data);
      setChartData(data);
      
      // If user is logged in, save the chart data to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save birth chart data
        const { error: chartError } = await supabase.from('birth_charts').insert({
          user_id: user.id,
          planets: data.planets,
          houses: data.houses,
          nakshatras: { moonNakshatra: data.moonNakshatra }
        });
        
        if (chartError) {
          console.error("Error saving chart data:", chartError);
        }
      }
      
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Đã đăng xuất",
      description: "Đăng xuất thành công khỏi tài khoản của bạn.",
    });
  };

  const handleAuthSuccess = () => {
    toast({
      title: "Xin chào!",
      description: "Bạn đã đăng nhập thành công.",
    });
  };

  return (
    <div className="space-y-8">
      {user ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-amber-100">Xin chào, {user.user_metadata?.name || user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="login" value={authMode} onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={handleAuthSuccess} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSuccess={() => setAuthMode('login')} />
          </TabsContent>
        </Tabs>
      )}

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
        <Tabs defaultValue="chart">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Bản đồ sao</TabsTrigger>
            <TabsTrigger value="dasha">Vimshottari Dasha</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <ChartDisplay chartData={chartData} />
          </TabsContent>
          
          <TabsContent value="dasha">
            {formData && (
              <DashaCalculator 
                chartData={chartData} 
                birthDate={formData.birthDate}
                birthTime={formData.birthTime}
                timeZone={formData.timezone}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

interface ChartDisplayProps {
  chartData: VedicChartData;
}

const ChartDisplay = ({ chartData }: ChartDisplayProps) => {
  // Constants for zodiac signs (with shorter abbreviations)
  const SIGNS = [
    "Ari (Aries)", "Tau (Taurus)", "Gem (Gemini)", 
    "Can (Cancer)", "Leo (Leo)", "Vir (Virgo)",
    "Lib (Libra)", "Sco (Scorpio)", "Sag (Sagittarius)", 
    "Cap (Capricorn)", "Aqu (Aquarius)", "Pis (Pisces)"
  ];
  
  // Planet abbreviations
  const getPlanetAbbr = (name: string) => {
    const map: Record<string, string> = {
      "Sun": "Su",
      "Moon": "Mo",
      "Mercury": "Me",
      "Venus": "Ve",
      "Mars": "Ma",
      "Jupiter": "Ju",
      "Saturn": "Sa",
      "Rahu": "Ra",
      "Ketu": "Ke"
    };
    return map[name] || name.substring(0, 2);
  };

  // Calculate degrees within sign (0-29.99)
  const getDegreesInSign = (longitude: number) => {
    return (longitude % 30).toFixed(2);
  };

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
                      <span className="font-semibold text-lg mr-2">
                        {getPlanetAbbr(planet.name)}
                      </span>
                      <span>{planet.name}</span>
                    </div>
                    <div className="text-right">
                      <div>{SIGNS[planet.sign]}</div>
                      <div className="text-sm text-gray-500">
                        Cung {planet.house} • {getDegreesInSign(planet.longitude)}° ({planet.longitude.toFixed(2)}°)
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
                    <div>Cung {house.number}{house.number === 1 ? " (Asc)" : ""}</div>
                    <div className="text-right">
                      <div>{SIGNS[house.sign]}</div>
                      <div className="text-sm text-gray-500">{getDegreesInSign(house.longitude)}° ({house.longitude.toFixed(2)}°)</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Ascendant (Lagna)</h3>
                  <p>{SIGNS[Math.floor(chartData.ascendant / 30)]} • {getDegreesInSign(chartData.ascendant)}° ({chartData.ascendant.toFixed(2)}°)</p>
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
