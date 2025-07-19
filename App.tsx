import React, { useState, useCallback } from 'react';
import { View, DreamInterpretation, DreamExample } from './types';
import HomeView from './components/HomeView';
import ResultView from './components/ResultView';
import DetailView from './components/DetailView';
import { getDreamInterpretation } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [dreamInput, setDreamInput] = useState<string>('');
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDream, setSelectedDream] = useState<DreamExample | null>(null);

  const handleInterpretRequest = useCallback((dream: string) => {
    setDreamInput(dream);
    setCurrentView(View.RESULT);
    setIsLoading(true);
    setError(null);
    setInterpretation(null);

    const performInterpretation = async () => {
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
    };
    
    if (window.adbreak) {
        window.adbreak({
          type: 'next',
          name: 'before_interpretation',
          adBreakDone: (placementInfo) => {
            performInterpretation();
          },
        });
      } else {
        console.warn('Adbreak API not found, proceeding without ad.');
        performInterpretation();
      }

  }, []);

  const handleShowDetail = useCallback((dream: DreamExample) => {
      setSelectedDream(dream);
      setCurrentView(View.DETAIL);
  }, []);

  const handleReset = () => {
    setCurrentView(View.HOME);
    setDreamInput('');
    setInterpretation(null);
    setError(null);
    setIsLoading(false);
    setSelectedDream(null);
  };
  
  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <HomeView onInterpret={handleInterpretRequest} onShowDetail={handleShowDetail} />;
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
        return selectedDream ? <DetailView dream={selectedDream} onReset={handleReset} /> : <HomeView onInterpret={handleInterpretRequest} onShowDetail={handleShowDetail} />;
      default:
        return <HomeView onInterpret={handleInterpretRequest} onShowDetail={handleShowDetail} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {renderView()}
    </div>
  );
};

export default App;