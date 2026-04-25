// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BirthChartForm, { BirthDataFormValues } from './BirthChartForm';
import { LoginForm, RegisterForm } from './AuthForms';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut, FileText } from 'lucide-react';
import SouthIndianChart from './SouthIndianChart';
import DashaCalculator from './DashaCalculator';
import VargasCharts from './VargasCharts';
import { calculateVedicChart } from '@/services/vedicAstroService';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { DateTime } from 'luxon';
import { generatePDFFromAppData } from '@/pdf';
import { calculateAllVargas } from '@/utils/vargaCalculations';
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
  const [showModernPlanets, setShowModernPlanets] = useState(false);

  // Fetch saved charts when user logs in
  const fetchSavedCharts = async (userId: string) => {
    try {
      console.log("Fetching saved charts for user:", userId);
      const { charts, error } = await birthChartService.getUserCharts(userId);

      if (error) {
        console.error("Error fetching saved charts:", error);
        toast({
          title: "Lỗi khi tải bản đồ",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      console.log("Fetched charts:", charts);
      if (charts && charts.length > 0) {
        setSavedCharts(charts);
        // Automatically load the most recent chart
        const latestChart = charts[0];
        console.log("Loading latest chart:", latestChart);
        
        try {
          // Reconstruct form data from saved metadata
          const formData = birthChartService.reconstructFormData(latestChart, user?.email);
          console.log("Reconstructed form data:", formData);
          setFormData(formData);

          // Reconstruct chart data with all necessary fields
          const reconstructedChartData = birthChartService.reconstructChartData(latestChart);
          console.log("Reconstructed chart data:", reconstructedChartData);
          setChartData(reconstructedChartData);
          
          toast({
            title: "Bản đồ sao đã được tải",
            description: `Đã tải bản đồ của ${reconstructedChartData.metadata.date} ${reconstructedChartData.metadata.time}`,
          });
        } catch (reconstructError) {
          console.error("Error reconstructing chart data:", reconstructError);
          toast({
            title: "Lỗi khi tải bản đồ",
            description: "Dữ liệu bản đồ không hợp lệ hoặc bị hỏng",
            variant: "destructive"
          });
        }
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
      console.log("Checking user session...");
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error getting user:", error);
        return;
      }

      console.log("Current user:", user);
      setUser(user);
      
      if (user?.id) {
        console.log("User is logged in, fetching saved charts...");
        await fetchSavedCharts(user.id);
      }
    };

    checkSession();

    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user);
      setUser(session?.user ?? null);
      
      if (session?.user?.id) {
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

      // Temporarily disable saving chart data while auth UI is hidden
      /* 
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
      */

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

  const downloadAsPDFFile = async () => {
    if (!chartData) {
      toast({
        title: "Lỗi",
        description: "Không có dữ liệu biểu đồ để tải xuống.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting PDF download with new PDF module...');
      
      // Calculate Varga charts
      const planetsInput = chartData.planets.map(planet => ({
        id: planet.id,
        name: planet.name,
        longitude: parseFloat(String(planet.longitude)) || 0,
        house: planet.house,
        sign: planet.sign,
        retrograde: planet.retrograde,
      }));
      
      const vargaCharts = calculateAllVargas(
        planetsInput,
        parseFloat(String(chartData.ascendant)) || 0
      );

      // Prepare Varga data for PDF
      const vargas = [
        { id: 'D1', planets: vargaCharts.D1.planets, ascendantSign: vargaCharts.D1.ascendantSign },
        { id: 'D2', planets: vargaCharts.D2.planets, ascendantSign: vargaCharts.D2.ascendantSign },
        { id: 'D3', planets: vargaCharts.D3.planets, ascendantSign: vargaCharts.D3.ascendantSign },
        { id: 'D4', planets: vargaCharts.D4.planets, ascendantSign: vargaCharts.D4.ascendantSign },
        { id: 'D7', planets: vargaCharts.D7.planets, ascendantSign: vargaCharts.D7.ascendantSign },
        { id: 'D9', planets: vargaCharts.D9.planets, ascendantSign: vargaCharts.D9.ascendantSign },
        { id: 'D10', planets: vargaCharts.D10.planets, ascendantSign: vargaCharts.D10.ascendantSign },
        { id: 'D12', planets: vargaCharts.D12.planets, ascendantSign: vargaCharts.D12.ascendantSign },
        { id: 'D16', planets: vargaCharts.D16.planets, ascendantSign: vargaCharts.D16.ascendantSign },
        { id: 'D20', planets: vargaCharts.D20.planets, ascendantSign: vargaCharts.D20.ascendantSign },
        { id: 'D24', planets: vargaCharts.D24.planets, ascendantSign: vargaCharts.D24.ascendantSign },
        { id: 'D27', planets: vargaCharts.D27.planets, ascendantSign: vargaCharts.D27.ascendantSign },
        { id: 'D30', planets: vargaCharts.D30.planets, ascendantSign: vargaCharts.D30.ascendantSign },
        { id: 'D40', planets: vargaCharts.D40.planets, ascendantSign: vargaCharts.D40.ascendantSign },
        { id: 'D45', planets: vargaCharts.D45.planets, ascendantSign: vargaCharts.D45.ascendantSign },
        { id: 'D60', planets: vargaCharts.D60.planets, ascendantSign: vargaCharts.D60.ascendantSign },
      ];

      // Generate PDF with new module
      await generatePDFFromAppData(
        chartData,
        formData,
        { vargas }
      );
      
      toast({
        title: "Tải xuống thành công",
        description: "Bản đồ sao đã được tải về dạng PDF đẹp, dễ in và chia sẻ.",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Lỗi tải xuống",
        description: error instanceof Error ? error.message : "Không thể tải file PDF. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Temporarily hide auth UI
      {user ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-votive-bg">Xin chào, {user.user_metadata?.name || user.email}</p>
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
                          ascendant: chart.ascendant || 0,
                          ascendantNakshatra: chart.nakshatras?.ascendantNakshatra || {
                            name: '',
                            lord: '',
                            startDegree: 0,
                            endDegree: 0,
                            pada: 1
                          },
                          planets: chart.planets || [],
                          houses: chart.houses || [],
                          moonNakshatra: chart.nakshatras?.moonNakshatra || '',
                          lunarDay: chart.lunarDay || 0,
                          metadata: chart.metadata || {
                            ayanamsa: 24,
                            date: '',
                            time: '',
                            latitude: 0,
                            longitude: 0,
                            timezone: 'UTC',
                            houseSystem: 'W'
                          },
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
      */}

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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">Bản đồ sao</TabsTrigger>
            <TabsTrigger value="dasha">Vimshottari Dasha</TabsTrigger>
            <TabsTrigger value="vargas">16 Vargas</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <ChartDisplay 
              chartData={chartData} 
              userData={formData} 
              onDownloadPDF={downloadAsPDFFile}
              showModernPlanets={showModernPlanets}
              onToggleModernPlanets={setShowModernPlanets}
            />
          </TabsContent>

          <TabsContent value="dasha">
            {formData && (
              <DashaCalculator 
                chartData={chartData} 
              />
            )}
          </TabsContent>

          <TabsContent value="vargas">
            <VargasCharts 
              chartData={chartData} 
              showModernPlanets={showModernPlanets}
              onToggleModernPlanets={setShowModernPlanets}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

interface ChartDisplayProps {
  chartData: VedicChartData;
  userData?: BirthDataFormValues | null;
  onDownloadPDF?: () => void;
  showModernPlanets?: boolean;
  onToggleModernPlanets?: (show: boolean) => void;
}

const ChartDisplay = ({ chartData, userData, onDownloadPDF, showModernPlanets, onToggleModernPlanets }: ChartDisplayProps) => {
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
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Bản đồ sao</CardTitle>
          <div className="flex flex-wrap items-center gap-4">
            {/* Modern Planets Toggle */}
            {onToggleModernPlanets && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Hành tinh hiện đại:</span>
                <button
                  onClick={() => onToggleModernPlanets(!showModernPlanets)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    showModernPlanets ? 'bg-primary' : 'bg-input'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-background shadow-lg transition-transform ${
                      showModernPlanets ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-sm text-muted-foreground">
                  {showModernPlanets ? 'Bật' : 'Tắt'}
                </span>
              </div>
            )}
            {onDownloadPDF && (
              <Button variant="outline" size="sm" onClick={onDownloadPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Tải PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-square max-w-full md:max-w-2xl mx-auto">
            <SouthIndianChart 
              chartData={chartData} 
              showDetails={true}
              userName={userData?.name}
              birthInfo={getBirthInfo()}
              showModernPlanets={showModernPlanets}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <PlanetDetailsTable planets={chartData.planets} showModernPlanets={showModernPlanets} />
        <HouseDetailsTable houses={chartData.houses} planets={chartData.planets} showModernPlanets={showModernPlanets} />
      </div>

      <PlanetAspectsTable planets={chartData.planets} showModernPlanets={showModernPlanets} />
    </div>
  );
};

export default VedicChart;