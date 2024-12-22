import React from 'react';
import { Position, AnimalType } from './Game';

interface AnimalProps {
  type: AnimalType['type'];
  position: Position;
  gridSize: number;
}

export const Animal = ({ type, position, gridSize }: AnimalProps) => {
  const size = 800 / gridSize;

  const getAnimalColor = () => {
    switch (type) {
      case 'cat': return 'bg-gray-500';
      case 'chicken': return 'bg-yellow-200';
      case 'pig': return 'bg-pink-300';
      case 'horse': return 'bg-brown-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div 
      className="absolute transition-all duration-300 animate-bounce-small"
      style={{
        left: `${position.x * size}px`,
        top: `${position.y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div className={`w-full h-full ${getAnimalColor()} rounded-full border-2 border-white shadow-md`} />
    </div>
  );
};