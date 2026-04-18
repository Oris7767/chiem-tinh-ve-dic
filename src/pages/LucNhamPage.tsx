import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { lucNhamSchema } from '../lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LUC_NHAM_DATA_VERSION } from '../data/lucNham';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildThirtyDayForecast } from '@/utils/lucNhamEngine';
import { LucNhamPurpose, PURPOSE_LABELS } from '@/data/lucNham/interpretations';
import { CheckCircle2, AlertTriangle, LayoutGrid, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LucNhamDayResult } from '@/utils/lucNhamEngine';

const PURPOSE_OPTIONS: LucNhamPurpose[] = [
  'xay-dung-nhap-trach',
  'an-tang-than-su',
  'xay-bep-chuong-trai',
  'xuat-hanh',
  'ket-hon',
  'khai-truong-khac',
  'thi-dau',
];

type ForecastFilter = 'all' | 'good' | 'bad';
type ForecastLayout = 'grid' | 'calendar';

const LucNhamPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [targetMonth, setTargetMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}`;
  });
  const [purpose, setPurpose] = useState<LucNhamPurpose>('xuat-hanh');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState<ForecastFilter>('all');
  const [layout, setLayout] = useState<ForecastLayout>('grid');
  const [selectedDay, setSelectedDay] = useState<LucNhamDayResult | null>(null);

  const forecast = useMemo(() => {
    if (!submitted) return [];
    const [yearText, monthText] = targetMonth.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    if (!year || !month || !birthDate) return [];

    return buildThirtyDayForecast({
      year,
      month,
      purpose,
      birthDate,
      gender,
    });
  }, [submitted, targetMonth, purpose, birthDate, gender]);

  const filteredForecast = useMemo(() => {
    if (filter === 'good') return forecast.filter((item) => item.isGood);
    if (filter === 'bad') return forecast.filter((item) => !item.isGood);
    return forecast;
  }, [forecast, filter]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-amber-50 to-white">
      <SEO
        title={t('lucNham.seoTitle')}
        description={t('lucNham.seoDescription')}
        keywords={t('lucNham.seoKeywords')}
        schema={lucNhamSchema}
        lang={language === 'vi' ? 'vi' : 'en'}
      />

      <NavBar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="mb-12 text-center">
          <div className="mb-6 mx-auto max-w-sm overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <img
              src="/images/Luc%20Nham.png"
              alt="Logo âm dương Lục Nhâm"
              className="h-28 w-full object-contain md:h-32"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4 font-serif">
            {t('lucNham.title')}
          </h1>
          <p className="text-lg text-amber-800 max-w-3xl mx-auto leading-relaxed">
            {t('lucNham.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 max-w-3xl mx-auto">
          <Card className="border-amber-200 bg-white text-amber-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900">Đại Lục Nhâm: Chọn &quot;Sự an bài thuận lợi&quot;</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-amber-800 text-sm md:text-base leading-relaxed">
              <p>
                Lục Nhâm thiên về diễn biến nhân sự. Khi dùng Lục Nhâm để chọn ngày, thực chất là bạn đang xem
                một &quot;quẻ dự đoán&quot; cho ngày đó.
              </p>
              <p>
                Ưu điểm: Cho bạn biết ngày đó các mối quan hệ con người có thuận hòa hay không, có ẩn chứa rủi ro hay
                tiểu nhân quấy phá không. Lục Nhâm rất tinh vi trong việc soi xét tâm lý và các nút thắt của sự việc.
              </p>
              <p className="font-semibold text-amber-900">Khi nào nên dùng:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tổ chức đám cưới (cần sự hòa hợp nhân sự).</li>
                <li>Hòa giải tranh chấp, kiện tụng.</li>
                <li>Hội họp, gặp gỡ đối tác (để xem lòng người).</li>
                <li>Tìm hiểu xem một dự định trong ngày đó có &quot;thành&quot; hay không.</li>
              </ul>
              <p>
                Trong giới huyền học, người ta thường dùng Đổng Công Trạch Nhật hoặc Đại Lục Nhâm để xem ngày (Nhật),
                sau đó dùng Kỳ Môn để chọn giờ (Thời) và hướng (Phương) nhằm tối ưu hóa kết quả.
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-white text-amber-900 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-amber-900">{t('lucNham.calculatorTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-amber-800 text-sm md:text-base leading-relaxed">
              <div className="flex items-center justify-center gap-2 text-amber-800">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-lg">
                  ☯
                </span>
                <span className="text-sm md:text-base">Lịch tham khảo Lục Nhâm cho 30 ngày trong tháng</span>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="border-amber-300 bg-white text-amber-900"
                />
                <Input
                  type="month"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="border-amber-300 bg-white text-amber-900"
                />
                <Select value={purpose} onValueChange={(value) => setPurpose(value as LucNhamPurpose)}>
                  <SelectTrigger className="border-amber-300 bg-white text-amber-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PURPOSE_OPTIONS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {PURPOSE_LABELS[item]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')}>
                  <SelectTrigger className="border-amber-300 bg-white text-amber-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Nữ</SelectItem>
                    <SelectItem value="male">Nam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => setSubmitted(true)}
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                >
                  Tính lịch 30 ngày
                </Button>
              </div>

              {!submitted ? (
                <p>{t('lucNham.calculatorPlaceholder')}</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-amber-700 text-sm">
                    Màu xanh: tốt cho {PURPOSE_LABELS[purpose].toLowerCase()} | Màu đỏ: nên thận trọng
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                    <div className="inline-flex rounded-lg border border-amber-200 bg-white p-1">
                      <button
                        onClick={() => setFilter('all')}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm transition-colors',
                          filter === 'all'
                            ? 'bg-amber-600 text-white'
                            : 'text-amber-800 hover:bg-amber-50'
                        )}
                      >
                        Tất cả
                      </button>
                      <button
                        onClick={() => setFilter('good')}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm transition-colors',
                          filter === 'good'
                            ? 'bg-emerald-600 text-white'
                            : 'text-emerald-700 hover:bg-emerald-50'
                        )}
                      >
                        Ngày tốt
                      </button>
                      <button
                        onClick={() => setFilter('bad')}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm transition-colors',
                          filter === 'bad'
                            ? 'bg-red-600 text-white'
                            : 'text-red-700 hover:bg-red-50'
                        )}
                      >
                        Ngày xấu
                      </button>
                    </div>

                    <div className="inline-flex rounded-lg border border-amber-200 bg-white p-1">
                      <button
                        onClick={() => setLayout('grid')}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors',
                          layout === 'grid'
                            ? 'bg-amber-600 text-white'
                            : 'text-amber-800 hover:bg-amber-50'
                        )}
                      >
                        <LayoutGrid className="h-4 w-4" />
                        Grid
                      </button>
                      <button
                        onClick={() => setLayout('calendar')}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors',
                          layout === 'calendar'
                            ? 'bg-amber-600 text-white'
                            : 'text-amber-800 hover:bg-amber-50'
                        )}
                      >
                        <CalendarDays className="h-4 w-4" />
                        Calendar
                      </button>
                    </div>
                  </div>

                  {layout === 'grid' ? (
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                      {filteredForecast.map((item) => (
                        <div
                          key={item.isoDate}
                          onClick={() => setSelectedDay(item)}
                          className={cn(
                            'rounded-xl border border-amber-100 bg-white p-4 shadow-sm border-l-4 cursor-pointer transition hover:shadow-md',
                            item.isGood ? 'border-l-emerald-500' : 'border-l-red-500'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-amber-900">
                              Ngày {item.day} ({item.dayCan} {item.dayChi})
                            </p>
                            {item.isGood ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                            )}
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              {item.soTruyen}
                            </Badge>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              {item.trungTruyen}
                            </Badge>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                              {item.matTruyen}
                            </Badge>
                          </div>

                          <p className="text-sm text-amber-800 mt-3">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
                      {filteredForecast.map((item) => (
                        <div
                          key={item.isoDate}
                          onClick={() => setSelectedDay(item)}
                          className={cn(
                            'rounded-lg border bg-white px-2 py-2 text-center shadow-sm cursor-pointer transition hover:shadow-md',
                            item.isGood ? 'border-emerald-200' : 'border-red-200'
                          )}
                          title={`${item.dayCan} ${item.dayChi} - ${item.reason}`}
                        >
                          <div className="flex items-center justify-center gap-1 text-xs">
                            {item.isGood ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                            )}
                            <span className="text-amber-900 font-medium">Ngày {item.day}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-gray-600">
                            {item.soTruyen}-{item.trungTruyen}-{item.matTruyen}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={Boolean(selectedDay)} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="max-w-xl border-gray-200 bg-white">
          {selectedDay && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-900">
                  Báo cáo chi tiết ngày {selectedDay.day} ({selectedDay.dayCan} {selectedDay.dayChi})
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Tổng hợp tham số cá nhân hóa theo Đại Lục Nhâm.
                </DialogDescription>
                <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                  Ngày sinh âm lịch: {selectedDay.personalContext?.lunarDateString} (Năm{' '}
                  {selectedDay.personalContext?.birthCan} {selectedDay.personalContext?.birthChi} - Tuổi âm lịch:{' '}
                  {selectedDay.personalContext?.lunarAge})
                </div>
              </DialogHeader>

              <div className="space-y-4 text-sm md:text-base">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="font-medium text-gray-800">- Hành Niên:</p>
                  <p className="text-gray-700 mt-1">
                    Hành niên năm nay: cung <span className="font-semibold">{selectedDay.personalContext?.hanhNien}</span>
                  </p>
                </div>

                {selectedDay.personalContext?.isQuyNhanDangThienMon && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="font-medium text-amber-900">🌟 Quý nhân đăng thiên môn</p>
                    <p className="text-amber-800 mt-1">
                      Dễ gặp quý nhân giúp đỡ, đi đường bình an.
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-white text-amber-900 border border-amber-200">
                        Quý Nhân: {selectedDay.personalContext?.quyNhan}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <p className="font-medium text-emerald-900">
                    🍀 Lục Diệu: {selectedDay.personalContext?.lucDieu}
                  </p>
                  <p className="text-emerald-800 mt-1">
                    {selectedDay.personalContext?.lucDieu === 'Tiểu Cát'
                      ? 'Tiểu Cát - Mọi việc hanh thông nhỏ.'
                      : 'Chỉ dấu tham khảo để cân nhắc hành sự trong ngày.'}
                  </p>
                </div>

                <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
                  <p className="font-medium text-sky-900">
                    👤 Tương tác tuổi ({selectedDay.personalContext?.birthCan} {selectedDay.personalContext?.birthChi}):
                  </p>
                  <p
                    className={cn(
                      'mt-1',
                      selectedDay.personalContext?.tuoiTuongTac.status === 'Đại Hung' ||
                        selectedDay.personalContext?.tuoiTuongTac.status === 'Hung'
                        ? 'text-red-700 font-semibold'
                        : 'text-sky-800'
                    )}
                  >
                    {selectedDay.personalContext?.tuoiTuongTac.message}
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'border',
                        selectedDay.personalContext?.tuoiTuongTac.status === 'Đại Hung'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : selectedDay.personalContext?.tuoiTuongTac.status === 'Hung'
                          ? 'bg-rose-100 text-rose-800 border-rose-200'
                          : selectedDay.personalContext?.tuoiTuongTac.status === 'Tốt'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      )}
                    >
                      {selectedDay.personalContext?.tuoiTuongTac.status}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <p className="text-sm italic text-amber-800">
                    *Lưu ý: Năng lượng chung của ngày (Lục Nhâm) luôn giữ vai trò quyết định. Chỉ số phụ trợ chỉ
                    dùng để tham khảo thêm.*
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default LucNhamPage;
