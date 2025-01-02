import { useState, useEffect } from 'react';
import { Player } from '../Player';
import { Animal } from '../Animal';
import { Obstacle } from '../Obstacle';
import { GameMenu } from '../GameMenu';
import { LevelMessage } from '../LevelMessage';
import { Position, AnimalType } from '../Game';
import { LEVEL_CONFIGS } from '../../config/gameConfig';
import { SeasonToggle } from './SeasonToggle';

interface GameBoardProps {
  playerPosition: Position;
  animals: AnimalType[];
  obstacles: Position[];
  gridSize: number;
  currentLevel: number;
  showLevelMessage: boolean;
  onRestart: () => void;
  onStart: () => void;
}

export const GameBoard = ({ 
  playerPosition, 
  animals, 
  obstacles, 
  gridSize, 
  currentLevel, 
  showLevelMessage, 
  onRestart,
  onStart
}: GameBoardProps) => {
  const [isWinter, setIsWinter] = useState(false);

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setIsWinter(currentMonth >= 9 || currentMonth <= 2); // October (9) to March (2)
  }, []);

  const toggleSeason = () => {
    setIsWinter(prev => !prev);
  };

  return (
    <div className="relative">
      <div 
        className={`relative w-full aspect-square rounded-lg border-2 border-fence overflow-hidden bg-cover bg-center ${
          isWinter ? 'bg-farm-winter' : 'bg-farm-summer'
        }`}
        style={{ maxWidth: '100vw', maxHeight: '60vh' }}
      >
        <div className="absolute top-4 left-4 z-50">
          <SeasonToggle isWinter={isWinter} onToggle={toggleSeason} />
        </div>
        <GameMenu onRestart={onRestart} />
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
                onStart={onStart}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};