import React, { useState } from 'react';

const Feedback: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send the feedback to a server.
        console.log('Feedback submitted:', feedback);
        setSubmitted(true);
        setFeedback('');
        setTimeout(() => {
            setIsOpen(false);
            setSubmitted(false);
        }, 2000); // Close modal after 2 seconds
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-40 bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-transform transform hover:scale-110"
                aria-label="Give Feedback"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
                        {!submitted ? (
                            <form onSubmit={handleSubmit}>
                                <h2 className="text-xl font-bold text-white mb-4">Provide Feedback</h2>
                                <p className="text-gray-400 text-sm mb-4">We'd love to hear your thoughts on how we can improve this tool.</p>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="w-full h-32 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                                    placeholder="Your feedback..."
                                    required
                                />
                                <div className="mt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-brand-secondary text-white rounded-md hover:bg-blue-500"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h2 className="text-xl font-bold text-white">Thank You!</h2>
                                <p className="text-gray-300 mt-2">Your feedback has been received.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Feedback;