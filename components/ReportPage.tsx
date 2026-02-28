import React, { useState, useEffect } from 'react';
import type { AnalysisResult } from '../types';
import ActionCard from './ActionCard';
import ResultDashboard from './ResultDashboard';
import PrayerAudioPlayer from './PrayerAudioPlayer';
import TrainingScenarios from './TrainingScenarios';

interface ReportPageProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onGoBack: () => void;
  onGoHome: () => void;
}

const ReportPage: React.FC<ReportPageProps> = ({ result, isLoading, error, onGoBack, onGoHome }) => {
    const [showTraining, setShowTraining] = useState(false);

    // Scroll to top when result loads
    useEffect(() => {
        if (result && !isLoading) {
            window.scrollTo(0, 0);
        }
    }, [result, isLoading]);

    const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <svg className="animate-spin h-12 w-12 text-brand-secondary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="text-xl font-semibold">Generating Your Report...</h3>
          <p className="text-gray-400 mt-2">The AI is assessing your financial health and searching the web for industry benchmarks.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/20 border border-red-500 rounded-lg p-6 my-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-red-300">Analysis Error</h3>
          <p className="text-red-400 mt-2">{error}</p>
          <div className="mt-6 flex gap-4">
              <button
                  onClick={onGoBack}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                  Go Back
              </button>
              <button
                  onClick={onGoHome}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                  Return Home
              </button>
          </div>
        </div>
      );
    }
    
    if (showTraining && result) {
      return <TrainingScenarios result={result} onClose={() => setShowTraining(false)} />;
    }
    
    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
                 <h3 className="text-2xl font-semibold text-gray-300">No report available.</h3>
                 <p className="text-gray-400 mt-2">Please start a new analysis to generate a report.</p>
                 <button
                    onClick={onGoHome}
                    className="mt-4 bg-brand-secondary hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                >
                    Go Home
                </button>
            </div>
        );
    }

    // Check if it's demo based on spiritual perspective text match (simplest way without drilling props deeper if not passed)
    const isDemo = result.zScore === 1.05 && result.zScoreModelUsed === "Z''-Score"; 
    
    return (
      <div id="report-content" className="space-y-8 bg-gray-900 p-4 sm:p-0">
        
        {/* Priority Section: Spiritual Perspective */}
        {result.spiritualPerspective && (
            <div className="bg-gradient-to-br from-brand-primary/20 to-gray-800/20 p-6 rounded-lg border border-brand-secondary/50 shadow-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Spiritual Perspective</h2>
                <PrayerAudioPlayer text={result.spiritualPerspective} isDemo={isDemo} />
            </div>
        )}

        {/* Financial Dashboard */}
        <ResultDashboard result={result} />
        
        {/* Turnaround Plan */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Three-Phase Turnaround Plan</h2>
          <div className="space-y-8">
            {result.turnaroundPlan?.length > 0 ? (
                result.turnaroundPlan.map((phase, phaseIndex) => (
                  phase && (
                    <div key={phaseIndex} className="bg-gray-800/70 p-5 rounded-lg border border-gray-700">
                      <h3 className="text-xl font-bold text-brand-secondary mb-1">{phase.title}</h3>
                      <p className="text-gray-400 mb-4 text-sm italic">{phase.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phase.recommendations?.map((rec, recIndex) => (
                          rec && <ActionCard key={recIndex} recommendation={rec} />
                        ))}
                      </div>
                    </div>
                  )
                ))
            ) : null }
          </div>
        </div>

        {/* Sources */}
        {result.sources?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Sources &amp; References</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <ul className="space-y-2">
                {result.sources.map((source, index) => (
                  <li key={index} className="text-sm">
                    {source.uri && source.uri !== '#' ? (
                       <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:text-blue-400 hover:underline break-all">
                         {source.title || source.uri}
                       </a>
                    ) : (
                       <span className="text-gray-300">{source.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Resources */}
        {result.helpfulResources?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Helpful Resources</h2>
            <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
              <ul className="space-y-2 list-disc list-inside">
                {result.helpfulResources.map((resource, index) => (
                  <li key={index} className="text-sm text-gray-300">
                    <a href={resource.url} className="text-brand-secondary hover:text-blue-400 hover:underline">
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Interactive Training Call-to-Action */}
        <div className="text-center py-6">
            <button
                onClick={() => setShowTraining(true)}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
                Launch Interactive Training Scenarios
            </button>
        </div>

         {/* Footer Navigation Buttons - Re-added explicitly to satisfy user request */}
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-700 pt-8 pb-12">
            <button
                onClick={onGoBack}
                className="w-full sm:w-auto flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-md text-base transition duration-300 shadow-md"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Go Back to Input
            </button>
            <button
                onClick={onGoHome}
                className="w-full sm:w-auto flex items-center justify-center bg-brand-secondary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-md text-base transition duration-300 shadow-md"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return Home
            </button>
        </div>

      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans w-full flex flex-col">
       <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">Financial Analysis Report <span className="ml-2 text-xs align-middle font-semibold text-yellow-300 bg-yellow-900/50 border border-yellow-500 rounded-full px-2 py-1">BETA</span></h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onGoBack}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out"
            >
             Back
            </button>
            <button
              onClick={onGoHome}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out"
            >
             Home
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {renderContent()}
      </main>
       <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy;2025 Corporate Turnaround Centre. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ReportPage;