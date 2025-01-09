import { useState, useEffect } from 'react';
import { Player } from '../Player';
import { Animal } from '../Animal';
import { Obstacle } from '../Obstacle';
import { LevelMessage } from '../LevelMessage';
import { Position, AnimalType } from '../Game';
import { LEVEL_CONFIGS } from '../../config/gameConfig';

interface GameBoardProps {
  playerPosition: Position;
  animals: AnimalType[];
  obstacles: Position[];
  gridSize: number;
  currentLevel: number;
  showLevelMessage: boolean;
  onRestart: () => void;
  onStart: () => void;
  isWinter: boolean;
}

export const GameBoard = ({ 
  playerPosition, 
  animals, 
  obstacles, 
  gridSize, 
  currentLevel, 
  showLevelMessage, 
  onStart,
  isWinter
}: GameBoardProps) => {
  const handleStart = () => {
    console.log('handleStart called in GameBoard');
    console.log('showLevelMessage:', showLevelMessage);
    console.log('onStart function:', onStart);
    onStart();
  };

  return (
    <div className="relative w-full mx-auto">
      <div 
        className={`relative w-full aspect-square rounded-lg border-2 border-fence overflow-hidden bg-cover bg-center ${
          isWinter ? 'bg-farm-winter' : 'bg-farm-summer'
        }`}
      >
        {obstacles.map((obstacle, index) => (
          <Obstacle 
            key={index}
            position={obstacle}
            gridSize={gridSize}
          />
        ))}
        <Player position={playerPosition} gridSize={gridSize} />
        {animals.map(animal => (
          !animal.caught && (
            <Animal 
              key={animal.id}
              type={animal.type}
              position={animal.position}
              gridSize={gridSize}
            />
          )
        ))}
        {showLevelMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-[90%] text-center mx-2">
              <LevelMessage 
                level={currentLevel} 
                showControls={LEVEL_CONFIGS[currentLevel].showControls}
                onStart={handleStart}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};