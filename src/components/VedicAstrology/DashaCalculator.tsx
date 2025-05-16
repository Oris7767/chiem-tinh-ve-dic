
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateTime } from 'luxon';
import { VedicChartData } from './VedicChart';
import { calculateDashaResults } from '@/services/dashaService';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

interface DashaCalculatorProps {
  chartData: VedicChartData;
  birthTime: string;
  birthDate: string;
  timeZone: string;
}

export interface DashaResult {
  planet: string;
  startDate: string;
  endDate: string;
  subDashas?: DashaResult[];
}

const DashaCalculator: React.FC<DashaCalculatorProps> = ({ chartData, birthDate, birthTime, timeZone }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashaResults, setDashaResults] = useState<DashaResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashaResults() {
      if (!chartData || !birthDate || !birthTime) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Format birth time to ISO for calculation
        const dateTime = DateTime.fromFormat(
          `${birthDate} ${birthTime}`, 
          'yyyy-MM-dd HH:mm', 
          { zone: timeZone }
        );
        
        // Calculate Dasha results based on birth time
        const dashas = await calculateDashaResults(dateTime, chartData.moonNakshatra);
        setDashaResults(dashas);
        
        // Store in Supabase if user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Store main dasha result
          const { error } = await supabase.from('dasha_results').insert({
            user_id: user.id,
            mahadasha_planet: dashas[0]?.planet,
            antardasha_planet: dashas[0]?.subDashas?.[0]?.planet,
            start_date: dashas[0]?.startDate,
            end_date: dashas[0]?.endDate
          });
          
          if (error) console.error("Error saving dasha result:", error);
        }
      } catch (err) {
        console.error("Error calculating dashas:", err);
        setError("Could not calculate dasha periods. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDashaResults();
  }, [chartData, birthDate, birthTime, timeZone]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <span className="ml-2 text-amber-700">Đang tính toán chu kỳ dasha...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat('dd/MM/yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vimshottari Dasha (Chu kỳ hành tinh)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mahadasha">
          <TabsList className="mb-4">
            <TabsTrigger value="mahadasha">Mahadasha</TabsTrigger>
            <TabsTrigger value="antardasha">Antardasha</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mahadasha">
            <div className="space-y-4">
              {dashaResults.length > 0 ? (
                dashaResults.map((dasha, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <div className="font-medium">{dasha.planet}</div>
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
              {dashaResults.length > 0 && dashaResults[0]?.subDashas ? (
                dashaResults[0].subDashas.map((subDasha, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <div className="font-medium">{dashaResults[0].planet} - {subDasha.planet}</div>
                      <div className="text-sm">
                        {formatDate(subDasha.startDate)} - {formatDate(subDasha.endDate)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có dữ liệu antardasha.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashaCalculator;
