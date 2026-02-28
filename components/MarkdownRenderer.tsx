import React from 'react';

// Simple Markdown to HTML renderer
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
        .replace(/### (.*)/g, '<h3 class="text-2xl font-bold mt-6 mb-3 text-white">$1</h3>')
        .replace(/#### (.*)/g, '<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-300 italic">$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\* (.*)/gm, '<li class="ml-5 list-disc">$1</li>')
        .replace(/\n/g, '<br />');

    // This is a simple approach. A more robust solution might handle lists better by wrapping them in <ul> tags.
    return <div className="text-gray-300 leading-relaxed prose prose-invert" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default MarkdownRenderer;
