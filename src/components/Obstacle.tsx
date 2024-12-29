import React from 'react';

export type ObstacleType = 'house' | 'tree';

interface ObstacleProps {
  type: ObstacleType;
  position: { x: number; y: number };
  gridSize: number;
}

export const Obstacle = ({ type, position, gridSize }: ObstacleProps) => {
  const size = 800 / gridSize;

  const getObstacleEmoji = () => {
    switch (type) {
      case 'house': return '🏠';
      case 'tree': return '🌳';
      default: return '❓';
    }
  };

  return (
    <div 
      className="absolute flex items-center justify-center"
      style={{
        left: `${position.x * size}px`,
        top: `${position.y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.7}px`,
        transform: 'rotateX(-45deg) rotateZ(45deg)',
        transformStyle: 'preserve-3d'
      }}
    >
      {getObstacleEmoji()}
    </div>
  );
};