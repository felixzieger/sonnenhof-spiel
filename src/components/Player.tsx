import React from 'react';
import { Position } from './Game';

interface PlayerProps {
  position: Position;
  gridSize: number;
}

export const Player = ({ position, gridSize }: PlayerProps) => {
  // Calculate the available space for the game board (accounting for padding)
  const getSize = () => {
    const paddingSize = window.innerWidth >= 640 ? 64 : 16; // sm:p-8 (64px) or p-2 (16px)
    const availableWidth = Math.min(800, window.innerWidth - (paddingSize * 2));
    return `calc(${availableWidth}px / ${gridSize})`;
  };

  return (
    <div 
      className="absolute transition-all duration-200 animate-bounce-small"
      style={{
        left: `calc(${getSize()} * ${position.x})`,
        top: `calc(${getSize()} * ${position.y})`,
        width: getSize(),
        height: getSize(),
      }}
    >
      <div className="w-full h-full bg-blue-600 rounded-full border-2 border-white shadow-lg" />
    </div>
  );
};