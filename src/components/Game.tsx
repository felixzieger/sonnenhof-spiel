import React, { useState, useEffect, useCallback } from 'react';
import { Player } from './Player';
import { Animal } from './Animal';
import { Obstacle } from './Obstacle';
import { ScoreBoard } from './ScoreBoard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { GRID_SIZE, INITIAL_ANIMALS, INITIAL_OBSTACLES } from '../config/gameConfig';
import { updateAnimalPositions, positionQueue, getValidMove } from '../utils/gameLogic';

export type Position = {
  x: number;
  y: number;
};

export type AnimalType = {
  id: number;
  type: 'cat' | 'chicken' | 'pig' | 'horse';
  position: Position;
  caught: boolean;
  lastMoveDirection?: 'towards' | 'away';
  moveDelay: number; // Neue Property für individuelle Verzögerung
};

export const Game = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: GRID_SIZE / 2, y: GRID_SIZE / 2 });
  const [animals, setAnimals] = useState<AnimalType[]>(
    INITIAL_ANIMALS.map(animal => ({
      ...animal,
      moveDelay: Math.floor(Math.random() * 750) // Zufällige Verzögerung zwischen 0-750ms
    }))
  );
  const [obstacles] = useState(INITIAL_OBSTACLES);
  const { toast } = useToast();

  const resetGame = () => {
    setPlayerPosition({ x: GRID_SIZE / 2, y: GRID_SIZE / 2 });
    setAnimals(INITIAL_ANIMALS.map(animal => ({
      ...animal,
      moveDelay: Math.floor(Math.random() * 750) // Zufällige Verzögerung zwischen 0-750ms
    })));
    positionQueue.clear();
    toast({
      title: "Spiel neu gestartet",
      description: "Fang alle Tiere wieder ein!",
    });
  };

  const checkCollisions = useCallback((playerPos: Position) => {
    console.log('Checking collisions with player at:', playerPos);
    setAnimals(prevAnimals => 
      prevAnimals.map(animal => {
        if (!animal.caught && 
            Math.abs(animal.position.x - playerPos.x) < 1 && 
            Math.abs(animal.position.y - playerPos.y) < 1) {
          console.log(`Collision detected with ${animal.type} at position:`, animal.position);
          toast({
            title: "Tier gefangen!",
            description: `Du hast ein${animal.type === 'cat' ? 'e' : ''} ${getAnimalName(animal.type)} gefangen!`,
          });
          return { ...animal, caught: true };
        }
        return animal;
      })
    );
  }, [toast]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setAnimals(prevAnimals => updateAnimalPositions(prevAnimals, obstacles));
    }, 750);

    return () => clearInterval(moveInterval);
  }, [obstacles]);

  const handleKeyPress = (e: KeyboardEvent) => {
    const newPosition = { ...playerPosition };

    switch (e.key) {
      case 'ArrowUp':
        newPosition.y = Math.max(0, playerPosition.y - 1);
        break;
      case 'ArrowDown':
        newPosition.y = Math.min(GRID_SIZE - 1, playerPosition.y + 1);
        break;
      case 'ArrowLeft':
        newPosition.x = Math.max(0, playerPosition.x - 1);
        break;
      case 'ArrowRight':
        newPosition.x = Math.min(GRID_SIZE - 1, playerPosition.x + 1);
        break;
      default:
        return;
    }

    const validPosition = getValidMove(playerPosition, newPosition, obstacles);
    setPlayerPosition(validPosition);
    positionQueue.add(validPosition);
    checkCollisions(validPosition);
  };

  const getAnimalName = (type: AnimalType['type']) => {
    switch (type) {
      case 'cat': return 'Katze';
      case 'chicken': return 'Huhn';
      case 'pig': return 'Schwein';
      case 'horse': return 'Pferd';
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition]);

  const getCellBackground = (x: number, y: number) => {
    const middleStart = Math.floor(GRID_SIZE / 2) - 2;
    if (x >= middleStart && x < middleStart + 4) {
      return 'bg-[#8B4513]/20';
    }
    return (x + y) % 2 === 0 ? 'bg-[#90B167]/10' : 'bg-[#90B167]/20';
  };

  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    return (
      <div
        key={`cell-${x}-${y}`}
        className={`absolute ${getCellBackground(x, y)}`}
        style={{
          left: `${(x * 800) / GRID_SIZE}px`,
          top: `${(y * 800) / GRID_SIZE}px`,
          width: `${800 / GRID_SIZE}px`,
          height: `${800 / GRID_SIZE}px`,
        }}
      />
    );
  });

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex items-center gap-4">
        <ScoreBoard animals={animals} />
        <Button 
          onClick={resetGame}
          variant="outline"
          className="bg-white hover:bg-gray-100"
        >
          🔄 Neu starten
        </Button>
      </div>
      <div 
        className="relative w-[800px] h-[800px] bg-grass rounded-lg border-4 border-fence overflow-hidden"
      >
        {gridCells}
        {obstacles.map(obstacle => (
          <Obstacle 
            key={obstacle.id}
            type={obstacle.type}
            position={obstacle.position}
            gridSize={GRID_SIZE}
          />
        ))}
        <Player position={playerPosition} gridSize={GRID_SIZE} />
        {animals.map(animal => (
          !animal.caught && (
            <Animal 
              key={animal.id}
              type={animal.type}
              position={animal.position}
              gridSize={GRID_SIZE}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Game;
