import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface KootaResult {
  name: string;
  maxPoints: number;
  baseScore: number;
  points: number;
  description: string;
  dosha: {
    type: string;
    severity: string;
    description: string;
  } | null;
  parihar: {
    active: boolean;
    reason: string;
    overridden: boolean;
  } | null;
}

interface Dosha {
  koota: string;
  type: string;
  severity: string;
  description: string;
}

interface Parihar {
  koota: string;
  active: boolean;
  reason: string;
}

interface Recommendation {
  priority: string;
  title: string;
  description: string;
  remedy: string | null;
  details?: string;
}

interface MatchmakingResult {
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  totalBaseScore: number;
  compatibilityLevel: string;
  compatibilityDescription: string;
  kootaBreakdown: KootaResult[];
  doshas: Dosha[];
  hasDoshas: boolean;
  totalDoshas: number;
  parihars: Parihar[];
  hasParihar: boolean;
  recommendations: Recommendation[];
  boyDetails: {
    rashi: { name: string; nameVN: string; lord: string };
    nakshatra: { name: string; gana: string; yoni: string; nadi: string };
    rashiNum: number;
    nakshatraNum: number;
    pada: number;
  };
  girlDetails: {
    rashi: { name: string; nameVN: string; lord: string };
    nakshatra: { name: string; gana: string; yoni: string; nadi: string };
    rashiNum: number;
    nakshatraNum: number;
    pada: number;
  };
}

interface MatchmakingChartProps {
  result: MatchmakingResult;
  maleName: string;
  femaleName: string;
}

// Koota display names in Vietnamese
const KOOTA_NAMES: Record<string, string> = {
  'Varna Koota': '1. Varna - Đẳng cấp',
  'Vashya Koota': '2. Vashya - Sinh vật',
  'Tara Koota': '3. Tara - Sao may mắn',
  'Yoni Koota': '4. Yoni - Tạng thú',
  'Graha Maitri Koota': '5. Graha Maitri - Hành tinh',
  'Gana Koota': '6. Gana - Tính cách',
  'Bhakoot Koota': '7. Bhakoot - Cung hoàng đạo',
  'Nadi Koota': '8. Nadi - Năng lượng',
};

// Priority colors
const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-800 border-red-200',
  High: 'bg-orange-100 text-orange-800 border-orange-200',
  Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Info: 'bg-blue-100 text-blue-800 border-blue-200',
  Positive: 'bg-green-100 text-green-800 border-green-200',
};

