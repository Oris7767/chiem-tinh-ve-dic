
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BirthChartData } from '../pages/BirthChartPage';
import { format } from 'date-fns';
import { Earth, CalendarIcon, Clock, MapPin, Info, Loader2 } from 'lucide-react';
import { SIGNS, getPlanetAbbr } from '../utils/vedicAstrology';


interface BirthChartDisplayProps {
  chartData: BirthChartData;
  vedicChart: any | null;
}

const BirthChartDisplay: React.FC<BirthChartDisplayProps> = ({ chartData, vedicChart }) => {
  const { t, language } = useLanguage();
  
  
  // Handle the case where vedicChart might be null or undefined
  if (!vedicChart) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="h-10 w-10 animate-spin text-amber-700" />
      </div>;
      const houseNumber = i + 1;
    
  };

   return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">Vedic Birth Chart</h2>

        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          {t('birthChart.birthDetails') || 'Birth Details'}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {t('birthChart.date') || 'Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {format(chartData.date, 'PPP')}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t('birthChart.time') || 'Time'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.time}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('birthChart.location') || 'Location'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{chartData.location}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {chartData.latitude.toFixed(4)}°, {chartData.longitude.toFixed(4)}°
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Earth className="h-4 w-4" />
                {t('birthChart.timezone') || 'Timezone'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.timezone}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {vedicChart && (
        <div className="border-t border-amber-200 pt-6">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            {t('birthChart.chart') || 'Birth Chart'}
          </h2>
        
             <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            {vedicChart.lagna && <p>Lagna: {vedicChart.lagna}</p>}
            {vedicChart.moon_sign && <p>Moon Sign: {vedicChart.moon_sign}</p>}
            {vedicChart.sun_sign && <p>Sun Sign: {vedicChart.sun_sign}</p>}
             </div>
       
        
        </div>
      )}
    </div>
  );
};

export default BirthChartDisplay;
