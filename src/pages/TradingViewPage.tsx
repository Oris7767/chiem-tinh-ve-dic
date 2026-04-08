import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TradingViewChart from '../components/TradingViewChart';
import AdvancedTradingViewChart from '../components/AdvancedTradingViewChart';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Breadcrumbs from '../components/Breadcrumbs';

const POPULAR_SYMBOLS = [
  { name: 'Apple', symbol: 'NASDAQ:AAPL' },
  { name: 'Google', symbol: 'NASDAQ:GOOGL' },
  { name: 'Microsoft', symbol: 'NASDAQ:MSFT' },
  { name: 'Amazon', symbol: 'NASDAQ:AMZN' },
  { name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT' },
  { name: 'Ethereum', symbol: 'BINANCE:ETHUSDT' },
];

const TIMEFRAMES = [
  { name: '1 minute', value: '1' },
  { name: '5 minutes', value: '5' },
  { name: '15 minutes', value: '15' },
  { name: '30 minutes', value: '30' },
  { name: '1 hour', value: '60' },
  { name: '4 hours', value: '240' },
  { name: '1 day', value: 'D' },
  { name: '1 week', value: 'W' },
  { name: '1 month', value: 'M' },
];

const CHART_TYPES = [
  { name: 'Candles', value: 'candles' },
  { name: 'Bars', value: 'bars' },
  { name: 'Line', value: 'line' },
  { name: 'Heikin-Ashi', value: 'heikin-ashi' },
  { name: 'Hollow Candles', value: 'hollow-candles' },
];

const POPULAR_INDICATORS = [
  { name: 'Moving Average (MA)', value: 'MASimple@tv-basicstudies' },
  { name: 'MACD', value: 'MACD@tv-basicstudies' },
  { name: 'RSI', value: 'RSI@tv-basicstudies' },
  { name: 'Bollinger Bands', value: 'BB@tv-basicstudies' },
  { name: 'Volume', value: 'Volume@tv-basicstudies' },
];

const TradingViewPage = () => {
  const [symbol, setSymbol] = useState<string>('NASDAQ:AAPL');
  const [interval, setInterval] = useState<string>('D');
  const [customSymbol, setCustomSymbol] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [chartType, setChartType] = useState<string>('candles');
  const [showToolbar, setShowToolbar] = useState<boolean>(true);
  const [showSideToolbar, setShowSideToolbar] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [enableDrawingTools, setEnableDrawingTools] = useState<boolean>(true);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  
  const handleSelectSymbol = (value: string) => {
    setSymbol(value);
  };
  
  const handleSetCustomSymbol = () => {
    if (customSymbol.trim()) {
      setSymbol(customSymbol.trim());
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleIndicatorChange = (indicator: string) => {
    setSelectedIndicators(current => {
      if (current.includes(indicator)) {
        return current.filter(i => i !== indicator);
      } else {
        return [...current, indicator];
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Trading Charts | Financial Analysis Tools</title>
        <meta name="description" content="Analyze market trends with real-time trading charts. Make informed financial decisions with professional-grade technical analysis tools." />
        <meta name="keywords" content="trading view, stock charts, market analysis, financial tools, technical analysis" />
      </Helmet>

      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs />

        <h1 className="text-3xl font-bold mb-6">Trading Charts</h1>

        <div className="mb-6 flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={advancedMode}
              onCheckedChange={setAdvancedMode}
            />
            <Label htmlFor="advanced-mode">Advanced Mode</Label>
          </div>
        </div>
        
        <Tabs defaultValue="chart" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            {advancedMode && <TabsTrigger value="indicators">Indicators</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="chart">
            <Card>
              <CardContent className="p-0 overflow-hidden rounded-lg">
                {advancedMode ? (
                  <AdvancedTradingViewChart 
                    symbol={symbol} 
                    interval={interval}
                    theme={theme}
                    height={600}
                    width="100%"
                    chartType={chartType as any}
                    showToolbar={showToolbar}
                    showSideToolbar={showSideToolbar}
                    showLegend={showLegend}
                    enableDrawingTools={enableDrawingTools}
                    indicators={selectedIndicators}
                  />
                ) : (
                  <TradingViewChart 
                    symbol={symbol} 
                    interval={interval}
                    theme={theme}
                    height={600}
                    width="100%"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Popular Symbols</label>
                    <Select onValueChange={handleSelectSymbol} value={symbol}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        {POPULAR_SYMBOLS.map((item) => (
                          <SelectItem key={item.symbol} value={item.symbol}>
                            {item.name} ({item.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Symbol</label>
                    <div className="flex gap-2">
                      <Input 
                        value={customSymbol} 
                        onChange={(e) => setCustomSymbol(e.target.value)}
                        placeholder="e.g. BINANCE:BTCUSDT" 
                      />
                      <Button onClick={handleSetCustomSymbol}>Apply</Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Timeframe</label>
                    <Select onValueChange={setInterval} value={interval}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMEFRAMES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Button onClick={toggleTheme} variant="outline" className="w-full">
                      {theme === 'light' ? 'Dark Theme' : 'Light Theme'}
                    </Button>
                  </div>
                  
                  {advancedMode && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-2">Chart Type</label>
                        <Select onValueChange={setChartType} value={chartType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select chart type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CHART_TYPES.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="show-toolbar"
                            checked={showToolbar}
                            onCheckedChange={setShowToolbar}
                          />
                          <Label htmlFor="show-toolbar">Show Toolbar</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="show-side-toolbar"
                            checked={showSideToolbar}
                            onCheckedChange={setShowSideToolbar}
                          />
                          <Label htmlFor="show-side-toolbar">Show Side Toolbar</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="show-legend"
                            checked={showLegend}
                            onCheckedChange={setShowLegend}
                          />
                          <Label htmlFor="show-legend">Show Legend</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="enable-drawing"
                            checked={enableDrawingTools}
                            onCheckedChange={setEnableDrawingTools}
                          />
                          <Label htmlFor="enable-drawing">Enable Drawing Tools</Label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {advancedMode && (
            <TabsContent value="indicators">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Technical Indicators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {POPULAR_INDICATORS.map((indicator) => (
                      <div key={indicator.value} className="flex items-center space-x-2">
                        <Switch
                          id={`indicator-${indicator.value}`}
                          checked={selectedIndicators.includes(indicator.value)}
                          onCheckedChange={() => handleIndicatorChange(indicator.value)}
                        />
                        <Label htmlFor={`indicator-${indicator.value}`}>{indicator.name}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <Footer />
    </>
  );
};

export default TradingViewPage; 