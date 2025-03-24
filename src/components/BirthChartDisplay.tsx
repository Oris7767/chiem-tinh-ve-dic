
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BirthChartData } from '../pages/BirthChartPage';
import { format } from 'date-fns';
import { Earth, CalendarIcon, Clock, MapPin, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { ChartData, SIGNS, getPlanetAbbr } from '../utils/vedicAstrology';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BirthChartDisplayProps {
  chartData: BirthChartData;
  vedicChart: ChartData | null;
}

const BirthChartDisplay: React.FC<BirthChartDisplayProps> = ({ chartData, vedicChart }) => {
  const { t, language } = useLanguage();
  
  // If we have real vedic chart data, use it. Otherwise, use placeholder data
  const planetData = vedicChart ? vedicChart.planets : [
    { id: "as", name: "Ascendant", symbol: "⬆️", longitude: 210, sign: 7, house: 1, retrograde: false, color: "#FF00FF" },
    { id: "su", name: "Sun", symbol: "☉", longitude: 15, sign: 0, house: 6, retrograde: false, color: "#FFB900" },
    { id: "mo", name: "Moon", symbol: "☽", longitude: 255, sign: 8, house: 2, retrograde: false, color: "#DDDDDD" },
    { id: "ma", name: "Mars", symbol: "♂", longitude: 75, sign: 2, house: 8, retrograde: false, color: "#FF3300" },
    { id: "me", name: "Mercury", symbol: "☿", longitude: 25, sign: 0, house: 6, retrograde: false, color: "#33CC33" },
    { id: "ju", name: "Jupiter", symbol: "♃", longitude: 105, sign: 3, house: 9, retrograde: false, color: "#FFCC00" },
    { id: "ve", name: "Venus", symbol: "♀", longitude: 20, sign: 0, house: 6, retrograde: false, color: "#FF66FF" },
    { id: "sa", name: "Saturn", symbol: "♄", longitude: 300, sign: 10, house: 3, retrograde: false, color: "#0066CC" },
    { id: "ra", name: "Rahu", symbol: "☊", longitude: 10, sign: 0, house: 6, retrograde: false, color: "#666666" },
    { id: "ke", name: "Ketu", symbol: "☋", longitude: 190, sign: 6, house: 12, retrograde: false, color: "#996633" },
  ];
  
  // Color mapping for planets
  const planetColors: Record<string, string> = {
    Ascendant: '#FF00FF',
    Sun: '#FFB900',
    Moon: '#DDDDDD',
    Mars: '#FF3300',
    Mercury: '#33CC33',
    Jupiter: '#FFCC00',
    Venus: '#FF66FF',
    Saturn: '#0066CC',
    Rahu: '#666666',
    Ketu: '#996633',
  };
  
  // Chart rendering data for the South Indian style chart
  const prepareChartData = () => {
    // Create 12 segments for the houses
    return Array.from({ length: 12 }, (_, i) => {
      const houseNumber = i + 1;
      return {
        name: `House ${houseNumber}`,
        value: 1,
        sign: (i) % 12,
        planets: planetData.filter(p => p.house === houseNumber)
      };
    });
  };
  
  const chartSegments = prepareChartData();
  
  return (
    <div className="space-y-6">
      <div>
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
      
      <div className="border-t border-amber-200 pt-6">
        <h2 className="text-2xl font-semibold text-amber-800 mb-4">
          {t('birthChart.chart') || 'Birth Chart'}
        </h2>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="max-w-3xl mx-auto">
            {/* Vedic Birth Chart Visualization */}
            <div className="aspect-square w-full border-2 border-amber-300 mb-6">
              <div className="grid grid-cols-3 h-full">
                {/* Row 1 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">1</span>
                  {planetData.filter(p => p.house === 1).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">12</span>
                  {planetData.filter(p => p.house === 12).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">11</span>
                  {planetData.filter(p => p.house === 11).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                
                {/* Row 2 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">2</span>
                  {planetData.filter(p => p.house === 2).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                <div className="border-0 flex items-center justify-center text-amber-900 font-semibold">
                  <div className="text-center">
                    <div className="text-sm font-bold mb-1">D1 Janma</div>
                    <div className="text-xs opacity-70">Birth Chart</div>
                  </div>
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">10</span>
                  {planetData.filter(p => p.house === 10).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                
                {/* Row 3 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">3</span>
                  {planetData.filter(p => p.house === 3).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">4</span>
                  {planetData.filter(p => p.house === 4).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">9</span>
                  {planetData.filter(p => p.house === 9).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                
                {/* Row 4 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">6</span>
                  {planetData.filter(p => p.house === 6).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">5</span>
                  {planetData.filter(p => p.house === 5).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">8</span>
                  {planetData.filter(p => p.house === 8).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
                
                {/* Row 5 */}
                <div className="border border-amber-300 p-2 text-xs relative flex flex-col">
                  <span className="text-gray-400 text-[10px] absolute top-1 left-1">7</span>
                  {planetData.filter(p => p.house === 7).map((p, i) => (
                    <span key={i} className="font-bold text-center" style={{ color: p.color }}>
                      {getPlanetAbbr(p.name)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Planet Positions and Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {t('birthChart.planetPositions') || 'Planet Positions'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Planet</TableHead>
                        <TableHead>Sign</TableHead>
                        <TableHead>House</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {planetData.map((planet, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium" style={{ color: planet.color }}>
                            {planet.name} {planet.symbol} {planet.retrograde && <span className="text-red-500">R</span>}
                          </TableCell>
                          <TableCell>{SIGNS[planet.sign]}</TableCell>
                          <TableCell>{planet.house}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {t('birthChart.additionalInfo') || 'Additional Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-amber-800">Ascendant:</span> 
                      <span>{vedicChart ? SIGNS[Math.floor(vedicChart.ascendant / 30)] : SIGNS[7]}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-amber-800">Moon Sign:</span> 
                      <span>{SIGNS[planetData.find(p => p.id === "mo")?.sign || 0]}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-amber-800">Sun Sign:</span> 
                      <span>{SIGNS[planetData.find(p => p.id === "su")?.sign || 0]}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-amber-800">Nakshatra:</span> 
                      <span>{vedicChart ? vedicChart.moonNakshatra : "Mula"}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-amber-800">Lunar Day (Tithi):</span> 
                      <span>{vedicChart ? vedicChart.lunarDay : 5}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-amber-800">Element Distribution:</span> 
                      <span>
                        Fire: {planetData.filter(p => [0, 4, 8].includes(p.sign)).length} | 
                        Earth: {planetData.filter(p => [1, 5, 9].includes(p.sign)).length} | 
                        Air: {planetData.filter(p => [2, 6, 10].includes(p.sign)).length} | 
                        Water: {planetData.filter(p => [3, 7, 11].includes(p.sign)).length}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthChartDisplay;
