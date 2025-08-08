import React, { useEffect, useRef } from 'react';

// Define TradingView widget configuration type
interface TradingViewConfig {
  autosize?: boolean;
  symbol: string;
  interval: string;
  timezone?: string;
  theme?: string;
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  allow_symbol_change?: boolean;
  container_id: string;
  hide_side_toolbar?: boolean;
  [key: string]: any;
}

// Add TypeScript definitions for TradingView
declare global {
  interface Window {
    TradingView: {
      widget: new (config: TradingViewConfig) => any;
    };
  }
}

interface TradingViewChartProps {
  symbol?: string;
  theme?: 'light' | 'dark';
  width?: string | number;
  height?: string | number;
  interval?: string;
  timezone?: string;
  style?: React.CSSProperties;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'NASDAQ:AAPL',
  theme = 'light',
  width = '100%',
  height = 500,
  interval = '1D',
  timezone = 'Asia/Ho_Chi_Minh',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: interval,
          timezone: timezone,
          theme: theme,
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          hide_side_toolbar: false,
        });
      }
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up the script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, theme, interval, timezone]);
  
  return (
    <div 
      id="tradingview-widget-container" 
      ref={containerRef} 
      style={{ 
        width, 
        height, 
        ...style 
      }}
    />
  );
};

export default TradingViewChart; 