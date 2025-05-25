// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BirthChartForm, { BirthDataFormValues } from './BirthChartForm';
import { LoginForm, RegisterForm } from './AuthForms';
import { useToast } from "@/components/ui/use-toast";
import { Download, Loader2, LogOut } from 'lucide-react';
import SouthIndianChart from './SouthIndianChart';
import DashaCalculator from './DashaCalculator';
import { calculateVedicChart } from '@/services/vedicAstroService';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { DateTime } from 'luxon';
import { Progress } from "@/components/ui/progress";
import PlanetAspectsTable from './PlanetAspectsTable';
import PlanetDetailsTable from './PlanetDetailsTable';
import HouseDetailsTable from './HouseDetailsTable';
import { birthChartService } from '@/services/birthChartService';

// Types
export interface Aspect {
  planet: string;
  type: string;
  orb: number;
}

export interface NakshatraInfo {
  name: string;
  lord: string;
  startDegree: number;
  endDegree: number;
  pada: number;
}

export interface Planet {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  latitude: number;
  longitudeSpeed: number;
  sign: number;
  house: number;
  retrograde: boolean;
  color: string;
  nakshatra: NakshatraInfo;
  aspectingPlanets: string[];
  aspects: Aspect[];
}

export interface House {
  number: number;
  longitude: number;
  sign: number;
  planets: string[];
}

export interface ChartMetadata {
  ayanamsa: number;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
  houseSystem: string;
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  elapsed?: {
    years: number;
    months: number;
    days: number;
  };
  remaining?: {
    years: number;
    months: number;
    days: number;
  };
  antardasha?: {
    current?: {
      planet: string;
      startDate: string;
      endDate: string;
      elapsed: {
        years: number;
        months: number;
        days: number;
      };
      remaining: {
        years: number;
        months: number;
        days: number;
      };
    };
    sequence: Array<{
      planet: string;
      startDate: string;
      endDate: string;
      pratyantardasha?: Array<{
        planet: string;
        startDate: string;
        endDate: string;
      }>;
    }>;
  };
}

export interface VedicChartData {
  ascendant: number;
  ascendantNakshatra: NakshatraInfo;
  planets: Planet[];
  houses: House[];
  moonNakshatra: string;
  lunarDay: number;
  metadata: ChartMetadata;
  dashas: {
    current: DashaPeriod;
    sequence: DashaPeriod[];
  };
}

const PROGRESS_STAGES = [
  { threshold: 0, message: "Đang khởi tạo yêu cầu..." },
  { threshold: 10, message: "Đang gửi dữ liệu đến máy chủ..." },
  { threshold: 20, message: "Máy chủ đang tính toán vị trí các hành tinh..." },
  { threshold: 40, message: "Đang tính toán các cung hoàng đạo..." },
  { threshold: 60, message: "Đang tính toán các góc chiếu..." },
  { threshold: 80, message: "Đang tổng hợp kết quả..." },
  { threshold: 95, message: "Sắp hoàn thành..." }
];

