import React, { useState, useCallback } from 'react';
import { View, DreamInterpretation, DreamExample } from './types';
import HomeView from './components/HomeView';
import ResultView from './components/ResultView';
import DetailView from './components/DetailView';
import { getDreamInterpretation } from './services/geminiService';

// AdSense Ad Placement API 타입을 전역으로 선언합니다.
declare global {
    interface Window {
        adbreak?: (config: {
            type: 'interstitial';
            name: string;
            onBreakDone: (placementInfo: { breakStatus: string }) => void;
            onBreakStart?: () => void;
        }) => void;
        adsbygoogle?: { [key: string]: unknown }[];
    }
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [dreamInput, setDreamInput] = useState<string>('');
  const [selectedDream, setSelectedDream] = useState<DreamExample | null>(null);
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const showInterstitialAd = (onComplete: () => void) => {
    if (typeof window.adbreak === 'function') {
      window.adbreak({
        type: 'interstitial',
        name: 'next_view', // 광고 위치 이름
        onBreakDone: (placementInfo) => {
          console.log(`Ad break status: ${placementInfo.breakStatus}`);
          onComplete();
        },
      });
    } else {
      console.warn('AdBreak function not available. Skipping ad.');
      onComplete(); // 광고 API가 준비되지 않았으면 바로 다음 단계로 진행
    }
  };

  const handleInterpretRequest = useCallback((dream: string) => {
    showInterstitialAd(() => {
      // 광고가 끝나면 결과 화면으로 이동하고 데이터 로딩 시작
      setCurrentView(View.RESULT);
      setDreamInput(dream);
      setIsLoading(true);
      setError(null);
      setInterpretation(null);

      (async () => {
        try {
          const result = await getDreamInterpretation(dream);
          setInterpretation(result);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("알 수 없는 오류가 발생했습니다.");
          }
        } finally {
          setIsLoading(false);
        }
      })();
    });
  }, []);
  
  const handleDreamExampleClick = useCallback((dream: DreamExample) => {
    showInterstitialAd(() => {
      // 광고가 끝나면 상세 화면으로 이동
      setSelectedDream(dream);
      setCurrentView(View.DETAIL);
    });
  }, []);

  const handleReset = () => {
    setCurrentView(View.HOME);
    setDreamInput('');
    setInterpretation(null);
    setSelectedDream(null);
    setError(null);
    setIsLoading(false);
  };
  
  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <HomeView onInterpret={handleInterpretRequest} onExampleClick={handleDreamExampleClick} />;
      case View.RESULT:
        return (
          <ResultView
            dream={dreamInput}
            interpretation={interpretation}
            isLoading={isLoading}
            error={error}
            onReset={handleReset}
          />
        );
      case View.DETAIL:
        if (!selectedDream) {
            handleReset();
            return null;
        }
        return <DetailView dream={selectedDream} onBack={handleReset} />;
      default:
        return <HomeView onInterpret={handleInterpretRequest} onExampleClick={handleDreamExampleClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {renderView()}
    </div>
  );
};

export default App;