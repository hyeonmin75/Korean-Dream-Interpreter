import React, { useEffect } from 'react';

interface DisplayAdProps {
  adSlot: string;
}

declare global {
    interface Window {
        adsbygoogle?: { [key: string]: unknown }[];
    }
}

const DisplayAd: React.FC<DisplayAdProps> = ({ adSlot }) => {
  useEffect(() => {
    // Wrap the ad push in a timeout to ensure the container is sized correctly.
    const timer = setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error("AdSense error:", err);
        }
    }, 100);

    // Cleanup function to clear the timeout if the component unmounts.
    return () => clearTimeout(timer);
  }, [adSlot]);

  return (
    <div className="my-6 text-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9110596823822061"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default DisplayAd;