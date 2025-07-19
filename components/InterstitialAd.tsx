
import React, { useEffect } from 'react';

interface InterstitialAdProps {
  onComplete: () => void;
  message?: string;
}

// 애드센스 타입 정의 (window 객체 확장)
declare global {
    interface Window {
        adsbygoogle?: { [key: string]: unknown }[];
    }
}

const InterstitialAd: React.FC<InterstitialAdProps> = ({ onComplete, message }) => {
  const DURATION = 6000; // 6 seconds. 애드센스 정책상 광고가 로드되고 사용자가 상호작용할 시간을 충분히 주어야 합니다.

  // 타이머를 이용해 광고 표시 후 자동으로 다음 페이지로 넘어갑니다.
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // 컴포넌트가 마운트될 때 애드센스에 광고를 요청합니다.
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-900">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">{message || "결과를 불러오는 중..."}</h2>
        <p className="text-slate-400 mb-8">잠시 광고가 표시된 후 결과 화면으로 이동합니다.</p>
        
        {/* ▼▼▼ 애드센스 디스플레이 광고 단위 코드 ▼▼▼ */}
        {/* 스타일은 광고가 잘 보이도록 조정할 수 있습니다. 예: min-h-[250px] */}
        {/* data-ad-client와 data-ad-slot을 본인의 코드로 교체해주세요. */}
        <div className="bg-slate-800 rounded-lg p-4 flex justify-center items-center min-h-[280px] w-full">
             <ins className="adsbygoogle"
                 style={{ display: 'block', width: '100%' }}
                 data-ad-client="ca-pub-9110596823822061" // 본인의 게시자 ID로 변경
                 data-ad-slot="9165067558"             // 본인의 광고 단위 슬롯 ID로 변경
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
        {/* ▲▲▲ 애드센스 디스플레이 광고 단위 코드 ▲▲▲ */}

         <p className="text-xs text-slate-500 mt-4">잠시 후 자동으로 다음 화면으로 이동합니다.</p>
      </div>
    </div>
  );
};

export default InterstitialAd;
