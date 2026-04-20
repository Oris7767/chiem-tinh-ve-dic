import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MatchmakingForm, { MatchmakingFormValues } from './MatchmakingForm';
import MatchmakingChart from './MatchmakingChart';
import { calculateVedicChart } from '@/services/vedicAstroService';
import { calculateAshtakoota } from '@/utils/AshtakootEngine';
import { VedicChartData } from './VedicChart';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const PROGRESS_STAGES = [
  { threshold: 0, message: 'Đang khởi tạo yêu cầu...' },
  { threshold: 15, message: 'Đang gửi dữ liệu bên Nam...' },
  { threshold: 35, message: 'Đang tính toán bản đồ sao bên Nam...' },
  { threshold: 50, message: 'Đang gửi dữ liệu bên Nữ...' },
  { threshold: 70, message: 'Đang tính toán bản đồ sao bên Nữ...' },
  { threshold: 85, message: 'Đang so sánh tương hợp...' },
  { threshold: 95, message: 'Sắp hoàn thành...' }
];

interface MatchmakingResult {
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  compatibilityLevel: string;
  compatibilityDescription: string;
  kootaBreakdown: any[];
  doshas: any[];
  hasDoshas: boolean;
  totalDoshas: number;
  parihars: any[];
  hasParihar: boolean;
  recommendations: any[];
  boyDetails: any;
  girlDetails: any;
}

