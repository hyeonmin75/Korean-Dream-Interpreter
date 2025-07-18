import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { DreamInterpretation } from '../types';

interface ResultViewProps {
  dream: string;
  interpretation: DreamInterpretation | null;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
    <p className="text-slate-300">꿈해몽 전문가가 당신의 꿈을 분석하고 있습니다...</p>
  </div>
);

const InterpretationCard: React.FC<{ icon: string, title: string, content: string }> = ({ icon, title, content }) => (
    <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 mb-4 transition-all duration-300 hover:border-purple-500/50">
        <h3 className="font-bold text-xl mb-3 text-purple-300 flex items-center">
            <i className={`fa-solid ${icon} mr-3 w-6 text-center`}></i>
            {title}
        </h3>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
);

const ResultView: React.FC<ResultViewProps> = ({ dream, interpretation, isLoading, error, onReset }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleSaveAsImage = async () => {
    if (!resultRef.current) return;
    try {
      const dataUrl = await toPng(resultRef.current, { 
        backgroundColor: '#0f172a', // slate-900
        pixelRatio: 2, // for better resolution
       });
      const link = document.createElement('a');
      link.download = 'ai-dream-interpretation.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to save image:', err);
      showToast('이미지 저장에 실패했어요.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AI 꿈 해몽가',
      text: `"${dream}"에 대한 AI 꿈 해석 결과를 확인해보세요!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
         // Fallback for desktop browsers
        await navigator.clipboard.writeText(window.location.href);
        showToast('링크가 클립보드에 복사되었어요!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      showToast('공유에 실패했어요.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-900 to-indigo-900/50">
      <div className="w-full max-w-3xl">
        <div ref={resultRef} className="bg-slate-900 rounded-2xl p-4 sm:p-6">
            <div className="bg-slate-800/30 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 mb-6 animate-fade-in-down">
                <h2 className="text-lg font-semibold text-slate-400 mb-2">나의 꿈 이야기</h2>
                {isLoading ? (
                    <p className="text-slate-300 italic">잠시만 기다려주시면 해몽의 결과를 알려드립니다...</p>
                ) : (
                    <p className="text-slate-200 italic">"{dream}"</p>
                )}
            </div>

            <div className="animate-fade-in-up">
                {isLoading && <LoadingSpinner />}
                {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-xl">{error}</div>}
                {interpretation && (
                    <div>
                        <InterpretationCard icon="fa-heading" title="꿈의 제목: " content={interpretation.title} />
                        <InterpretationCard icon="fa-comment-dots" title="종합 해석" content={interpretation.summary} />
                        <InterpretationCard icon="fa-sun" title="긍정적 신호" content={interpretation.positive_aspects} />
                        <InterpretationCard icon="fa-compass" title="삶의 조언" content={interpretation.advice} />
                    </div>
                )}
            </div>
             {interpretation && (
                <div className="text-center text-slate-500 text-sm pt-6">
                    <p>꿈 해몽가</p>
                </div>
             )}
        </div>

        {interpretation && (
             <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <button
                    onClick={handleShare}
                    className="py-3 px-6 text-base font-bold text-white rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/30 flex items-center justify-center"
                >
                    <i className="fa-solid fa-share-nodes mr-2"></i> 공유하기
                </button>
                 <button
                    onClick={handleSaveAsImage}
                    className="py-3 px-6 text-base font-bold text-white rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/30 flex items-center justify-center"
                >
                    <i className="fa-solid fa-camera-retro mr-2"></i> 이미지로 저장
                </button>
                <button
                    onClick={onReset}
                    className="py-3 px-6 text-base font-bold text-white rounded-full bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/30 flex items-center justify-center"
                >
                    <i className="fa-solid fa-arrow-left mr-2"></i> 다른 꿈 해몽하기
                </button>
            </div>
        )}

        {isLoading || error ? (
             <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <button
                onClick={onReset}
                className="py-3 px-8 text-lg font-bold text-white rounded-full bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/30"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i> 처음으로
              </button>
            </div>
        ) : null}

      </div>
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 border border-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ResultView;
