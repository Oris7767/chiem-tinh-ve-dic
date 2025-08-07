import React, { useEffect, useRef, useState } from 'react';

// Advanced TypeScript definitions for TradingView
interface TradingViewConfig {
  symbol: string;
  interval: string;
  timezone?: string;
  theme?: string;
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id?: string;
  width?: string | number;
  height?: string | number;
  autosize?: boolean;
  hide_top_toolbar?: boolean;
  hide_side_toolbar?: boolean;
  withdateranges?: boolean;
  hide_legend?: boolean;
  save_image?: boolean;
  studies?: string[];
  show_popup_button?: boolean;
  popup_width?: string | number;
  popup_height?: string | number;
  studies_overrides?: Record<string, any>;
  overrides?: Record<string, any>;
  enabled_features?: string[];
  disabled_features?: string[];
  drawings_access?: Record<string, any>;
}

// Ensure this doesn't conflict with the definition in TradingViewChart.tsx
declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewConfig) => any;
    };
  }
}

interface AdvancedTradingViewChartProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
  interval?: string;
  timezone?: string;
  style?: React.CSSProperties;
  chartType?: 'candles' | 'line' | 'bars' | 'heikin-ashi' | 'hollow-candles';
  showToolbar?: boolean;
  showSideToolbar?: boolean;
  showLegend?: boolean;
  enableDrawingTools?: boolean;
  indicators?: string[];
  allowFullscreen?: boolean;
}

const chartStyleMap = {
  'candles': '1',
  'bars': '0',
  'line': '2',
  'heikin-ashi': '8',
  'hollow-candles': '9'
};

const AdvancedTradingViewChart: React.FC<AdvancedTradingViewChartProps> = ({
  symbol = 'NASDAQ:AAPL',
  theme = 'light',
  width = '100%',
  height = 500,
  interval = '1D',
  timezone = 'Asia/Ho_Chi_Minh',
  style = {},
  chartType = 'candles',
  showToolbar = true,
  showSideToolbar = true,
  showLegend = true,
  enableDrawingTools = true,
  indicators = [],
  allowFullscreen = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widgetInstance, setWidgetInstance] = useState<any>(null);
  
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        const containerId = `tradingview-widget-${Math.floor(Math.random() * 10000)}`;
        containerRef.current.id = containerId;
        
        // Prepare features to enable/disable
        const enabledFeatures: string[] = [];
        const disabledFeatures: string[] = [];
        
        if (allowFullscreen) enabledFeatures.push('fullscreen_button');
        else disabledFeatures.push('fullscreen_button');
        
        if (!enableDrawingTools) disabledFeatures.push('drawing_tools');
        if (!showLegend) disabledFeatures.push('legend_widget');

        // Create widget instance with advanced configuration
        const instance = new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: timezone,
          theme: theme,
          style: chartStyleMap[chartType] || '1',
          locale: 'en',
          toolbar_bg: theme === 'dark' ? '#1e293b' : '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId,
          hide_top_toolbar: !showToolbar,
          hide_side_toolbar: !showSideToolbar,
          withdateranges: true,
          studies: indicators,
          save_image: true,
          enabled_features: enabledFeatures,
          disabled_features: disabledFeatures,
        });
        
        setWidgetInstance(instance);
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up the script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [
    symbol, 
    theme, 
    interval, 
    timezone, 
    chartType, 
    showToolbar, 
    showSideToolbar, 
    showLegend, 
    enableDrawingTools, 
    indicators?.join(',')
  ]);
  
  return (
    <div 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        ...style 
      }}
    />
  );
};

export default AdvancedTradingViewChart; 