// Compatibility level colors
const COMPAT_LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Excellent: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' },
  Good: { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200' },
  Moderate: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200' },
  Poor: { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' },
};

const MatchmakingChart = ({ result, maleName, femaleName }: MatchmakingChartProps) => {
  const levelColors = COMPAT_LEVEL_COLORS[result.compatibilityLevel] || COMPAT_LEVEL_COLORS.Moderate;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with overall score */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <div className={`h-2 ${levelColors.bg}`} />
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-serif">
            Kết Quả Tương Hợp
          </CardTitle>
          <p className="text-muted-foreground">
            {maleName} & {femaleName}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score Circle */}
          <div className="flex justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  strokeWidth="12"
                  stroke="currentColor"
                  className="text-muted"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className={result.percentage >= 75 ? 'text-primary' : result.percentage >= 50 ? 'text-yellow-500' : 'text-red-500'}
                  fill="none"
                  strokeDasharray={`${(result.percentage / 100) * 440} 440`}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{result.percentage}%</span>
                <span className="text-sm text-muted-foreground">
                  {result.totalPoints}/{result.maxPoints} điểm
                </span>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Điểm gốc:</span>
              <span className="font-medium">{result.totalBaseScore}/{result.maxPoints}</span>
            </div>
            {result.hasParihar && (
              <>
                <span className="text-muted-foreground">→</span>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Sau Parihar:</span>
                  <span className="font-bold text-primary">{result.totalPoints}/{result.maxPoints}</span>
                  {result.totalPoints > result.totalBaseScore && (
                    <Badge variant="outline" className="ml-1 text-xs bg-green-50 text-green-700 border-green-200">
                      +{(result.totalPoints - result.totalBaseScore).toFixed(1)} đ
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Compatibility Level Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="outline" 
              className={`text-lg px-4 py-1.5 border-2 ${levelColors.text} ${levelColors.border}`}
            >
              {result.compatibilityLevel === 'Excellent' && 'Xuất sắc'}
              {result.compatibilityLevel === 'Good' && 'Tốt'}
              {result.compatibilityLevel === 'Moderate' && 'Trung bình'}
              {result.compatibilityLevel === 'Poor' && 'Kém'}
            </Badge>
          </div>

          <p className="text-center text-muted-foreground">
            {result.compatibilityDescription}
          </p>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Male Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {maleName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cung hoàng đạo:</span>
              <span className="font-medium">{result.boyDetails.rashi.nameVN} ({result.boyDetails.rashi.name})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chủ tinh:</span>
              <span className="font-medium">{result.boyDetails.rashi.lord}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nakshatra:</span>
              <span className="font-medium">{result.boyDetails.nakshatra.name} ({result.boyDetails.nakshatraNum})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gana:</span>
              <span className="font-medium">{result.boyDetails.nakshatra.gana}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nadi:</span>
              <span className="font-medium">{result.boyDetails.nakshatra.nadi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Charan (Pada):</span>
              <span className="font-medium">{result.boyDetails.pada}</span>
            </div>
          </CardContent>
        </Card>

        {/* Female Details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {femaleName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cung hoàng đạo:</span>
              <span className="font-medium">{result.girlDetails.rashi.nameVN} ({result.girlDetails.rashi.name})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chủ tinh:</span>
              <span className="font-medium">{result.girlDetails.rashi.lord}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nakshatra:</span>
              <span className="font-medium">{result.girlDetails.nakshatra.name} ({result.girlDetails.nakshatraNum})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gana:</span>
              <span className="font-medium">{result.girlDetails.nakshatra.gana}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nadi:</span>
              <span className="font-medium">{result.girlDetails.nakshatra.nadi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Charan (Pada):</span>
              <span className="font-medium">{result.girlDetails.pada}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Koota Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chi Tiết 8 Koota</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.kootaBreakdown.map((koota, index) => {
            const isFullScore = koota.points === koota.maxPoints;
            const isZeroScore = koota.points === 0;
            const hasDosha = koota.dosha !== null;
            const hasParihar = koota.parihar?.active === true;
            const wasOverridden = koota.parihar?.overridden === true;
            const kootaName = KOOTA_NAMES[koota.name] || koota.name;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{kootaName}</span>
                    {hasDosha && (
                      <Badge variant="destructive" className="text-xs">Dosha</Badge>
                    )}
                    {hasParihar && wasOverridden && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Parihar ✓
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {wasOverridden && (
                      <span className="text-xs text-muted-foreground line-through">
                        {koota.baseScore}đ
                      </span>
                    )}
                    <span className={`text-sm font-bold ${
                      isFullScore ? 'text-green-600' : isZeroScore ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {koota.points}/{koota.maxPoints}đ
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(koota.points / koota.maxPoints) * 100} 
                    className={`h-2 flex-1 ${
                      hasDosha ? '[&>div]:bg-red-500' : isFullScore ? '[&>div]:bg-green-500' : '[&>div]:bg-amber-500'
                    }`}
                  />
                  {hasDosha && !hasParihar && (
                    <span className="text-xs text-red-600 font-medium whitespace-nowrap">
                      {koota.dosha?.type}
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">{koota.description}</p>
                
                {hasParihar && wasOverridden && koota.parihar.reason && (
                  <div className="flex items-start gap-1 text-xs text-green-600 bg-green-50 p-2 rounded">
                    <span className="font-medium shrink-0">Hóa giải:</span>
                    <span>{koota.parihar.reason}</span>
                  </div>
                )}
                
                {index < result.kootaBreakdown.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Doshas Summary */}
      {result.hasDoshas && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-red-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Các Dosh Cần Lưu Ý ({result.totalDoshas})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.doshas.map((dosha, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-red-200">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-sm">{dosha.type}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ml-auto ${
                      dosha.severity === 'Severe' ? 'bg-red-100 text-red-800 border-red-300' :
                      dosha.severity === 'High' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                      'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }`}
                  >
                    {dosha.severity === 'Severe' ? 'Nghiêm trọng' :
                     dosha.severity === 'High' ? 'Cao' : 'Trung bình'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{dosha.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Parihar Summary */}
      {result.hasParihar && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-green-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Các Dosh Đã Được Hóa Giải ({result.totalParihars})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.parihars.map((parihar, index) => (
              <div key={index} className="flex items-center gap-2 text-green-700">
                <span className="text-green-600 font-bold">✓</span>
                <span className="font-medium text-sm">{parihar.koota}:</span>
                <span className="text-sm">{parihar.reason}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Khuyến Nghị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  PRIORITY_COLORS[rec.priority] || 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{rec.title}</span>
                </div>
                <p className="text-sm mb-2">{rec.description}</p>
                {rec.remedy && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <p className="text-sm font-medium">Giải pháp:</p>
                    <p className="text-sm">{rec.remedy}</p>
                  </div>
                )}
                {rec.details && (
                  <p className="text-sm mt-2 whitespace-pre-line">{rec.details}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchmakingChart;
