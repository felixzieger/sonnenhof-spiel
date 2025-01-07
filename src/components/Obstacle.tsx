import React from 'react';

interface ObstacleProps {
  position: { x: number; y: number };
  gridSize: number;
}

export const Obstacle = ({ position, gridSize }: ObstacleProps) => {
  // Calculate the available space for the game board (accounting for padding)
  const getSize = () => {
    const paddingSize = window.innerWidth >= 640 ? 64 : 16; // sm:p-8 (64px) or p-2 (16px)
    const availableWidth = Math.min(800, window.innerWidth - (paddingSize * 2));
    return `calc(${availableWidth}px / ${gridSize})`;
  };

  return (
    <div 
      className="absolute bg-gray-500/50 rounded-md border-2 border-white/20"
      style={{
        left: `calc(${getSize()} * ${position.x})`,
        top: `calc(${getSize()} * ${position.y})`,
        width: getSize(),
        height: getSize(),
      }}
    />
  );
};