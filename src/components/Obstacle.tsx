import React from 'react';
import { Position } from './Game';
import { Viewport, adjustPositionForViewport, isPositionVisible } from '../utils/viewport';

interface ObstacleProps {
  position: Position;
  gridSize: number;
  viewport: Viewport;
}

export const Obstacle = ({ position, gridSize, viewport }: ObstacleProps) => {
  if (!isPositionVisible(position, viewport)) {
    return null;
  }

  const size = 800 / viewport.visibleSize;
  const adjustedPosition = adjustPositionForViewport(position, viewport);

  return (
    <div 
      className="absolute bg-gray-500/50 rounded-md border-2 border-white/20"
      style={{
        left: `${adjustedPosition.x * size}px`,
        top: `${adjustedPosition.y * size}px`,
        width: `${size * 0.9}px`,
        height: `${size * 0.9}px`,
        transform: 'translate(5%, 5%)',
      }}
    />
  );
};