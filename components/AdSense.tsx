import React, { useEffect, useRef } from 'react';

interface AdSenseProps {
  adClient?: string; // e.g. ca-pub-XXXXX
  adSlot?: string;   // optional ad slot id
  className?: string;
  style?: React.CSSProperties;
}

export const AdSense: React.FC<AdSenseProps> = ({ adClient = 'ca-pub-3035416217056603', adSlot, className = '', style }) => {
  const adRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Inject the adsbygoogle script only when this component is used
    if (!(window as any).adsbygoogle && !document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      const s = document.createElement('script');
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
      s.async = true;
      s.crossOrigin = 'anonymous';
      document.head.appendChild(s);

      s.onload = () => {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          // ignore
        }
      };
    } else {
      // If script already present, try to push a slot
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // ignore
      }
    }
  }, [adClient]);

  return (
    <div ref={adRef} className={className} style={style}>
      {/*
        IMPORTANT:
        - Replace `data-ad-slot` with your real ad unit id if you have one.
        - This component intentionally only loads the ads script when it is mounted,
          preventing ads from being served on pages where the component is not rendered (eg. /admin).
      */}
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client={adClient}
           data-ad-slot={adSlot || ''}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};
