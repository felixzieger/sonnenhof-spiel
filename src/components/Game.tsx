import React, { useState, useEffect, useCallback } from 'react';
import { Player } from './Player';
import { Animal } from './Animal';
import { Obstacle } from './Obstacle';
import { ScoreBoard } from './ScoreBoard';
import { TouchControls } from './TouchControls';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { GRID_SIZE, INITIAL_OBSTACLES, LEVEL_CONFIGS } from '../config/gameConfig';
import { updateAnimalPositions, positionQueue, getValidMove } from '../utils/gameLogic';
import { Hourglass } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateViewport, Viewport } from '../utils/viewport';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { LevelMessage } from './LevelMessage';

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
  moveDelay: number;
};

export const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 15, y: 5 });
  const [animals, setAnimals] = useState<AnimalType[]>(() => 
    LEVEL_CONFIGS[1].animals.map(animal => ({
      ...animal,
      moveDelay: Math.floor(Math.random() * 300)
    }))
  );
  const [obstacles] = useState(INITIAL_OBSTACLES);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showLevelMessage, setShowLevelMessage] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Calculate viewport based on screen size
  const visibleGridSize = isMobile ? 7 : GRID_SIZE;
  const viewport: Viewport = calculateViewport(playerPosition, visibleGridSize);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (startTime && !gameCompleted) {
      intervalId = setInterval(() => {
        const now = Date.now();
        setCurrentTime(now - startTime);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startTime, gameCompleted]);

  const startLevel = (level: number) => {
    setPlayerPosition({ x: 10, y: 5 });
    setAnimals(LEVEL_CONFIGS[level].animals.map(animal => ({
      ...animal,
      moveDelay: Math.floor(Math.random() * 300)
    })));
    positionQueue.clear();
    setShowLevelMessage(true);
    
    if (level === 1) {
      setStartTime(null);
      setCurrentTime(0);
      setTotalTime(0);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setGameCompleted(false);
    setStartTime(null);
    startLevel(1);
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const checkLevelComplete = useCallback(() => {
    const allCaught = animals.every(animal => animal.caught);
    if (allCaught && !gameCompleted) {
      if (currentLevel < 3) {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        startLevel(nextLevel);
      } else {
        setTotalTime(currentTime);
        setGameCompleted(true);
      }
    }
  }, [animals, currentLevel, gameCompleted, currentTime]);

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

  useEffect(() => {
    checkLevelComplete();
  }, [animals, checkLevelComplete]);

  const handleMove = useCallback((direction: string) => {
    if (gameCompleted) return;
    
    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      setCurrentTime(0);
    }
    
    setShowLevelMessage(false);

    const newPosition = { ...playerPosition };

    switch (direction) {
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
  }, [playerPosition, gameCompleted, startTime, obstacles, checkCollisions]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      handleMove(e.key);
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const getAnimalName = (type: AnimalType['type']) => {
    switch (type) {
      case 'cat': return 'Katze';
      case 'chicken': return 'Huhn';
      case 'pig': return 'Schwein';
      case 'horse': return 'Pferd';
    }
  };

  const getCellBackground = (x: number, y: number) => {
    return 'bg-transparent';
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
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md h-[88px] flex items-center justify-center">
          <h2 className="text-xl font-bold">Level {currentLevel}</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-[88px] flex items-center justify-center gap-2">
          <Hourglass className="w-6 h-6" />
          <span className="font-mono text-2xl font-bold">
            {formatTime(gameCompleted ? totalTime : currentTime)}
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-[88px] flex items-center justify-center">
          <ScoreBoard animals={animals} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md h-[88px] flex items-center justify-center">
          <Button 
            onClick={resetGame}
            variant="outline"
            className="bg-white hover:bg-gray-100"
          >
            🔄 Neu starten
          </Button>
        </div>
      </div>
      <div 
        className="relative w-full sm:w-[800px] aspect-square rounded-lg border-4 border-fence overflow-hidden bg-farm-aerial bg-cover bg-center"
      >
        {gridCells}
        {obstacles.map((obstacle, index) => (
          <Obstacle 
            key={index}
            position={obstacle}
            gridSize={GRID_SIZE}
            viewport={viewport}
          />
        ))}
        <Player position={playerPosition} gridSize={GRID_SIZE} viewport={viewport} />
        {animals.map(animal => (
          !animal.caught && (
            <Animal 
              key={animal.id}
              type={animal.type}
              position={animal.position}
              gridSize={GRID_SIZE}
              viewport={viewport}
            />
          )
        ))}
        {showLevelMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center mx-4">
              <LevelMessage 
                level={currentLevel} 
                showControls={LEVEL_CONFIGS[currentLevel].showControls}
              />
            </div>
          </div>
        )}
      </div>
      {isMobile && <TouchControls onMove={handleMove} />}
      <AlertDialog open={gameCompleted}>
        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Gratulation!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Du hast alle Level geschafft und den Sonnenhof gerettet!</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Hourglass className="w-6 h-6" />
                <span className="font-mono text-2xl font-bold">{formatTime(totalTime)}</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>
              Nochmal spielen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Game;