const MatchmakingPage = () => {
  const { toast } = useToast();
  const [result, setResult] = useState<MatchmakingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [maleChartData, setMaleChartData] = useState<VedicChartData | null>(null);
  const [femaleChartData, setFemaleChartData] = useState<VedicChartData | null>(null);

  const updateProgress = (progress: number) => {
    const currentStage = PROGRESS_STAGES.findIndex(stage => progress < stage.threshold);
    const prevStage = currentStage > 0 ? PROGRESS_STAGES[currentStage - 1] : { threshold: 0 };
    setLoadingMessage(currentStage >= 0 ? PROGRESS_STAGES[Math.max(0, currentStage - 1)]?.message || 'Đang xử lý...' : 'Hoàn thành!');
  };

  const handleSubmit = async (data: MatchmakingFormValues) => {
    setIsLoading(true);
    setResult(null);
    setLoadingProgress(0);
    setLoadingMessage(PROGRESS_STAGES[0].message);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const nextStage = PROGRESS_STAGES.find(stage => prev < stage.threshold);
        if (!nextStage) {
          clearInterval(progressInterval);
          return prev;
        }
        
        const currentStageIndex = PROGRESS_STAGES.indexOf(nextStage);
        const prevStage = currentStageIndex > 0 ? PROGRESS_STAGES[currentStageIndex - 1] : { threshold: 0 };
        const increment = (nextStage.threshold - prevStage.threshold) * 0.15;
        const newProgress = Math.min(prev + increment, nextStage.threshold);
        
        updateProgress(newProgress);
        return newProgress;
      });
    }, 500);

    try {
      // Step 1: Calculate male chart
      setLoadingProgress(15);
      setLoadingMessage(PROGRESS_STAGES[1].message);

      const maleChart = await calculateVedicChart({
        birthDate: data.male.birthDate,
        birthTime: data.male.birthTime,
        latitude: data.male.latitude,
        longitude: data.male.longitude,
        timezone: data.male.timezone,
        location: data.male.location,
        name: data.male.name,
      });

      setMaleChartData(maleChart);
      setLoadingProgress(50);
      setLoadingMessage(PROGRESS_STAGES[3].message);

      // Step 2: Calculate female chart
      const femaleChart = await calculateVedicChart({
        birthDate: data.female.birthDate,
        birthTime: data.female.birthTime,
        latitude: data.female.latitude,
        longitude: data.female.longitude,
        timezone: data.female.timezone,
        location: data.female.location,
        name: data.female.name,
      });

      setFemaleChartData(femaleChart);
      setLoadingProgress(80);
      setLoadingMessage(PROGRESS_STAGES[5].message);

      // Step 3: Extract Moon positions and calculate compatibility
      const maleMoon = extractMoonPosition(maleChart);
      const femaleMoon = extractMoonPosition(femaleChart);

      console.log('Male Moon:', maleMoon);
      console.log('Female Moon:', femaleMoon);

      const compatibilityResult = calculateAshtakoota(maleMoon, femaleMoon);

      setLoadingProgress(95);
      setLoadingMessage(PROGRESS_STAGES[6].message);

      setResult(compatibilityResult);

      toast({
        title: 'Tính toán hoàn tất!',
        description: `Điểm tương hợp: ${compatibilityResult.percentage}%`,
      });

    } catch (error) {
      console.error('Error calculating compatibility:', error);
      toast({
        title: 'Lỗi tính toán',
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định',
        variant: 'destructive',
      });
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setLoadingProgress(100);
      setLoadingMessage('Hoàn thành!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
          Bản Đồ Sao Cặp Đôi
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Kiểm tra tương hợp hôn nhân theo chiêm tinh Vệ Đà thông qua 8 yếu tố Ashta Koota
        </p>
      </div>

      {/* Form Section */}
      {!result && (
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Nhập Thông Tin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MatchmakingForm onSubmit={handleSubmit} isLoading={isLoading} />
            
            {/* Loading State */}
            {isLoading && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingMessage}</span>
                </div>
                <Progress value={loadingProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {result && (
        <>
          {/* Back Button */}
          <div className="max-w-5xl mx-auto mb-6">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Kiểm tra cặp đôi khác</span>
            </button>
          </div>

          {/* Results Chart */}
          <MatchmakingChart 
            result={result} 
            maleName="Bên Nam" 
            femaleName="Bên Nữ" 
          />

          {/* Raw Chart Data for Debug (optional) */}
          {(maleChartData || femaleChartData) && (
            <details className="max-w-5xl mx-auto mt-6">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Xem chi tiết bản đồ sao
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {maleChartData && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Bản đồ sao bên Nam</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <p>Ascendant: {maleChartData.ascendant}</p>
                      <p>Moon Nakshatra: {maleChartData.moonNakshatra}</p>
                      <p>Hành tinh: {maleChartData.planets.map(p => p.name).join(', ')}</p>
                    </CardContent>
                  </Card>
                )}
                {femaleChartData && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Bản đồ sao bên Nữ</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-1">
                      <p>Ascendant: {femaleChartData.ascendant}</p>
                      <p>Moon Nakshatra: {femaleChartData.moonNakshatra}</p>
                      <p>Hành tinh: {femaleChartData.planets.map(p => p.name).join(', ')}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </details>
          )}
        </>
      )}

      {/* Info Section */}
      <Card className="max-w-3xl mx-auto mt-8 bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Về Ashta Koota
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ashta Koota (अष्टकोट) là hệ thống 8 yếu tố được sử dụng trong Chiêm Tinh Vệ Đà 
            để đánh giá sự tương hợp của hai người trong hôn nhân. Mỗi yếu tố đại diện cho một 
            khía cạnh khác nhau của mối quan hệ.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Varna (1)</span>
              <p className="text-muted-foreground">Đẳng cấp tinh thần</p>
            </div>
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Vashya (2)</span>
              <p className="text-muted-foreground">Tương thích sinh vật</p>
            </div>
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Gana (6)</span>
              <p className="text-muted-foreground">Tính cách</p>
            </div>
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Graha Maitri (5)</span>
              <p className="text-muted-foreground">Hành tinh bạn bè</p>
            </div>
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Yoni (4)</span>
              <p className="text-muted-foreground">Tương thích tạng thú</p>
            </div>
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Nadi (8)</span>
              <p className="text-muted-foreground">Năng lượng sinh sản</p>
            </div>
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Rashi (7)</span>
              <p className="text-muted-foreground">Cung hoàng đạo</p>
            </div>
            <div className="p-2 bg-background rounded">
              <span className="font-medium">Rajju (5)</span>
              <p className="text-muted-foreground">Dây liên kết vũ trụ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchmakingPage;
