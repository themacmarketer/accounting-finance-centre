import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface ScoreGaugeProps {
  score: number;
  zone: 'safe' | 'caution' | 'distress';
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, zone }) => {
  // Normalize score for a 0-5 scale for better visualization
  const maxScore = 5;
  const displayScore = Math.min(Math.max(score, 0), maxScore);
  const percentage = (displayScore / maxScore) * 100;

  let color = '#f59e0b'; // Default to Caution
  let statusText = 'Caution Zone';

  if (zone === 'safe') {
    color = '#22c55e'; // Safe - green
    statusText = 'Safe Zone';
  } else if (zone === 'distress') {
    color = '#ef4444'; // Distress - red
    statusText = 'Distress Zone';
  }
  
  const data = [{ name: 'Z-Score', value: percentage, fill: color }];

  return (
    <div className="w-48 h-48 relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={-180}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          {/* FIX: Removed duplicate `background` prop. The object prop is sufficient to enable and style the background. */}
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            // The type for background in Recharts is incorrect, so we cast to any.
            background={{ fill: '#374151' } as any} 
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold" style={{ color }}>
          {score.toFixed(2)}
        </span>
        <span className="text-sm font-semibold text-gray-300 mt-1">{statusText}</span>
      </div>
    </div>
  );
};

export default ScoreGauge;