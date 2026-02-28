
import React from 'react';
import type { Recommendation } from '../types';

interface ActionCardProps {
  recommendation: Recommendation;
}

const ActionCard: React.FC<ActionCardProps> = ({ recommendation }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-brand-secondary transition-colors duration-300 shadow-lg flex flex-col h-full">
      <div className="flex-grow">
        <h4 className="text-lg font-bold text-white mb-2">{recommendation.title}</h4>
        <p className="text-gray-400 text-sm">{recommendation.description}</p>
      </div>
    </div>
  );
};

export default ActionCard;