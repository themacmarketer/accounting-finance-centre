import React from 'react';

interface LandingPageProps {
  onStart: (isDemo: boolean, guidanceMode: 'secular' | 'faith-based') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans w-full overflow-y-auto">
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            AI-Powered Financial Health & Business Turnaround Analysis
            <span className="ml-2 text-xs align-middle font-semibold text-yellow-300 bg-yellow-900/50 border border-yellow-500 rounded-full px-2 py-1">BETA</span>
          </h1>
          <p className="text-brand-secondary text-xl md:text-2xl font-medium max-w-4xl mx-auto">
            Financial Analysis using Altman Z Score and Three phases of turnaround and eight Centres of Excellence
          </p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8 space-y-12">
        
        {/* Description Section - Placed at the front as requested */}
        <section className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-xl border border-gray-600 shadow-2xl">
             <div className="flex flex-col md:flex-row items-start gap-6">
                 <div className="flex-1">
                     <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        About the Centre
                     </h2>
                     <p className="text-gray-300 leading-relaxed text-lg text-justify">
                        The Accounting and Financial Centre of Excellence acts as the heart of the Corporate Turnaround Centre, specializing in rapid, AI-driven assessment of financial health for SMEs. Using advanced tools like the Altman Z-Score, it triages financial risks, diagnosing cash flow issues and solvency challenges with precision. This centre provides actionable insights and tailored recovery plans to stabilize and revitalize businesses. It also offers targeted training to empower clients in financial management and resilience building using Dr Teng's turnaround methodology.
                     </p>
                 </div>
             </div>
        </section>
        
        {/* Call to Action */}
        <section className="text-center py-4">
            <h2 className="text-3xl font-bold mb-8 text-white">Choose Your Analysis Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                {/* Self-Assessment Card */}
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex flex-col items-center shadow-lg hover:shadow-2xl hover:border-brand-secondary transition-all duration-300">
                    <div className="p-3 bg-brand-primary/20 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Self-Assessment</h3>
                    <p className="text-gray-400 mb-6 flex-grow">Analyze your own company's financial statements to get a detailed health report and turnaround plan.</p>
                    <div className="space-y-4 w-full max-w-xs">
                        <button 
                            onClick={() => onStart(false, 'secular')} 
                            className="w-full bg-brand-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Start Secular Analysis
                        </button>
                        <button 
                            onClick={() => onStart(false, 'faith-based')} 
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            Start Faith-Based Analysis
                        </button>
                    </div>
                </div>

                {/* Demo Card */}
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex flex-col items-center shadow-lg hover:shadow-2xl hover:border-brand-secondary transition-all duration-300">
                    <div className="p-3 bg-purple-900/20 rounded-full mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Run a Demo</h3>
                    <p className="text-gray-400 mb-6 flex-grow">See a sample report generated from pre-filled data instantly.</p>
                    <div className="space-y-4 w-full max-w-xs">
                        <button 
                            onClick={() => onStart(true, 'secular')} 
                            className="w-full bg-brand-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            View Secular Demo
                        </button>
                        <button 
                            onClick={() => onStart(true, 'faith-based')} 
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        >
                            View Faith-Based Demo
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* Quick Assessment Section - Added exactly as requested */}
        <section className="text-center py-4">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 flex flex-col md:flex-row items-center justify-between shadow-lg hover:shadow-2xl hover:border-green-500 transition-all duration-300 gap-6 text-left">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-green-900/20 rounded-full flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Quick Assessment</h3>
                            <p className="text-gray-400">Access our external rapid advisory tool for an immediate high-level overview of your fiscal position.</p>
                        </div>
                    </div>
                    <div className="w-full md:w-auto">
                        <a 
                            href="https://www.fiscaladvisory.org" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block w-full md:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-center whitespace-nowrap"
                        >
                            Launch Quick Assessment
                        </a>
                    </div>
                </div>
            </div>
        </section>

        {/* Z-Score Section */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Understanding the Altman Z-Score</h2>
          <p className="text-center text-gray-300 max-w-3xl mx-auto mb-8">
            The Altman Z-score model is a financial formula developed by Edward Altman in 1968 to predict the likelihood of a company going bankrupt within the next two years. It uses a combination of five financial ratios related to profitability, leverage, liquidity, solvency, and activity to provide a numerical score.
          </p>
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-200">Z-Score Variants</h3>
          <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-4 font-semibold text-gray-200">Model</th>
                  <th className="p-4 font-semibold text-gray-200">Company Type</th>
                  <th className="p-4 font-semibold text-gray-200">Sector</th>
                  <th className="p-4 font-semibold text-gray-200">Equity Basis</th>
                  <th className="p-4 font-semibold text-center text-gray-200">Safe Zone Threshold</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4 font-bold text-brand-secondary">Z-Score</td>
                  <td className="p-4">Public</td>
                  <td className="p-4">Manufacturing</td>
                  <td className="p-4">Market Value</td>
                  <td className="p-4 text-center font-mono text-safe font-bold">> 2.99</td>
                </tr>
                <tr className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors bg-gray-800/30">
                  <td className="p-4 font-bold text-brand-secondary">Z'-Score</td>
                  <td className="p-4">Private</td>
                  <td className="p-4">Manufacturing</td>
                  <td className="p-4">Book Value</td>
                  <td className="p-4 text-center font-mono text-safe font-bold">> 2.90</td>
                </tr>
                <tr className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                  <td className="p-4 font-bold text-brand-secondary">Z''-Score</td>
                  <td className="p-4">Public or Private</td>
                  <td className="p-4">Non-Manufacturing</td>
                  <td className="p-4">Book Value</td>
                  <td className="p-4 text-center font-mono text-safe font-bold">> 2.60</td>
                </tr>
              </tbody>
            </table>
          </div>
           <p className="text-xs text-gray-500 mt-2 text-center">Sources: Investopedia, CreditGuru, StableBread</p>
        </section>
        
        {/* Foundational Resources Section */}
        <section className="pb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Foundational Resources from Dr Teng</h2>
          <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg border border-gray-700 text-gray-300 shadow-xl">
            <ul className="space-y-6">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-brand-secondary mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-lg">Numerous books on corporate turnaround and transformation</span>
              </li>
              <li>
                <div className="flex items-start mb-3">
                     <svg className="h-6 w-6 text-brand-secondary mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-lg font-semibold text-white">Eight Centres of Excellence</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-8">
                    {['Turnaround Centre', 'Transformation Centre', 'Business Model Centre', 'Mergers & Acquisitions Centre', 'Corporate Culture Centre', 'Change Management Centre', 'Accounting & Financial Centre', 'Digital AI Centre'].map((centre, idx) => (
                        <div key={idx} className="bg-gray-700/50 p-3 rounded border border-gray-600 text-sm hover:bg-gray-700 transition-colors">
                            {centre}
                        </div>
                    ))}
                </div>
              </li>
            </ul>
          </div>
        </section>

      </main>
      <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-800 bg-gray-900">
        <p>&copy;2025 Corporate Turnaround Centre. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;