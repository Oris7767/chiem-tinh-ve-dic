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
import { buildThirtyDayForecast } from '@/utils/lucNhamEngine';
import { LucNhamPurpose, PURPOSE_LABELS } from '@/data/lucNham/interpretations';

const PURPOSE_OPTIONS: LucNhamPurpose[] = [
  'xay-dung-nhap-trach',
  'an-tang-than-su',
  'xay-bep-chuong-trai',
  'xuat-hanh',
  'ket-hon',
  'khai-truong-khac',
  'thi-dau',
];

const LucNhamPage: React.FC = () => {
  const { t } = useLanguage();
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [targetMonth, setTargetMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, '0')}`;
  });
  const [purpose, setPurpose] = useState<LucNhamPurpose>('xuat-hanh');
  const [submitted, setSubmitted] = useState(false);

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
    });
  }, [submitted, targetMonth, purpose, birthDate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-900 via-amber-950 to-amber-900">
      <SEO title={t('lucNham.seoTitle')} description={t('lucNham.seoDescription')} schema={lucNhamSchema} />

      <NavBar />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        <div className="mb-12 text-center">
          <div className="mb-6 overflow-hidden rounded-2xl border border-amber-800/70 bg-stone-900/70">
            <img
              src="/images/Luc%20Nham.png"
              alt="Logo âm dương Lục Nhâm"
              className="h-48 w-full object-cover md:h-64"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4 font-serif">
            {t('lucNham.title')}
          </h1>
          <p className="text-lg text-amber-100 max-w-3xl mx-auto leading-relaxed">
            {t('lucNham.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 max-w-3xl mx-auto">
          <Card className="border-amber-800/60 bg-stone-900/70 text-amber-50 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-amber-100">{t('lucNham.localDataTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-amber-100/90 text-sm md:text-base leading-relaxed">
              <p>{t('lucNham.localDataBody')}</p>
              <p className="text-amber-200/80 text-xs md:text-sm">
                {t('lucNham.dataVersionLabel')}: {LUC_NHAM_DATA_VERSION}
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-800/60 bg-stone-900/70 text-amber-50 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-amber-100">{t('lucNham.calculatorTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-amber-100/90 text-sm md:text-base leading-relaxed">
              <div className="flex items-center justify-center gap-2 text-amber-100">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-amber-600/70 bg-amber-900/40 text-lg">
                  ☯
                </span>
                <span className="text-sm md:text-base">Lịch tham khảo Lục Nhâm cho 30 ngày trong tháng</span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="border-amber-700 bg-stone-950/60 text-amber-50"
                />
                <Input
                  type="month"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="border-amber-700 bg-stone-950/60 text-amber-50"
                />
                <Select value={purpose} onValueChange={(value) => setPurpose(value as LucNhamPurpose)}>
                  <SelectTrigger className="border-amber-700 bg-stone-950/60 text-amber-50">
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
                  <p className="text-amber-200 text-sm">
                    Màu xanh: tốt cho {PURPOSE_LABELS[purpose].toLowerCase()} | Màu đỏ: nên thận trọng
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {forecast.map((item) => (
                      <div
                        key={item.isoDate}
                        className={`rounded-lg border p-3 ${
                          item.isGood
                            ? 'border-emerald-700 bg-emerald-900/25'
                            : 'border-red-700 bg-red-900/25'
                        }`}
                      >
                        <p className="font-semibold">
                          Ngày {item.day} ({item.dayCan} {item.dayChi})
                        </p>
                        <p className="text-xs text-amber-200/90 mt-1">
                          Tam truyền: {item.soTruyen} - {item.trungTruyen} - {item.matTruyen}
                        </p>
                        <p className="text-sm mt-2">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LucNhamPage;
