import React, { useState, useEffect, useCallback } from 'react';
import { Player } from './Player';
import { Animal } from './Animal';
import { Obstacle } from './Obstacle';
import { ScoreBoard } from './ScoreBoard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { getDistance, moveTowardsPlayer, moveAwayFromPlayer, getRandomMove } from '../utils/animalMovement';
import { GRID_SIZE, INITIAL_ANIMALS, INITIAL_OBSTACLES } from '../config/gameConfig';

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
};

const isPositionBlocked = (position: Position, obstacles: typeof INITIAL_OBSTACLES) => {
  return obstacles.some(obstacle => 
    obstacle.position.x === position.x && 
    obstacle.position.y === position.y
  );
};

const getValidMove = (
  currentPos: Position, 
  newPos: Position, 
  obstacles: typeof INITIAL_OBSTACLES
): Position => {
  if (
    newPos.x < 0 || 
    newPos.x >= GRID_SIZE || 
    newPos.y < 0 || 
    newPos.y >= GRID_SIZE ||
    isPositionBlocked(newPos, obstacles)
  ) {
    return currentPos;
  }
  return newPos;
};

export const Game = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: GRID_SIZE / 2, y: GRID_SIZE / 2 });
  const [animals, setAnimals] = useState<AnimalType[]>(INITIAL_ANIMALS);
  const [obstacles] = useState(INITIAL_OBSTACLES);
  const { toast } = useToast();

  const resetGame = () => {
    setPlayerPosition({ x: GRID_SIZE / 2, y: GRID_SIZE / 2 });
    setAnimals(INITIAL_ANIMALS);
    toast({
      title: "Spiel neu gestartet",
      description: "Fang alle Tiere wieder ein!",
    });
  };

  const checkCollisions = useCallback((position: Position) => {
    setAnimals(prevAnimals => 
      prevAnimals.map(animal => {
        if (!animal.caught && 
            Math.abs(animal.position.x - position.x) < 1 && 
            Math.abs(animal.position.y - position.y) < 1) {
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

  const updateAnimalPositions = useCallback((currentAnimals: AnimalType[], currentPlayerPos: Position) => {
    console.log('Updating animal positions. Player at:', currentPlayerPos);
    const updatedAnimals = currentAnimals.map(animal => {
      if (animal.caught) return animal;

      let newPosition: Position;

      switch (animal.type) {
        case 'pig':
          newPosition = getRandomMove(animal.position, GRID_SIZE);
          console.log('Pig moving randomly to:', newPosition);
          break;
        case 'cat':
          const newDirection = animal.lastMoveDirection === 'towards' ? 'away' : 'towards';
          newPosition = newDirection === 'towards'
            ? moveTowardsPlayer(animal.position, currentPlayerPos)
            : moveAwayFromPlayer(animal.position, currentPlayerPos, GRID_SIZE);
          console.log('Cat moving', newDirection, 'player to:', newPosition);
          break;
        case 'chicken':
          const distanceToPlayer = getDistance(animal.position, currentPlayerPos);
          console.log('Chicken distance to player:', distanceToPlayer);
          if (distanceToPlayer <= 3) {
            newPosition = moveAwayFromPlayer(animal.position, currentPlayerPos, GRID_SIZE);
            console.log('Chicken running away to:', newPosition);
          } else {
            newPosition = getRandomMove(animal.position, GRID_SIZE);
            console.log('Chicken moving randomly to:', newPosition);
          }
          break;
        default:
          return animal;
      }

      const validPosition = getValidMove(animal.position, newPosition, obstacles);
      console.log(`${animal.type} final position after obstacle check:`, validPosition);

      return {
        ...animal,
        position: validPosition,
        lastMoveDirection: animal.type === 'cat' 
          ? (animal.lastMoveDirection === 'towards' ? 'away' : 'towards') 
          : animal.lastMoveDirection
      };
    });

    // Überprüfe Kollisionen nach der Bewegung der Tiere
    updatedAnimals.forEach(animal => {
      if (!animal.caught) {
        checkCollisions(animal.position);
      }
    });

    return updatedAnimals;
  }, [obstacles, checkCollisions]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setAnimals(prevAnimals => updateAnimalPositions(prevAnimals, playerPosition));
    }, 750);

    return () => clearInterval(moveInterval);
  }, [updateAnimalPositions, playerPosition]);

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