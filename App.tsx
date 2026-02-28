import React, { useState } from 'react';
import { AnalysisResult, AnalysisRequest, UserInfo } from './types';
import { getFinancialAnalysis } from './services/geminiService';
import LandingPage from './components/LandingPage';
import InputPage from './components/InputPage';
import ReportPage from './components/ReportPage';
import DisclaimerPage from './components/DisclaimerPage';
import VirtualAssistant from './components/VirtualAssistant';
import Feedback from './components/Feedback';

interface AnalysisConfig {
  isDemo: boolean;
  guidanceMode: 'secular' | 'faith-based';
}

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'disclaimer' |'landing' | 'input' | 'report'>('disclaimer');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig | null>(null);

  const handleAnalysis = async (request: Omit<AnalysisRequest, 'userInfo'>) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setView('report'); 

    try {
      if (!request.statements && !request.file) {
        throw new Error("Please paste your financial statements or upload a PDF file.");
      }
      
      const fullRequest: AnalysisRequest = { ...request, userInfo };
      const result = await getFinancialAnalysis(fullRequest);
      setAnalysisResult(result);

    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setAnalysisConfig(null);
    setView('landing');
  };

  const handleGoBack = () => {
    if (view === 'report') {
      setAnalysisResult(null);
      setError(null);
      setView('input');
    } else if (view === 'input') {
      setAnalysisConfig(null);
      setView('landing');
    }
  };
  
  const handleAgree = (info: UserInfo) => {
    setUserInfo(info);
    setView('landing');
  }

  const handleStart = (isDemo: boolean, guidanceMode: 'secular' | 'faith-based') => {
    setAnalysisConfig({ isDemo, guidanceMode });
    setView('input');
  };
  
  const renderView = () => {
    switch(view) {
      case 'disclaimer':
        return <DisclaimerPage onAgree={handleAgree} />;
      case 'landing':
        return <LandingPage onStart={handleStart} />;
      case 'input':
        if (!analysisConfig) {
          // Should not happen in normal flow, but good practice to handle
          return <LandingPage onStart={handleStart} />;
        }
        return <InputPage onAnalyze={handleAnalysis} isLoading={isLoading} onGoBack={handleGoBack} {...analysisConfig} />;
      case 'report':
        return <ReportPage result={analysisResult} isLoading={isLoading} error={error} onGoBack={handleGoBack} onGoHome={handleGoHome} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen">
      {renderView()}
      {view !== 'disclaimer' && (
        <>
          <VirtualAssistant />
          <Feedback />
        </>
      )}
    </div>
  );
};

export default App;