import React from 'react';
import type { AnalysisResult } from '../types';
import ScoreGauge from './ScoreGauge';
import MarkdownRenderer from './MarkdownRenderer';

interface ResultDashboardProps {
  result: AnalysisResult;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ result }) => {
  return (
    <>
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <ScoreGauge score={result.zScore} zone={result.zone} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">AI Financial Health Analysis</h2>
          <MarkdownRenderer content={result.explanation} />
        </div>
      </div>
      
      <div className="bg-gray-800/70 border border-gray-700 p-5 rounded-lg">
          <h3 className="text-xl font-bold text-brand-secondary mb-3">Z-Score Model Analysis</h3>
          <p className="text-sm text-gray-400 mb-4">{result.zScoreModelDescription}</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="col-span-1 sm:col-span-1 my-auto">
                  <div className="text-sm font-semibold text-gray-300">Model Used</div>
                  <div className="text-2xl font-bold text-white mt-1">{result.zScoreModelUsed}</div>
              </div>
              <div className="bg-distress/20 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-distress">Distress Zone</div>
                  <div className="font-mono text-white mt-1">{result.zScoreModelBenchmarks?.distress}</div>
              </div>
              <div className="bg-caution/20 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-caution">Caution Zone</div>
                  <div className="font-mono text-white mt-1">{result.zScoreModelBenchmarks?.caution}</div>
              </div>
              <div className="bg-safe/20 p-3 rounded-lg">
                  <div className="text-sm font-semibold text-safe">Safe Zone</div>
                  <div className="font-mono text-white mt-1">{result.zScoreModelBenchmarks?.safe}</div>
              </div>
          </div>
      </div>
    </>
  );
};

export default ResultDashboard;