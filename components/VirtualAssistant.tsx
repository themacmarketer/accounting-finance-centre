import React, { useState, useRef, useEffect } from 'react';
import { getVAAntswer } from '../services/geminiService';
import type { ChatEntry } from '../types';
import { Content } from '@google/genai';

const VirtualAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newHistory: ChatEntry[] = [...chatHistory, { role: 'user', text: userInput }];
        setChatHistory(newHistory);
        setUserInput('');
        setIsLoading(true);

        // Convert ChatEntry[] to Content[] for the API
        const apiHistory: Content[] = newHistory.map(entry => ({
            role: entry.role,
            parts: [{ text: entry.text }]
        }));

        try {
            const response = await getVAAntswer(userInput, apiHistory.slice(0, -1)); // Send history without the last user message
            setChatHistory(prev => [...prev, { role: 'model', text: response }]);
        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if(!isOpen && chatHistory.length === 0){
             setChatHistory([{role: 'model', text: "Hello! How can I help you understand Dr. Teng's turnaround methodologies or the 8 Centres of Excellence?"}])
        }
    };

    return (
        <>
            <button
                onClick={toggleOpen}
                className="fixed bottom-4 right-4 z-40 bg-brand-primary text-white p-3 rounded-full shadow-lg hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-transform transform hover:scale-110"
                aria-label="Open Virtual Assistant"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-4 w-full max-w-sm h-[60vh] max-h-[500px] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
                    <header className="p-4 bg-gray-900 rounded-t-lg flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Virtual Assistant</h3>
                        <button onClick={toggleOpen} className="text-gray-400 hover:text-white">&times;</button>
                    </header>
                    <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                        {chatHistory.map((entry, index) => (
                            <div key={index} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${entry.role === 'user' ? 'bg-brand-secondary text-white' : 'bg-gray-700 text-gray-200'}`}>
                                    <p className="text-sm">{entry.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex justify-start">
                               <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-gray-200 flex items-center">
                                 <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                 <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></div>
                                 <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce"></div>
                               </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                maxLength={200}
                                placeholder="Ask about the Centre..."
                                className="flex-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary disabled:opacity-50"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !userInput.trim()}
                                className="p-2 bg-brand-secondary text-white rounded-md hover:bg-blue-500 disabled:bg-gray-600"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default VirtualAssistant;