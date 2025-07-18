import React from 'react';
import { DreamExample } from '../types';

interface DetailViewProps {
  dream: DreamExample;
  onBack: () => void;
}

const DetailView: React.FC<DetailViewProps> = ({ dream, onBack }) => {
  const { icon, title, description } = dream;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-900 to-indigo-900/50">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl p-6 sm:p-8">
            <header className="text-center mb-6">
                <div className="inline-block p-4 bg-slate-700/50 rounded-full mb-4">
                    {icon}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-100">
                    {title}
                </h1>
            </header>
            
            <main>
                <p className="text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap text-center">
                    {description}
                </p>
            </main>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="py-3 px-8 text-lg font-bold text-white rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailView;
