import React from 'react';
import { Position, AnimalType } from './Game';

interface AnimalProps {
  type: AnimalType['type'];
  position: Position;
  gridSize: number;
}

export const Animal = ({ type, position, gridSize }: AnimalProps) => {
  const size = `calc(min(800px, 100vw) / ${gridSize})`;

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
        left: `calc((min(800px, 100vw) / ${gridSize}) * ${position.x})`,
        top: `calc((min(800px, 100vw) / ${gridSize}) * ${position.y})`,
        width: size,
        height: size,
        fontSize: `calc((min(800px, 100vw) / ${gridSize}) * 0.6)`,
      }}
    >
      {getAnimalEmoji()}
    </div>
  );
};