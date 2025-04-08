import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sun, Moon, Saturn, Jupiter, MapPin, Calendar, Clock } from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { SEO } from '@/utils/seo';

// Types
type Planet = {
  id: string;
  name: string;
  symbol: string;
  longitude: number;
  house: number;
  sign: number;
  retrograde: boolean;
};

type House = {
  number: number;
  longitude: number;
  sign: number;
};

type ChartData = {
  planets: Planet[];
  houses: House[];
  ascendant: number;
  moonNakshatra: string;
  lunarDay: number;
};

// Constants
const SIGNS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", 
  "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
  "Tula (Libra)", "Vrishchika (Scorpio)", "Dhanu (Sagittarius)", 
  "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", 
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", 
  "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", 
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", 
  "Uttara Bhadrapada", "Revati"
];

const PLANETS = [
  { id: "su", name: "Sun", symbol: "☉", color: "#FFB900" },
  { id: "mo", name: "Moon", symbol: "☽", color: "#DDDDDD" },
  { id: "me", name: "Mercury", symbol: "☿", color: "#33CC33" },
  { id: "ve", name: "Venus", symbol: "♀", color: "#FF66FF" },
  { id: "ma", name: "Mars", symbol: "♂", color: "#FF3300" },
  { id: "ju", name: "Jupiter", symbol: "♃", color: "#FFCC00" },
  { id: "sa", name: "Saturn", symbol: "♄", color: "#0066CC" },
  { id: "ra", name: "Rahu", symbol: "☊", color: "#666666" },
  { id: "ke", name: "Ketu", symbol: "☋", color: "#996633" }
];

// Mock calculation functions (in a real app, these would use a proper ephemeris library)
const calculatePlanetPositions = (
  date: DateTime, 
  latitude: number, 
  longitude: number
): Planet[] => {
  const sunLongitude = (date.toJulianDay() % 365.25) * (360 / 365.25);
  const moonLongitude = (date.toMillis() % (28 * 24 * 3600 * 1000)) * (360 / (28 * 24 * 3600 * 1000));
  const mercuryLongitude = (date.toMillis() % (88 * 24 * 3600 * 1000)) * (360 / (88 * 24 * 3600 * 1000));
  const venusLongitude = (date.toMillis() % (225 * 24 * 3600 * 1000)) * (360 / (225 * 24 * 3600 * 1000));
  const marsLongitude = (date.toMillis() % (687 * 24 * 3600 * 1000)) * (360 / (687 * 24 * 3600 * 1000));
  const jupiterLongitude = (date.toMillis() % (4332 * 24 * 3600 * 1000)) * (360 / (4332 * 24 * 3600 * 1000));
  const saturnLongitude = (date.toMillis() % (10759 * 24 * 3600 * 1000)) * (360 / (10759 * 24 * 3600 * 1000));
  const rahuLongitude = (date.toMillis() % (6793 * 24 * 3600 * 1000)) * (360 / (6793 * 24 * 3600 * 1000));
  const ketuLongitude = (date.toMillis() % (6793 * 24 * 3600 * 1000)) * (360 / (6793 * 24 * 3600 * 1000));

  return [
    { id: "su", name: "Sun", symbol: "☉", longitude: sunLongitude, house: 1, sign: Math.floor(sunLongitude / 30), retrograde: false },
    { id: "mo", name: "Moon", symbol: "☽", longitude: moonLongitude, house: 2, sign: Math.floor(moonLongitude / 30), retrograde: false },
    { id: "me", name: "Mercury", symbol: "☿", longitude: mercuryLongitude, house: 3, sign: Math.floor(mercuryLongitude / 30), retrograde: false },
    { id: "ve", name: "Venus", symbol: "♀", longitude: venusLongitude, house: 4, sign: Math.floor(venusLongitude / 30), retrograde: false },
    { id: "ma", name: "Mars", symbol: "♂", longitude: marsLongitude, house: 5, sign: Math.floor(marsLongitude / 30), retrograde: false },
    { id: "ju", name: "Jupiter", symbol: "♃", longitude: jupiterLongitude, house: 6, sign: Math.floor(jupiterLongitude / 30), retrograde: false },
    { id: "sa", name: "Saturn", symbol: "♄", longitude: saturnLongitude, house: 7, sign: Math.floor(saturnLongitude / 30), retrograde: false },
    { id: "ra", name: "Rahu", symbol: "☊", longitude: rahuLongitude, house: 8, sign: Math.floor(rahuLongitude / 30), retrograde: false },
    { id: "ke", name: "Ketu", symbol: "☋", longitude: ketuLongitude, house: 9, sign: Math.floor(ketuLongitude / 30), retrograde: false },
  ].map(planet => ({ ...planet, house: Math.floor(Math.random() * 12) + 1, sign: Math.floor(Math.random() * 12) }));
};

