// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateTime } from 'luxon';
import { VedicChartData, DashaPeriod } from './VedicChart';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashaCalculatorProps {
  chartData: VedicChartData;
}

const DashaCalculator: React.FC<DashaCalculatorProps> = ({ chartData }) => {
  const [selectedMahadasha, setSelectedMahadasha] = useState<string | null>(null);
  const [selectedDashaData, setSelectedDashaData] = useState<DashaPeriod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAntardashaData = async () => {
      if (!selectedMahadasha) {
        setSelectedDashaData(null);
        return;
      }

      setIsLoading(true);
      try {
        // Find the selected mahadasha period from sequence
        const selectedPeriod = chartData.dashas.sequence.find(
          dasha => dasha.planet === selectedMahadasha
        );

        if (!selectedPeriod) {
          throw new Error('Không tìm thấy dữ liệu cho chu kỳ này');
        }

        // Fetch antardasha data from database
        const { data: dashaRef, error: refError } = await supabase
          .from('dasha_reference')
          .select('antardasha_percentages')
          .eq('planet', selectedMahadasha)
          .single();

        if (refError) throw refError;
        if (!dashaRef?.antardasha_percentages) {
          throw new Error('Không có dữ liệu antardasha');
        }

        // Calculate time periods for each antardasha
        const startDate = DateTime.fromISO(selectedPeriod.startDate);
        const endDate = DateTime.fromISO(selectedPeriod.endDate);
        const totalDuration = endDate.diff(startDate);

        // Calculate antardasha sequence
        const antardasha = {
          sequence: Object.entries(dashaRef.antardasha_percentages).map(([planet, percentage]) => {
            const duration = totalDuration.multiply(percentage / 100);
            const subStartDate = startDate.plus({ milliseconds: totalDuration.multiply(percentage / 100).milliseconds });
            const subEndDate = subStartDate.plus(duration);

            return {
              planet,
              startDate: subStartDate.toISO(),
              endDate: subEndDate.toISO()
            };
          })
        };

        // Find current antardasha if this is the current mahadasha
        if (selectedMahadasha === chartData.dashas.current.planet) {
          const now = DateTime.now();
          const currentAntardasha = antardasha.sequence.find(ad => {
            const adStart = DateTime.fromISO(ad.startDate);
            const adEnd = DateTime.fromISO(ad.endDate);
            return now >= adStart && now <= adEnd;
          });

          if (currentAntardasha) {
            const adStart = DateTime.fromISO(currentAntardasha.startDate);
            const adEnd = DateTime.fromISO(currentAntardasha.endDate);
            const elapsed = now.diff(adStart, ['years', 'months', 'days']);
            const remaining = adEnd.diff(now, ['years', 'months', 'days']);

            antardasha.current = {
              ...currentAntardasha,
              elapsed: {
                years: Math.floor(elapsed.years),
                months: Math.floor(elapsed.months),
                days: Math.floor(elapsed.days)
              },
              remaining: {
                years: Math.floor(remaining.years),
                months: Math.floor(remaining.months),
                days: Math.floor(remaining.days)
              }
            };
          }
        }

        // Update selected dasha data with antardasha information
        setSelectedDashaData({
          ...selectedPeriod,
          antardasha
        });

      } catch (err) {
        console.error('Error fetching antardasha data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAntardashaData();
  }, [selectedMahadasha, chartData.dashas.sequence]);

  if (!chartData.dashas) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vimshottari Dasha (Chu kỳ hành tinh)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Không có dữ liệu Dasha từ API</div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat('dd/MM/yyyy');
  };

  // Get planet abbreviation
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

  const { current: currentDasha, sequence: dashaSequence } = chartData.dashas;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vimshottari Dasha (Chu kỳ hành tinh)</CardTitle>
      </CardHeader>
      <CardContent>
        {currentDasha && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="font-bold text-lg">Chu kỳ hiện tại:</div>
            <div className="flex justify-between">
              <div className="font-medium">{currentDasha.planet} ({getPlanetAbbr(currentDasha.planet)})</div>
              <div>
                {formatDate(currentDasha.startDate)} - {formatDate(currentDasha.endDate)}
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Đã qua:</div>
                <div className="text-sm">
                  {currentDasha.elapsed.years} năm, {currentDasha.elapsed.months} tháng, {currentDasha.elapsed.days} ngày
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Còn lại:</div>
                <div className="text-sm">
                  {currentDasha.remaining.years} năm, {currentDasha.remaining.months} tháng, {currentDasha.remaining.days} ngày
                </div>
              </div>
            </div>
            {currentDasha.antardasha?.current && (
              <div className="mt-2">
                <div className="text-sm font-medium">Antardasha hiện tại:</div>
                <div className="text-sm">
                  {currentDasha.antardasha.current.planet} ({getPlanetAbbr(currentDasha.antardasha.current.planet)})
                  <div className="text-xs text-gray-600">
                    {formatDate(currentDasha.antardasha.current.startDate)} - {formatDate(currentDasha.antardasha.current.endDate)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <Tabs defaultValue="mahadasha">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="mahadasha">Mahadasha</TabsTrigger>
            <TabsTrigger value="antardasha">Antardasha</TabsTrigger>
          </TabsList>

          <TabsContent value="mahadasha">
            <div className="space-y-4">
              {dashaSequence.length > 0 ? (
                dashaSequence.map((dasha, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      dasha.planet === currentDasha.planet ? 'bg-amber-50 border-amber-300' :
                      selectedMahadasha === dasha.planet ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                    onClick={() => setSelectedMahadasha(dasha.planet)}
                  >
                    <div className="flex justify-between">
                      <div className="font-medium">
                        {dasha.planet} ({getPlanetAbbr(dasha.planet)})
                      </div>
                      <div className="text-sm">
                        {formatDate(dasha.startDate)} - {formatDate(dasha.endDate)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có dữ liệu dasha.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="antardasha">
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                </div>
              ) : selectedMahadasha && selectedDashaData?.antardasha ? (
                <div className="space-y-3">
                  {selectedDashaData.antardasha.sequence.map((antardasha, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-md ${
                        selectedDashaData.antardasha?.current?.planet === antardasha.planet ? 'bg-amber-50 border-amber-300' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {antardasha.planet} ({getPlanetAbbr(antardasha.planet)})
                        </div>
                        <div className="text-sm">
                          {formatDate(antardasha.startDate)} - {formatDate(antardasha.endDate)}
                        </div>
                      </div>
                      {selectedDashaData.antardasha?.current?.planet === antardasha.planet && (
                        <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Đã qua:</div>
                            <div>
                              {selectedDashaData.antardasha.current.elapsed.years} năm,{' '}
                              {selectedDashaData.antardasha.current.elapsed.months} tháng,{' '}
                              {selectedDashaData.antardasha.current.elapsed.days} ngày
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Còn lại:</div>
                            <div>
                              {selectedDashaData.antardasha.current.remaining.years} năm,{' '}
                              {selectedDashaData.antardasha.current.remaining.months} tháng,{' '}
                              {selectedDashaData.antardasha.current.remaining.days} ngày
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  {error}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Vui lòng chọn một Mahadasha để xem chi tiết Antardasha
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashaCalculator; 