import { Player } from '../Player';
import { Animal } from '../Animal';
import { Obstacle } from '../Obstacle';
import { GameMenu } from '../GameMenu';
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
}

export const GameBoard = ({ 
  playerPosition, 
  animals, 
  obstacles, 
  gridSize, 
  currentLevel, 
  showLevelMessage, 
  onRestart 
}: GameBoardProps) => {
  return (
    <div 
      className="relative w-full aspect-square rounded-lg border-2 border-fence overflow-hidden bg-farm-aerial bg-cover bg-center"
      style={{ maxWidth: '100vw', maxHeight: '60vh' }}
    >
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
            />
          </div>
        </div>
      )}
    </div>
  );
};