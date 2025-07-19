import React, { useState, useEffect } from 'react';
import { GOOD_DREAMS, BAD_DREAMS } from '../constants';
import { DreamExample } from '../types';
import DisplayAd from './DisplayAd';

interface HomeViewProps {
  onInterpret: (dream: string) => void;
  onShowDetail: (dream: DreamExample) => void;
  isLoading: boolean;
}

const DreamCard: React.FC<{ dream: DreamExample, onShowDetail: (dream: DreamExample) => void }> = ({ dream, onShowDetail }) => {
  const [isAdLoading, setIsAdLoading] = useState(false);
  
  const handleClick = () => {
    setIsAdLoading(true);

    const navigateToDetail = () => {
        onShowDetail(dream);
    };

    setTimeout(() => {
        if (window.adbreak) {
          window.adbreak({
            type: 'browse',
            name: `view_${dream.url.split('/').pop()?.split('.')[0]}`,
            adBreakDone: (placementInfo) => {
              console.log('Ad finished for detail view:', placementInfo.breakStatus);
              navigateToDetail();
            },
          });
        } else {
          console.warn('Adbreak API not found, proceeding without ad.');
          navigateToDetail();
        }
    }, 50);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdLoading}
      className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-lg transition-all duration-300 ease-in-out text-left p-4 flex items-center justify-between hover:bg-slate-700/50 hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-wait"
      aria-label={`${dream.title} 예시 보기`}
    >
      <div className="flex items-center space-x-4 overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            {isAdLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-400"></div> : dream.icon}
        </div>
        <h3 className="font-bold text-slate-100 truncate">{dream.title}</h3>
      </div>
      <div className="text-slate-400 flex-shrink-0 ml-4">
        {!isAdLoading && <i className="fa-solid fa-chevron-right"></i>}
      </div>
    </button>
  );
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const HomeView: React.FC<HomeViewProps> = ({ onInterpret, onShowDetail, isLoading }) => {
  const [dream, setDream] = useState('');
  const [goodDreamExamples, setGoodDreamExamples] = useState<DreamExample[]>([]);
  const [badDreamExamples, setBadDreamExamples] = useState<DreamExample[]>([]);

  useEffect(() => {
    setGoodDreamExamples(shuffleArray(GOOD_DREAMS).slice(0, 5));
    setBadDreamExamples(shuffleArray(BAD_DREAMS).slice(0, 5));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim() && !isLoading) {
      onInterpret(dream.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-slate-900 to-indigo-900/50">
       <div className="w-full max-w-2xl py-8 sm:py-12">
        <header className="mb-8 animate-fade-in-down text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 mb-2">
            꿈 해몽가
            </h1>
            <p className="text-slate-300 text-lg">당신의 꿈에 담긴 비밀을 풀어보세요</p>
        </header>

        <main className="w-full">
            <form onSubmit={handleSubmit} className="mb-8 animate-fade-in-up">
            <textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="어젯밤에 꾼 꿈 이야기를 자세하게 적어주세요..."
                className="w-full h-40 p-4 bg-slate-800/60 border border-slate-700 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 text-slate-200 placeholder-slate-500"
                aria-label="Dream description input"
            />
            <button
                type="submit"
                disabled={!dream.trim() || isLoading}
                className="w-full mt-4 py-4 px-6 text-lg font-bold text-white rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-wait transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                        <span>해석을 준비 중입니다...</span>
                    </>
                ) : (
                    <>
                        무료 해석 받기 <i className="fa-solid fa-arrow-right ml-2"></i>
                    </>
                )}
            </button>
            </form>
            
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <DisplayAd adSlot="9165067558" />
            </div>

            <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <section>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 text-left">
                    <i className="fa-solid fa-sun text-yellow-300 mr-2"></i>
                    대표적인 길몽
                </h2>
                <div className="grid grid-cols-1 gap-3">
                {goodDreamExamples.map((dream, index) => (
                    <DreamCard key={`good-${index}`} dream={dream} onShowDetail={onShowDetail} />
                ))}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-200 mb-4 text-left">
                    <i className="fa-solid fa-moon text-slate-400 mr-2"></i>
                    대표적인 흉몽
                </h2>
                <div className="grid grid-cols-1 gap-3">
                {badDreamExamples.map((dream, index) => (
                    <DreamCard key={`bad-${index}`} dream={dream} onShowDetail={onShowDetail} />
                ))}
                </div>
            </section>
            </div>
        </main>

        <footer className="w-full mt-12 text-center text-slate-500 text-sm animate-fade-in-up" style={{animationDelay: '1s'}}>
            <p>꿈 해몽은 과학적 근거가 없으며, 재미로 참고하는 것을 권장합니다.</p>
        </footer>
       </div>
    </div>
  );
};

export default HomeView;