import React from 'react';
import { Position, AnimalType } from './Game';
import { Viewport, adjustPositionForViewport, isPositionVisible } from '../utils/viewport';

interface AnimalProps {
  type: AnimalType['type'];
  position: Position;
  gridSize: number;
  viewport: Viewport;
}

export const Animal = ({ type, position, gridSize, viewport }: AnimalProps) => {
  if (!isPositionVisible(position, viewport)) {
    return null;
  }

  const size = 800 / viewport.visibleSize;
  const adjustedPosition = adjustPositionForViewport(position, viewport);

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
        left: `${adjustedPosition.x * size}px`,
        top: `${adjustedPosition.y * size}px`,
        width: `${size * 0.8}px`,
        height: `${size * 0.8}px`,
        transform: 'translate(10%, 10%)',
        fontSize: `${size * 0.5}px`,
      }}
    >
      {getAnimalEmoji()}
    </div>
  );
};