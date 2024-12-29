import React from 'react';

export type ObstacleType = 'red' | 'blue';

interface ObstacleProps {
  type: ObstacleType;
  position: { x: number; y: number };
  gridSize: number;
}

export const Obstacle = ({ type, position, gridSize }: ObstacleProps) => {
  const size = 800 / gridSize;

  const getObstacleColor = () => {
    switch (type) {
      case 'red': return 'bg-red-500/50';
      case 'blue': return 'bg-blue-500/50';
      default: return 'bg-gray-500/50';
    }
  };

  return (
    <div 
      className={`absolute ${getObstacleColor()} rounded-md border-2 border-white/20`}
      style={{
        left: `${position.x * size}px`,
        top: `${position.y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};