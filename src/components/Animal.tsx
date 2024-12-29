import React from 'react';
import { Position, AnimalType } from './Game';

interface AnimalProps {
  type: AnimalType['type'];
  position: Position;
  gridSize: number;
}

export const Animal = ({ type, position, gridSize }: AnimalProps) => {
  const size = 800 / gridSize;

  const getAnimalEmoji = () => {
    switch (type) {
      case 'cat': return '🐱';
      case 'chicken': return '🐔';
      case 'pig': return '🐷';
      case 'horse': return '🐎';
      default: return '❓';
    }
  };

  return (
    <div 
      className="absolute transition-all duration-300 animate-bounce-small flex items-center justify-center"
      style={{
        left: `${position.x * size}px`,
        top: `${position.y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.6}px`,
        transform: 'rotateX(-45deg) rotateZ(45deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {getAnimalEmoji()}
    </div>
  );
};