import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Hourglass } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TouchControls } from './TouchControls';
import { Position, AnimalType } from './Game';
import { GRID_SIZE, INITIAL_OBSTACLES, LEVEL_CONFIGS } from '../config/gameConfig';
import { updateAnimalPositions, positionQueue, getValidMove } from '../utils/gameLogic';
import { GameHeader } from './game/GameHeader';
import { GameBoard } from './game/GameBoard';

export const MobileGame = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 10, y: 5 });
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

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime && !gameCompleted) {
      intervalId = setInterval(() => {
        const now = Date.now();
        setCurrentTime(now - startTime);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
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
      setStartTime(Date.now());
      setCurrentTime(0);
    }
    
    setShowLevelMessage(false);

    const newPosition = { ...playerPosition };
    
    // Handle diagonal movements by checking if the direction is already being processed
    if (direction === 'ArrowUp') {
      newPosition.y = Math.max(0, playerPosition.y - 1);
    }
    if (direction === 'ArrowDown') {
      newPosition.y = Math.min(GRID_SIZE - 1, playerPosition.y + 1);
    }
    if (direction === 'ArrowLeft') {
      newPosition.x = Math.max(0, playerPosition.x - 1);
    }
    if (direction === 'ArrowRight') {
      newPosition.x = Math.min(GRID_SIZE - 1, playerPosition.x + 1);
    }

    const validPosition = getValidMove(playerPosition, newPosition, obstacles);
    setPlayerPosition(validPosition);
    positionQueue.add(validPosition);
    checkCollisions(validPosition);
  }, [playerPosition, gameCompleted, startTime, obstacles, checkCollisions]);

  const getAnimalName = (type: AnimalType['type']) => {
    switch (type) {
      case 'cat': return 'Katze';
      case 'chicken': return 'Huhn';
      case 'pig': return 'Schwein';
      case 'horse': return 'Pferd';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <GameHeader 
        level={currentLevel}
        animals={animals}
        currentTime={currentTime}
        totalTime={totalTime}
        gameCompleted={gameCompleted}
      />
      
      <GameBoard 
        playerPosition={playerPosition}
        animals={animals}
        obstacles={obstacles}
        gridSize={GRID_SIZE + 1}
        currentLevel={currentLevel}
        showLevelMessage={showLevelMessage}
        onRestart={resetGame}
      />

      <TouchControls onMove={handleMove} />

      <AlertDialog open={gameCompleted}>
        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-4 w-[90%] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Gratulation!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Du hast alle Level geschafft und den Sonnenhof gerettet!</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Hourglass className="w-6 h-6" />
                <span className="font-mono text-2xl font-bold">
                  {formatTime(totalTime)}
                </span>
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
