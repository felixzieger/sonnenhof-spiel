import React from 'react';
import { Position, AnimalType } from './Game';

interface AnimalProps {
  type: AnimalType['type'];
  position: Position;
  gridSize: number;
}

export const Animal = ({ type, position, gridSize }: AnimalProps) => {
  // Calculate the available space for the game board (accounting for padding)
  const getSize = () => {
    const paddingSize = window.innerWidth >= 640 ? 64 : 16; // sm:p-8 (64px) or p-2 (16px)
    const availableWidth = Math.min(800, window.innerWidth - (paddingSize * 2));
    return `calc(${availableWidth}px / ${gridSize})`;
  };

  const getAnimalEmoji = () => {
    switch (type) {
      case 'cat': return '🐱';
      case 'chicken': return '🐔';
      case 'pig': return '🐷';
      case 'horse': return '🐴';
      default: return '❓';
    }
  };

  return (
    <div 
      className="absolute transition-all duration-300 animate-bounce-small flex items-center justify-center"
      style={{
        left: `calc(${getSize()} * ${position.x})`,
        top: `calc(${getSize()} * ${position.y})`,
        width: getSize(),
        height: getSize(),
        fontSize: `calc(${getSize()} * 0.6)`,
      }}
    >
      {getAnimalEmoji()}
    </div>
  );
};