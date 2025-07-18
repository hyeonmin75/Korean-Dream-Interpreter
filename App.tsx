import React, { useState, useCallback } from 'react';
import { View, DreamInterpretation, DreamExample } from './types';
import HomeView from './components/HomeView';
import InterstitialAd from './components/InterstitialAd';
import ResultView from './components/ResultView';
import DetailView from './components/DetailView';
import { getDreamInterpretation } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [postAdView, setPostAdView] = useState<View>(View.RESULT);
  const [dreamInput, setDreamInput] = useState<string>('');
  const [selectedDream, setSelectedDream] = useState<DreamExample | null>(null);
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInterpretRequest = useCallback(async (dream: string) => {
    setDreamInput(dream);
    setPostAdView(View.RESULT);
    setCurrentView(View.AD);
    setIsLoading(true);
    setError(null);
    setInterpretation(null);

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
  }, []);
  
  const handleDreamExampleClick = useCallback((dream: DreamExample) => {
    setSelectedDream(dream);
    setPostAdView(View.DETAIL);
    setCurrentView(View.AD);
  }, []);

  const handleAdComplete = useCallback(() => {
    // isLoading is now controlled by the API call lifecycle.
    setCurrentView(postAdView);
  }, [postAdView]);

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
      case View.AD:
        const adMessage = postAdView === View.RESULT ? "해몽 결과를 불러오는 중..." : "꿈 예시를 불러오는 중...";
        return <InterstitialAd onComplete={handleAdComplete} message={adMessage} />;
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