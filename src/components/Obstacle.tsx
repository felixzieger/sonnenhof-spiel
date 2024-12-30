import React from 'react';

interface ObstacleProps {
  position: { x: number; y: number };
  gridSize: number;
}

export const Obstacle = ({ position, gridSize }: ObstacleProps) => {
  const size = 800 / gridSize;

  return (
    <div 
      className="absolute bg-gray-500/50 rounded-md border-2 border-white/20"
      style={{
        left: `${position.x * size}px`,
        top: `${position.y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};