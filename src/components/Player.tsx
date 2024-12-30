import React from 'react';
import { Position } from './Game';

interface PlayerProps {
  position: Position;
  gridSize: number;
}

export const Player = ({ position, gridSize }: PlayerProps) => {
  const size = 800 / gridSize;
  const scaleFactor = 0.7; // Reduce size by 30%

  return (
    <div 
      className="absolute transition-all duration-200 animate-bounce-small"
      style={{
        left: `${position.x * size}px`,
        top: `${position.y * size}px`,
        width: `${size * scaleFactor}px`,
        height: `${size * scaleFactor}px`,
        transform: `translate(${(size - size * scaleFactor) / 2}px, ${(size - size * scaleFactor) / 2}px)`,
      }}
    >
      <div className="w-full h-full bg-blue-600 rounded-full border-2 border-white shadow-lg" />
    </div>
  );
};