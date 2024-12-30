import React from 'react';

interface ObstacleProps {
  position: { x: number; y: number };
  gridSize: number;
}

export const Obstacle = ({ position, gridSize }: ObstacleProps) => {
  const size = 800 / gridSize;
  const scaleFactor = 0.8; // Reduce size by 20%

  return (
    <div 
      className="absolute bg-gray-500/50 rounded-md border-2 border-white/20"
      style={{
        left: `${position.x * size + (size - size * scaleFactor) / 2}px`,
        top: `${position.y * size + (size - size * scaleFactor) / 2}px`,
        width: `${size * scaleFactor}px`,
        height: `${size * scaleFactor}px`,
      }}
    />
  );
};