import React, { useState } from 'react';
import type { AnalysisRequest } from '../types';

const sampleFinancialData = `
BALANCE SHEET (Example SME - Singapore)

ASSETS
Current Assets:
  Cash and Cash Equivalents: $150,000
  Accounts Receivable: $250,000
  Inventory: $300,000
  Total Current Assets: $700,000

Non-Current Assets:
  Property, Plant, and Equipment: $800,000
Total Assets: $1,500,000

LIABILITIES & EQUITY
Current Liabilities:
  Accounts Payable: $200,000
  Short-term Loans: $150,000
  Total Current Liabilities: $350,000

Non-Current Liabilities:
  Long-term Debt: $400,000
Total Liabilities: $750,000

EQUITY
  Share Capital: $500,000
  Retained Earnings: $250,000
Total Equity (Book Value): $750,000
Total Liabilities and Equity: $1,500,000

INCOME STATEMENT

Revenue (Sales): $2,200,000
Cost of Goods Sold: $1,400,000
Gross Profit: $800,000
Operating Expenses (incl. SGA): $550,000
EBIT (Earnings Before Interest and Taxes): $250,000
Interest Expense: $40,000
Pre-tax Income: $210,000
`.trim();

const placeholderText = `Paste your financial statements here...`;

interface InputFormProps {
  onAnalyze: (request: Omit<AnalysisRequest, 'userInfo'>) => void;
  isLoading: boolean;
  isDemo: boolean;
  guidanceMode: 'secular' | 'faith-based';
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading, isDemo, guidanceMode }) => {
  const [request, setRequest] = useState<Omit<AnalysisRequest, 'userInfo'>>({
    statements: isDemo ? sampleFinancialData : '',
    file: null,
    industry: 'service',
    companyType: 'private',
    country: 'Singapore',
    guidanceMode: guidanceMode,
    isDemo: isDemo
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRequest({ ...request, statements: e.target.value, file: null });
    // Clear file input if text is entered
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRequest({ ...request, file: e.target.files[0], statements: '' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(request);
  };
  
  const isSubmitDisabled = isLoading || (!request.statements.trim() && !request.file);
  
  const countryList = [
    "Singapore", "United States", "China", "Japan", "Germany", "United Kingdom",
    "India", "France", "Italy", "Brazil", "Canada", "Russia", "Australia",
    "Argentina", "Indonesia", "Malaysia", "Mexico", "Philippines", "Saudi Arabia",
    "South Africa", "South Korea", "Thailand", "Turkey", "Vietnam"
  ].sort((a, b) => {
    if (a === 'Singapore') return -1;
    if (b === 'Singapore') return 1;
    return a.localeCompare(b);
  });

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">1. Provide Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-300">Industry</label>
                    <select id="industry" name="industry" value={request.industry} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary">
                        <option value="manufacturing">Manufacturing</option>
                        <option value="service">Service / Non-Manufacturing</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="companyType" className="block text-sm font-medium text-gray-300">Company Type</label>
                    <select id="companyType" name="companyType" value={request.companyType} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary">
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                    </select>
                </div>
            </div>
            <div className='mt-4'>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300">Country (For Macroeconomic Context)</label>
                <select id="country" name="country" value={request.country} onChange={handleChange} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary">
                  {countryList.map(country => <option key={country} value={country}>{country}</option>)}
                </select>
            </div>
          </div>
          
          <div>
              <h2 className="text-xl font-bold mt-6 mb-4 text-white">2. Provide Financials</h2>
              <label htmlFor="financial-statements" className="block text-sm font-medium text-gray-300 mb-1">
                  Paste Statements
              </label>
              <textarea
                  id="financial-statements"
                  name="statements"
                  rows={10}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary font-mono text-sm disabled:bg-gray-900"
                  placeholder={placeholderText}
                  value={request.statements}
                  onChange={handleTextChange}
                  disabled={!!request.file}
              />
          </div>

          <div className="relative flex items-center justify-center border-t border-b border-gray-600 py-2">
              <span className="absolute bg-gray-800 px-2 text-gray-400">OR</span>
          </div>

          <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-1">
                  Upload PDF Document
              </label>
              <input 
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/50 file:text-brand-secondary hover:file:bg-brand-primary/80 disabled:opacity-50"
                  disabled={!!request.statements.trim()}
              />
              {request.file && <p className="text-xs text-green-400 mt-2">Selected: {request.file.name}</p>}
          </div>
          
           <p className="text-xs text-gray-400 text-center mt-2">Note: The more complete your financial data, the more accurate the AI analysis will be.</p>
          
          <button 
            type="submit" 
            disabled={isSubmitDisabled} 
            className="w-full bg-brand-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              isDemo ? 'Run Demo Analysis' : 'Calculate & Analyze'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default InputForm;