const calculateHouses = (
  date: DateTime, 
  latitude: number, 
  longitude: number
): House[] => {
  const ascendant = (date.toMillis() % (24 * 3600 * 1000)) * (360 / (24 * 3600 * 1000));
  return Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    longitude: (ascendant + i * 30) % 360,
    sign: Math.floor(((ascendant + i * 30) % 360) / 30)
  }));
};

const calculateChart = (
  birthDate: DateTime, 
  latitude: number, 
  longitude: number
): ChartData => {
  const planets = calculatePlanetPositions(birthDate, latitude, longitude);
  const houses = calculateHouses(birthDate, latitude, longitude);
  const ascendant = houses[0].longitude;
  const moon = planets.find(p => p.id === 'mo');
  const moonSign = moon ? moon.sign : 0;
  const moonLongitude = moon ? moon.longitude : 0;
  const nakshatraIndex = Math.floor((moonLongitude - (moonSign * 30)) * 27 / 360);
  const moonNakshatra = NAKSHATRAS[nakshatraIndex];
  const lunarDay = Math.floor((birthDate.day / 30) * 30) + 1;

  return {
    planets,
    houses,
    ascendant,
    moonNakshatra: moonNakshatra || 'Unknown',
    lunarDay,
  };
};

// Main component
const VedicAstrologyChart = () => {
  const [birthDate, setBirthDate] = useState<string>(DateTime.now().toFormat("yyyy-MM-dd"));
  const [birthTime, setBirthTime] = useState<string>(DateTime.now().toFormat("HH:mm"));
  const [latitude, setLatitude] = useState<number>(21.03);
  const [longitude, setLongitude] = useState<number>(105.85);
  const [timezone, setTimezone] = useState<string>("Asia/Ho_Chi_Minh");
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const generateChart = () => {
    const dateTime = DateTime.fromFormat(
      `${birthDate} ${birthTime}`, 
      "yyyy-MM-dd HH:mm", 
      { zone: timezone }
    );
    
    if (dateTime.isValid) {
      const data = calculateChart(dateTime, latitude, longitude);
      setChartData(data);
    }
  };

  // Chart rendering data
  const prepareChartData = () => {
    if (!chartData) return [];
    
    // Create 12 segments for the houses
    return Array.from({ length: 12 }, (_, i) => ({
      name: `House ${i + 1}`,
      value: 1,
      sign: (chartData.houses[0].sign + i) % 12,
      planets: chartData.planets.filter(p => p.house === i + 1)
    }));
  };

  const chartSegments = prepareChartData();

  // Structured data for SEO
  const astrologyChartJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Bản đồ Sao Chiêm tinh Vệ Đà",
    "description": "Công cụ tạo bản đồ sao dựa trên nguyên lý chiêm tinh Vệ Đà",
    "applicationCategory": "Astrology Tool",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Bản đồ Sao Chiêm tinh Vệ Đà"
        description="Tạo và phân tích bản đồ sao dựa trên nguyên lý chiêm tinh Vệ Đà. Khám phá các vị trí hành tinh, cung, và ảnh hưởng của chúng đến cuộc sống của bạn."
        keywords="bản đồ sao, chiêm tinh, vệ đà, astrology, birth chart, jyotish"
        canonicalUrl="/birth-chart"
        jsonLd={astrologyChartJsonLd}
      />
      <NavBar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Bản đồ Sao Chiêm tinh Vệ Đà</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin đầu vào</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ngày sinh
                </label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  aria-label="Birth date"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Giờ sinh
                </label>
                <Input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  aria-label="Birth time"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Vĩ độ
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  placeholder="Vĩ độ (ví dụ: 21.03 cho Hà Nội)"
                  aria-label="Latitude"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Kinh độ
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  placeholder="Kinh độ (ví dụ: 105.85 cho Hà Nội)"
                  aria-label="Longitude"
                />
              </div>
              
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label htmlFor="timezone">Múi giờ</label>
                <select 
                  id="timezone"
                  className="p-2 border rounded"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  aria-label="Timezone"
                >
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                  <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                  <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <Button 
                  className="w-full mt-4"
                  onClick={generateChart}
                  aria-label="Generate chart"
                >
                  Tạo Bản đồ Sao
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {chartData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bản đồ Sao</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartSegments}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={0}
                        dataKey="value"
                        label={({ sign, planets }) => {
                          return SIGNS[sign].split(' ')[0];
                        }}
                      >
                        {chartSegments.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${(entry.sign * 30) % 360}, 70%, 80%)`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-2 border rounded shadow">
                                <p>House {data.name}</p>
                                <p>Sign: {SIGNS[data.sign]}</p>
                                <p>Planets: {data.planets.map(p => p.symbol).join(' ')}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Thông tin chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="planets">
                  <TabsList className="mb-4">
                    <TabsTrigger value="planets">Các hành tinh</TabsTrigger>
                    <TabsTrigger value="houses">Các cung</TabsTrigger>
                    <TabsTrigger value="summary">Tổng quan</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="planets">
                    <div className="space-y-2">
                      {chartData.planets.map((planet) => (
                        <div key={planet.id} className="flex items-center justify-between p-2 border-b">
                          <div className="flex items-center">
                            <span 
                              className="text-xl mr-2" 
                              style={{ color: PLANETS.find(p => p.id === planet.id)?.color }}
                              aria-hidden="true"
                            >
                              {planet.symbol}
                            </span>
                            <span>{planet.name}</span>
                            {planet.retrograde && <span className="ml-2 text-red-500">R</span>}
                          </div>
                          <div className="text-right">
                            <div>{SIGNS[planet.sign]}</div>
                            <div className="text-sm text-gray-500">
                              House {planet.house} • {planet.longitude.toFixed(2)}°
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="houses">
                    <div className="space-y-2">
                      {chartData.houses.map((house) => (
                        <div key={house.number} className="flex justify-between p-2 border-b">
                          <div>House {house.number}</div>
                          <div className="text-right">
                            <div>{SIGNS[house.sign]}</div>
                            <div className="text-sm text-gray-500">{house.longitude.toFixed(2)}°</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="summary">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold">Ascendant (Lagna)</h3>
                        <p>{SIGNS[Math.floor(chartData.ascendant / 30)]} • {chartData.ascendant.toFixed(2)}°</p>
                      </div>
                      
                      <div>
                        <h3 className="font-bold">Moon Nakshatra</h3>
                        <p>{chartData.moonNakshatra}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-bold">Lunar Day (Tithi)</h3>
                        <p>{chartData.lunarDay}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-bold">Dominant Elements</h3>
                        <p>Fire: {chartData.planets.filter(p => [0, 4, 8].includes(p.sign)).length}</p>
                        <p>Earth: {chartData.planets.filter(p => [1, 5, 9].includes(p.sign)).length}</p>
                        <p>Air: {chartData.planets.filter(p => [2, 6, 10].includes(p.sign)).length}</p>
                        <p>Water: {chartData.planets.filter(p => [3, 7, 11].includes(p.sign)).length}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VedicAstrologyChart;
