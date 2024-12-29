import React from 'react';
import { Position } from './Game';

interface PlayerProps {
  position: Position;
  gridSize: number;
}

export const Player = ({ position, gridSize }: PlayerProps) => {
  const size = 800 / gridSize;

  return (
    <div 
      className="absolute transition-all duration-200 animate-bounce-small"
      style={{
        left: `${position.x * size}px`,
        top: `${position.y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'rotateX(-45deg) rotateZ(45deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="w-full h-full bg-blue-600 rounded-full border-2 border-white shadow-lg" />
    </div>
  );
};