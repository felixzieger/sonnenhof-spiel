import React, { useState, useEffect } from 'react';
import { Player } from './Player';
import { Animal } from './Animal';
import { ScoreBoard } from './ScoreBoard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

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

const GRID_SIZE = 20;
const INITIAL_ANIMALS: AnimalType[] = [
  { id: 1, type: 'cat', position: { x: 2, y: 2 }, caught: false },
  { id: 2, type: 'chicken', position: { x: 15, y: 15 }, caught: false },
  { id: 3, type: 'pig', position: { x: 5, y: 18 }, caught: false },
];

export const Game = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: GRID_SIZE / 2, y: GRID_SIZE / 2 });
  const [animals, setAnimals] = useState<AnimalType[]>(INITIAL_ANIMALS);
  const { toast } = useToast();

  const resetGame = () => {
    setPlayerPosition({ x: GRID_SIZE / 2, y: GRID_SIZE / 2 });
    setAnimals(INITIAL_ANIMALS);
    toast({
      title: "Spiel neu gestartet",
      description: "Fang alle Tiere wieder ein!",
    });
  };

  const getDistance = (pos1: Position, pos2: Position): number => {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  };

  const moveTowardsPlayer = (position: Position): Position => {
    const dx = playerPosition.x - position.x;
    const dy = playerPosition.y - position.y;
    return {
      x: position.x + Math.sign(dx),
      y: position.y + Math.sign(dy)
    };
  };

  const moveAwayFromPlayer = (position: Position): Position => {
    const dx = playerPosition.x - position.x;
    const dy = playerPosition.y - position.y;
    return {
      x: Math.max(0, Math.min(GRID_SIZE - 1, position.x - Math.sign(dx))),
      y: Math.max(0, Math.min(GRID_SIZE - 1, position.y - Math.sign(dy)))
    };
  };

  const getRandomMove = (position: Position): Position => {
    const directions = [
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 }
    ];
    const move = directions[Math.floor(Math.random() * directions.length)];
    return {
      x: Math.max(0, Math.min(GRID_SIZE - 1, position.x + move.dx)),
      y: Math.max(0, Math.min(GRID_SIZE - 1, position.y + move.dy))
    };
  };

  useEffect(() => {
    // Bewegung für Schweine (alle 3 Sekunden)
    const pigInterval = setInterval(() => {
      setAnimals(prevAnimals => 
        prevAnimals.map(animal => {
          if (animal.type === 'pig' && !animal.caught) {
            return {
              ...animal,
              position: getRandomMove(animal.position)
            };
          }
          return animal;
        })
      );
    }, 3000);

    // Bewegung für Katzen (alle 2 Sekunden)
    const catInterval = setInterval(() => {
      setAnimals(prevAnimals => 
        prevAnimals.map(animal => {
          if (animal.type === 'cat' && !animal.caught) {
            const newDirection = animal.lastMoveDirection === 'towards' ? 'away' : 'towards';
            const newPosition = newDirection === 'towards' 
              ? moveTowardsPlayer(animal.position)
              : moveAwayFromPlayer(animal.position);
            
            return {
              ...animal,
              position: newPosition,
              lastMoveDirection: newDirection
            };
          }
          return animal;
        })
      );
    }, 2000);

    // Bewegung für Hühner (jede Sekunde)
    const chickenInterval = setInterval(() => {
      setAnimals(prevAnimals => 
        prevAnimals.map(animal => {
          if (animal.type === 'chicken' && !animal.caught) {
            const distanceToPlayer = getDistance(animal.position, playerPosition);
            if (distanceToPlayer <= 3) {
              return {
                ...animal,
                position: moveAwayFromPlayer(animal.position)
              };
            }
          }
          return animal;
        })
      );
    }, 1000);

    return () => {
      clearInterval(pigInterval);
      clearInterval(catInterval);
      clearInterval(chickenInterval);
    };
  }, [playerPosition]);

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

    setPlayerPosition(newPosition);
    checkCollisions(newPosition);
  };

  const checkCollisions = (newPosition: Position) => {
    setAnimals(prevAnimals => 
      prevAnimals.map(animal => {
        if (!animal.caught && 
            Math.abs(animal.position.x - newPosition.x) < 1 && 
            Math.abs(animal.position.y - newPosition.y) < 1) {
          toast({
            title: "Tier gefangen!",
            description: `Du hast ein${animal.type === 'cat' ? 'e' : ''} ${getAnimalName(animal.type)} gefangen!`,
          });
          return { ...animal, caught: true };
        }
        return animal;
      })
    );
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
        style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.1) 39px, rgba(0,0,0,0.1) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.1) 39px, rgba(0,0,0,0.1) 40px)'
        }}
      >
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