const VedicChart = () => {
  const { toast } = useToast();
  const [chartData, setChartData] = useState<VedicChartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingIntervalId, setLoadingIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState<BirthDataFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedCharts, setSavedCharts] = useState<any[]>([]);

  // Fetch saved charts when user logs in
  const fetchSavedCharts = async (userId: string) => {
    try {
      const { charts, error } = await birthChartService.getUserCharts(userId);

      if (error) {
        console.error("Error fetching saved charts:", error);
        return;
      }

      if (charts && charts.length > 0) {
        setSavedCharts(charts);
        // Automatically load the most recent chart
        const latestChart = charts[0];
        
        // Reconstruct form data from saved metadata
        setFormData(birthChartService.reconstructFormData(latestChart, user?.email));

        // Reconstruct chart data with all necessary fields
        const reconstructedChartData = birthChartService.reconstructChartData(latestChart);
        setChartData(reconstructedChartData);
        
        toast({
          title: "Bản đồ sao đã được tải",
          description: `Đã tải bản đồ của ${reconstructedChartData.metadata.date} ${reconstructedChartData.metadata.time}`,
        });
      }
    } catch (error) {
      console.error("Error in fetchSavedCharts:", error);
      toast({
        title: "Lỗi khi tải bản đồ",
        description: "Không thể tải bản đồ sao đã lưu. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  // Check for user session and load saved charts
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchSavedCharts(user.id);
      }
    };

    checkSession();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchSavedCharts(session.user.id);
      } else {
        setSavedCharts([]);
        setChartData(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Xử lý loading progress và hủy interval khi component unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalId) {
        clearInterval(loadingIntervalId);
      }
    };
  }, [loadingIntervalId]);

  const handleSubmit = async (formData: BirthDataFormValues) => {
    setIsLoading(true);
    setFormData(formData);
    setLoadingProgress(0);
    setError(null);

    // Initial progress update
    setLoadingProgress(5);

    // Set up loading progress animation with more realistic stages
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Find the next stage based on current progress
        const currentStage = PROGRESS_STAGES.findIndex(stage => prev < stage.threshold);
        if (currentStage === -1) return prev; // Keep at current progress if we're at the end

        const nextStage = PROGRESS_STAGES[currentStage];
        const prevStage = currentStage > 0 ? PROGRESS_STAGES[currentStage - 1] : { threshold: 0 };

        // Calculate progress increment
        const range = nextStage.threshold - prevStage.threshold;
        const increment = range * 0.1; // Move 10% of the way to next stage
        const newProgress = Math.min(prev + increment, nextStage.threshold);

        return newProgress;
      });
    }, 2000); // Update every 2 seconds

    setLoadingIntervalId(progressInterval);

    try {
      console.log("Calculating chart with data:", formData);

      // Call our service to calculate the chart
      const data = await calculateVedicChart({
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        latitude: formData.latitude,
        longitude: formData.longitude,
        timezone: formData.timezone,
        location: formData.location,
        name: formData.name,
        email: formData.email
      });

      console.log("Chart data received:", data);
      setChartData(data);

      // Save chart data if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          const { error: saveError } = await birthChartService.saveChart(user.id, data, formData);

          if (saveError) {
            console.error("Error saving chart:", saveError);
            toast({
              title: "Lưu ý",
              description: "Bản đồ sao đã được tính toán nhưng không thể lưu. Chi tiết lỗi: " + saveError.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Thành công!",
              description: "Bản đồ sao đã được tính toán và lưu vào tài khoản của bạn.",
            });
          }
        } catch (error) {
          console.error("Error in save process:", error);
          toast({
            title: "Lỗi khi lưu",
            description: "Đã xảy ra lỗi trong quá trình lưu bản đồ sao. Vui lòng thử lại sau.",
            variant: "destructive",
          });
        }
      }

      // Set progress to 100% when completed
      setLoadingProgress(100);
    } catch (error) {
      console.error("Error calculating chart:", error);
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định");
      toast({
        title: "Lỗi khi tính toán bản đồ sao",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive",
      });
    } finally {
      if (loadingIntervalId) {
        clearInterval(loadingIntervalId);
      }
      // Hide loading popup
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

  const downloadChartAsSVG = () => {
    if (!chartData) return;

    const svgElement = document.getElementById('birth-chart-svg');
    if (!svgElement) return;

    // Create a clone of the SVG element to modify
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

    // Set the width and height attributes
    svgClone.setAttribute('width', '800');
    svgClone.setAttribute('height', '800');

    // Convert to string
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgClone);

    // Add XML declaration
    if (!source.match(/^<\?xml/)) {
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    }

    // Convert to URL data
    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Create a link and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = url;

    // Generate a filename based on birth data
    const fileName = formData 
      ? `vedic-chart-${formData.name.replace(/\s+/g, '-')}-${formData.birthDate}.svg`
      : 'vedic-birth-chart.svg';

    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Cleanup
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {user ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-amber-100">Xin chào, {user.user_metadata?.name || user.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
          
          {savedCharts.length > 0 && !chartData && (
            <Card>
              <CardHeader>
                <CardTitle>Bản đồ sao đã lưu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedCharts.map((chart, index) => (
                    <Button
                      key={chart.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setChartData({
                          ascendant: 0,
                          ascendantNakshatra: chart.nakshatras.ascendantNakshatra,
                          planets: chart.planets,
                          houses: chart.houses,
                          moonNakshatra: chart.nakshatras.moonNakshatra,
                          lunarDay: 0,
                          metadata: chart.metadata || {},
                          dashas: chart.dashas || { current: {}, sequence: [] }
                        });
                      }}
                    >
                      <span>
                        Bản đồ {index + 1} - {new Date(chart.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[90%] max-w-md">
            <CardHeader>
              <CardTitle>Đang tính toán bản đồ sao...</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={loadingProgress} className="mb-4" />
              <p className="text-sm text-muted-foreground">
                {PROGRESS_STAGES.find(stage => loadingProgress < stage.threshold)?.message || 
                 "Đang hoàn thiện bản đồ sao..."}
              </p>
              {loadingProgress >= 95 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Quá trình này có thể mất đến 2 phút. Vui lòng đợi...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 font-medium">Lỗi: {error}</div>
            <p className="text-sm text-red-400 mt-2">
              Vui lòng kiểm tra thông tin và thử lại. Đảm bảo các tọa độ và múi giờ là chính xác.
            </p>
          </CardContent>
        </Card>
      )}

      {chartData && (
        <Tabs defaultValue="chart">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Bản đồ sao</TabsTrigger>
            <TabsTrigger value="dasha">Vimshottari Dasha</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <ChartDisplay 
              chartData={chartData} 
              userData={formData} 
              onDownload={downloadChartAsSVG} 
            />
          </TabsContent>

          <TabsContent value="dasha">
            {formData && (
              <DashaCalculator 
                chartData={chartData} 
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
  userData?: BirthDataFormValues | null;
  onDownload?: () => void;
}

const ChartDisplay = ({ chartData, userData, onDownload }: ChartDisplayProps) => {
  // Format birth info for display in the chart
  const getBirthInfo = () => {
    if (!userData) return '';

    const birthDate = userData.birthDate ? 
      DateTime.fromISO(userData.birthDate).toFormat('dd/MM/yyyy') : '';

    const birthTime = userData.birthTime || '';

    return `${birthDate} ${birthTime} - ${userData.location}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bản đồ sao</CardTitle>
          {onDownload && (
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Lưu bản đồ
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="aspect-square max-w-full md:max-w-2xl mx-auto">
            <SouthIndianChart 
              chartData={chartData} 
              showDetails={true}
              userName={userData?.name}
              birthInfo={getBirthInfo()}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <PlanetDetailsTable planets={chartData.planets} />
        <HouseDetailsTable houses={chartData.houses} planets={chartData.planets} />
      </div>

      <PlanetAspectsTable planets={chartData.planets} />
    </div>
  );
};

export default VedicChart;