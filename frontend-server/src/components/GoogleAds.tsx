
import React, { useEffect, useRef } from 'react';

// Add global type declaration for adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot,
  adFormat = 'auto',
  style,
  className,
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if AdSense is loaded
    if (window.adsbygoogle) {
      try {
        // Push the ad to AdSense for rendering
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    } else {
      console.log('AdSense not loaded yet');
    }
  }, [adSlot]);

  return (
    <div className={className} style={style} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...style
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense Publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAd;
