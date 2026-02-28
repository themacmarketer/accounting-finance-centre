import React, { useState, useMemo } from 'react';
import type { AnalysisResult, TrainingScenario } from '../types';
import { getScenarioRecommendation } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

interface TrainingScenariosProps {
  result: AnalysisResult;
  onClose: () => void;
}

const allScenarios: TrainingScenario[] = [
  // Z-Score based
  {
    title: "Sudden Cash Flow Crisis",
    description: "Your Z-Score is in the 'Distress' zone. An unexpected large expense has wiped out your cash reserves, and you're struggling to make payroll next week. What is your most critical first move?",
    choices: ["Apply for an emergency high-interest loan.", "Immediately cut non-essential operational costs.", "Communicate transparently with employees about a potential delay."],
    requiresInput: true,
    category: 'Z-Score',
  },
  {
    title: "Declining Profit Margins",
    description: "Your Z-Score is in the 'Caution' zone, largely due to shrinking profitability. A major competitor just launched a similar product at a 20% lower price. How do you respond?",
    choices: ["Match their price to stay competitive.", "Launch a marketing campaign focused on your product's superior quality.", "Analyze your cost structure to find savings without sacrificing quality."],
    requiresInput: true,
    category: 'Z-Score',
  },
  {
    title: "Growth vs. Stability",
    description: "Your Z-Score is 'Safe', and you have a healthy cash reserve. A promising but high-risk opportunity to expand into a new market has emerged. It would consume a significant portion of your reserves. What's your decision?",
    choices: ["Invest heavily to capture the market first.", "Conduct a small-scale pilot project to test the market.", "Pass on the opportunity to maintain a strong cash position."],
    requiresInput: true,
    category: 'Z-Score',
  },
  // Financial Ratio based
  {
    title: "Poor Liquidity",
    description: "Your Current Ratio is critically low. A key supplier is demanding upfront payment for a crucial order, but your cash is tied up in receivables. What do you do?",
    choices: ["Offer a discount to key customers for early payment.", "Use a personal credit card to cover the supplier payment.", "Try to renegotiate payment terms with the supplier."],
    requiresInput: false,
    category: 'Financial Ratio',
  },
  {
    title: "High Leverage",
    description: "Your Debt-to-Equity ratio is dangerously high, making it hard to secure new financing. You need capital for a vital equipment upgrade. Where do you turn?",
    choices: ["Seek out venture capital, even if it means giving up significant equity.", "Sell off non-core assets to generate cash.", "Pause the upgrade and focus on paying down existing debt."],
    requiresInput: false,
    category: 'Financial Ratio',
  }
];

const TrainingScenarios: React.FC<TrainingScenariosProps> = ({ result, onClose }) => {
  const [activeScenario, setActiveScenario] = useState<TrainingScenario | null>(null);
  const [userChoice, setUserChoice] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const relevantScenarios = useMemo(() => {
    return allScenarios.filter(s => {
      if (s.category === 'Z-Score') {
        if (s.title.includes(result.zone.charAt(0).toUpperCase() + result.zone.slice(1))) {
            return true;
        }
        return false;
      }
      return true; // Include all financial ratio scenarios for now
    });
  }, [result.zone]);

  const handleScenarioSelect = (scenario: TrainingScenario) => {
    setActiveScenario(scenario);
    setUserChoice('');
    setUserInput('');
    setRecommendation(null);
    setError(null);
  };
  
  const handleGetRecommendation = async () => {
    if (!activeScenario || !userChoice) {
        setError("Please select an action.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
        const rec = await getScenarioRecommendation(activeScenario, userChoice, userInput);
        setRecommendation(rec);
    } catch(e) {
        const err = e as Error;
        console.error(err);
        setError(`Failed to get recommendation: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const renderScenarioSelector = () => (
    <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Interactive Training Scenarios</h2>
        <p className="text-gray-400 mb-6">Select a scenario based on your analysis to test your decision-making and receive AI-powered coaching.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantScenarios.map((scenario, index) => (
                <button
                    key={index}
                    onClick={() => handleScenarioSelect(scenario)}
                    className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
                >
                    <h3 className="font-bold text-brand-secondary">{scenario.title}</h3>
                    <p className="text-sm text-gray-300 mt-1">{scenario.description.substring(0, 100)}...</p>
                </button>
            ))}
        </div>
    </div>
  );

  const renderActiveScenario = () => {
    if (!activeScenario) return null;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700">
            <button onClick={() => setActiveScenario(null)} className="text-sm text-brand-secondary hover:underline mb-4">&larr; Back to Scenarios</button>
            <h3 className="text-xl font-bold text-white">{activeScenario.title}</h3>
            <p className="text-gray-300 my-4">{activeScenario.description}</p>
            
            <div className="space-y-3">
                {activeScenario.choices.map((choice, index) => (
                    <label key={index} className="flex items-center p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600">
                        <input type="radio" name="choice" value={choice} checked={userChoice === choice} onChange={(e) => setUserChoice(e.target.value)} className="h-4 w-4 text-brand-secondary bg-gray-900 border-gray-600 focus:ring-brand-secondary" />
                        <span className="ml-3 text-white">{choice}</span>
                    </label>
                ))}
            </div>

            {activeScenario.requiresInput && (
                <div className="mt-4">
                    <label htmlFor="userInput" className="block text-sm font-medium text-gray-300 mb-1">Provide your own information (optional)</label>
                    <textarea 
                        id="userInput"
                        rows={3}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                        placeholder="Add specific details about your situation..."
                    />
                </div>
            )}
            
            <button onClick={handleGetRecommendation} disabled={isLoading || !userChoice} className="mt-6 w-full bg-brand-secondary hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500 flex items-center justify-center">
                 {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Getting Recommendation...
                    </>
                ) : 'Get AI Mentor Recommendation'}
            </button>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            
            {recommendation && (
                <div className="mt-6 p-4 bg-gray-900/50 border border-brand-secondary/50 rounded-lg">
                    <h4 className="text-lg font-bold text-brand-secondary mb-2">AI Mentor Feedback</h4>
                    <MarkdownRenderer content={recommendation} />
                </div>
            )}
        </div>
    )
  };

  return (
    <div className="space-y-8">
      {activeScenario ? renderActiveScenario() : renderScenarioSelector()}
       <div className="text-center">
         <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md text-sm transition"
        >
            Close Training
        </button>
       </div>
    </div>
  );
};

export default TrainingScenarios;
