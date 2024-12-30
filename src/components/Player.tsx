import React from 'react';
import { Position } from './Game';

interface PlayerProps {
  position: Position;
  gridSize: number;
}

export const Player = ({ position, gridSize }: PlayerProps) => {
  const size = `calc(min(800px, 100vw) / (${gridSize} + 1))`;

  return (
    <div 
      className="absolute transition-all duration-200 animate-bounce-small"
      style={{
        left: `calc((min(800px, 100vw) / (${gridSize} + 1)) * ${position.x})`,
        top: `calc((min(800px, 100vw) / (${gridSize} + 1)) * ${position.y})`,
        width: size,
        height: size,
      }}
    >
      <div className="w-full h-full bg-blue-600 rounded-full border-2 border-white shadow-lg" />
    </div>
  );
};