import React from 'react';

interface ObstacleProps {
  position: { x: number; y: number };
  gridSize: number;
}

export const Obstacle = ({ position, gridSize }: ObstacleProps) => {
  const size = `calc(min(800px, 100vw) / ${gridSize})`;

  return (
    <div 
      className="absolute bg-gray-500/50 rounded-md border-2 border-white/20"
      style={{
        left: `calc((min(800px, 100vw) / ${gridSize}) * ${position.x})`,
        top: `calc((min(800px, 100vw) / ${gridSize}) * ${position.y})`,
        width: size,
        height: size,
      }}
    />
  );
};