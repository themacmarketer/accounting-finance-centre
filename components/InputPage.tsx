import React from 'react';
import InputForm from './InputForm';
import type { AnalysisRequest } from '../types';

interface InputPageProps {
  onAnalyze: (request: Omit<AnalysisRequest, 'userInfo'>) => void;
  isLoading: boolean;
  onGoBack: () => void;
  isDemo: boolean;
  guidanceMode: 'secular' | 'faith-based';
}

const InputPage: React.FC<InputPageProps> = ({ onAnalyze, isLoading, onGoBack, isDemo, guidanceMode }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans w-full flex flex-col">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {isDemo ? 'Demo Analysis Input' : 'Self-Assessment Input'}
              <span className="ml-2 text-xs align-middle font-semibold text-yellow-300 bg-yellow-900/50 border border-yellow-500 rounded-full px-2 py-1">BETA</span>
            </h1>
            <p className="text-gray-400 mt-1">{isDemo ? 'Review the sample data and run the analysis.' : "Provide Your Company's Details for Analysis"}</p>
          </div>
          <button
            onClick={onGoBack}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out"
          >
            Back
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex-grow flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <InputForm onAnalyze={onAnalyze} isLoading={isLoading} isDemo={isDemo} guidanceMode={guidanceMode} />
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy;2025 Corporate Turnaround Centre. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InputPage;