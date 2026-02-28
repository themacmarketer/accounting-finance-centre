import React, { useState, useEffect, useRef } from 'react';
import { getSpeech } from '../services/geminiService';
import { createWavBlob } from '../utils/audio';
import { cacheAudio, getCachedAudio } from '../services/audioCache';
import MarkdownRenderer from './MarkdownRenderer';

interface PrayerAudioPlayerProps {
    text: string;
    isDemo?: boolean;
}

const PrayerAudioPlayer: React.FC<PrayerAudioPlayerProps> = ({ text, isDemo }) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    
    const isMountedRef = useRef(true);
    const DEMO_AUDIO_KEY = 'demo_faith_audio_v1';

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        // Check cache first immediately
        if (isDemo) {
            const cached = getCachedAudio(DEMO_AUDIO_KEY);
            if (cached) {
                setAudioUrl(cached);
                return;
            }
        }
    }, [isDemo]);

    const generateAudio = async () => {
        if (audioUrl || isLoading) return;

        setIsLoading(true);
        setError(null);
        setProgress(5);

        try {
            // 1. Text Cleaning
            const cleanText = text.replace(/#{1,6}\s/g, '').replace(/\*\*/g, '').replace(/\*/g, '').replace(/\n/g, '. ');
            
            // 2. Intelligent Chunking (smaller chunks for better API reliability)
            // Split by sentence terminators to avoid cutting words, then group into max 200 chars
            const rawSentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
            const chunks: string[] = [];
            let currentChunk = '';
            
            for (const s of rawSentences) {
                 if ((currentChunk + s).length < 200) { // Reduced chunk size for safety
                     currentChunk += s + ' ';
                 } else {
                     chunks.push(currentChunk.trim());
                     currentChunk = s + ' ';
                 }
            }
            if (currentChunk.trim()) chunks.push(currentChunk.trim());

            // 3. Parallel Fetching with Concurrency Control
            // We fetch all audio parts in parallel batches to speed up "download" significantly
            const audioParts: (Uint8Array | null)[] = new Array(chunks.length).fill(null);
            const BATCH_SIZE = 3; 
            
            for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
                if (!isMountedRef.current) return;
                
                const batchPromises = chunks.slice(i, i + BATCH_SIZE).map((chunk, idx) => 
                    getSpeech(chunk).then(data => ({ index: i + idx, data }))
                );
                
                const results = await Promise.all(batchPromises);
                
                results.forEach(res => {
                    if (res.data) {
                        audioParts[res.index] = res.data;
                    }
                });

                const currentProgress = Math.min(95, Math.round(((i + BATCH_SIZE) / chunks.length) * 100));
                if (isMountedRef.current) setProgress(currentProgress);
            }

            // 4. Assembly
            const validParts = audioParts.filter((p): p is Uint8Array => p !== null);

            if (validParts.length === 0) throw new Error("No audio could be generated. Please try again.");

            let totalLength = 0;
            validParts.forEach(part => totalLength += part.length);
            const merged = new Uint8Array(totalLength);
            let offset = 0;
            validParts.forEach(part => {
                merged.set(part, offset);
                offset += part.length;
            });

            // 5. WAV Creation
            const blob = createWavBlob(merged, 24000);
            const url = URL.createObjectURL(blob);
            
            if (isMountedRef.current) {
                setAudioUrl(url);
                setProgress(100);
                if (isDemo) {
                    cacheAudio(DEMO_AUDIO_KEY, url);
                }
            }

        } catch (e) {
            console.error("Audio generation failed:", e);
            if (isMountedRef.current) {
                setError("Unable to generate audio at this time. Please try again later.");
            }
        } finally {
            if (isMountedRef.current) {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-6">
             <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        Audio Prayer Guide
                    </h4>
                    {isDemo && audioUrl && (
                         <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded border border-green-600">
                            Ready to Play
                        </span>
                    )}
                </div>

                {!audioUrl && !isLoading && !error && (
                    <div className="text-center py-4 bg-gray-700/30 rounded-lg">
                        <button 
                            onClick={generateAudio}
                            className="bg-brand-secondary hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition duration-300 flex items-center mx-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Generate & Play Audio
                        </button>
                        <p className="text-xs text-gray-400 mt-2">Downloads the full prayer audio for smooth playback.</p>
                    </div>
                )}

                {isLoading && (
                    <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Downloading audio segments...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className="h-2 bg-brand-secondary animate-pulse rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-800 flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={generateAudio} className="text-xs underline hover:text-white">Retry</button>
                    </div>
                )}

                {audioUrl && (
                    <div className="flex flex-col gap-3 animate-fade-in">
                        <audio controls className="w-full h-10 rounded focus:outline-none focus:ring-2 focus:ring-brand-secondary" src={audioUrl}>
                            Your browser does not support the audio element.
                        </audio>
                        <div className="flex justify-between items-center text-xs text-gray-400 px-1">
                             <span>Use controls to Pause/Resume</span>
                             <a 
                                href={audioUrl} 
                                download="Prayer_Guidance.wav" 
                                className="text-brand-secondary hover:text-white transition-colors flex items-center"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Save Audio
                             </a>
                        </div>
                    </div>
                )}
            </div>

            <MarkdownRenderer content={text} />
        </div>
    );
};

export default PrayerAudioPlayer;