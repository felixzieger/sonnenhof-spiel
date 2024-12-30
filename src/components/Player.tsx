import React from 'react';
import { Position } from './Game';
import { Viewport, adjustPositionForViewport } from '../utils/viewport';

interface PlayerProps {
  position: Position;
  gridSize: number;
  viewport: Viewport;
}

export const Player = ({ position, gridSize, viewport }: PlayerProps) => {
  const size = 800 / viewport.visibleSize;
  const adjustedPosition = adjustPositionForViewport(position, viewport);

  return (
    <div 
      className="absolute transition-all duration-200 animate-bounce-small"
      style={{
        left: `${adjustedPosition.x * size}px`,
        top: `${adjustedPosition.y * size}px`,
        width: `${size * 0.6}px`,
        height: `${size * 0.6}px`,
        transform: 'translate(20%, 20%)',
      }}
    >
      <div className="w-full h-full bg-blue-600 rounded-full border-2 border-white shadow-lg" />
    </div>
  );
};