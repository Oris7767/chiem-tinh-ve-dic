// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateTime } from 'luxon';
import { VedicChartData, DashaPeriod } from './VedicChart';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AntarDashaTable from './AntarDashaTable';

interface DashaCalculatorProps {
  chartData: VedicChartData;
}

const DashaCalculator: React.FC<DashaCalculatorProps> = ({ chartData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [futureAntardashas, setFutureAntardashas] = useState<Array<{
    planet: string;
    startDate: string;
    endDate: string;
  }>>([]);

  useEffect(() => {
    const fetchFutureAntardashas = async () => {
      if (!chartData.dashas?.current) return;

      setIsLoading(true);
      try {
        // Fetch antardasha data for current mahadasha
        const { data: dashaRef, error: refError } = await supabase
          .from('dasha_reference')
          .select('antardasha_percentages')
          .eq('planet', chartData.dashas.current.planet)
          .single();

        if (refError) throw refError;
        if (!dashaRef?.antardasha_percentages) {
          throw new Error('Không có dữ liệu antardasha');
        }

        // Calculate time periods for antardasha
        const startDate = DateTime.fromISO(chartData.dashas.current.startDate);
        const endDate = DateTime.fromISO(chartData.dashas.current.endDate);
        const totalDuration = endDate.diff(startDate);
        const now = DateTime.now();

        // Calculate and filter future antardashas
        const antardashas = Object.entries(dashaRef.antardasha_percentages).map(([planet, percentage]) => {
          const duration = totalDuration.multiply(percentage / 100);
          const subStartDate = startDate.plus({ milliseconds: totalDuration.multiply(percentage / 100).milliseconds });
          const subEndDate = subStartDate.plus(duration);
          
          return {
            planet,
            startDate: subStartDate.toISO(),
            endDate: subEndDate.toISO()
          };
        });

        // Filter only future and current antardashas
        const futureAndCurrentAntardashas = antardashas.filter(ad => 
          DateTime.fromISO(ad.endDate) > now
        );

        setFutureAntardashas(futureAndCurrentAntardashas);
      } catch (err) {
        console.error('Error fetching antardasha data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFutureAntardashas();
  }, [chartData.dashas?.current]);

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

  // Tìm mahadasha hiện tại trong sequence
  const currentSequence = dashaSequence.find(seq => seq.planet === currentDasha.planet);
  const currentAntarDashas = currentSequence?.antardashas || [];

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
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium">Đã qua:</div>
                      <div className="text-xs">
                        {currentDasha.antardasha.current.elapsed.years} năm,{' '}
                        {currentDasha.antardasha.current.elapsed.months} tháng,{' '}
                        {currentDasha.antardasha.current.elapsed.days} ngày
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium">Còn lại:</div>
                      <div className="text-xs">
                        {currentDasha.antardasha.current.remaining.years} năm,{' '}
                        {currentDasha.antardasha.current.remaining.months} tháng,{' '}
                        {currentDasha.antardasha.current.remaining.days} ngày
                      </div>
                    </div>
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
                    className={`p-3 border rounded-md ${
                      dasha.planet === currentDasha.planet ? 'bg-amber-50 border-amber-300' : ''
                    }`}
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
              {currentAntarDashas.length > 0 ? (
                <AntarDashaTable antarDashas={currentAntarDashas} currentPlanet={currentDasha.planet} />
              ) : (
                <div className="text-center text-red-500">Không có dữ liệu antardasha</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashaCalculator;