import React, { useState, useEffect, useCallback } from 'react';
import { Player } from './Player';
import { Animal } from './Animal';
import { Obstacle } from './Obstacle';
import { ScoreBoard } from './ScoreBoard';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { GRID_SIZE, INITIAL_OBSTACLES, LEVEL_CONFIGS } from '../config/gameConfig';
import { updateAnimalPositions, positionQueue, getValidMove } from '../utils/gameLogic';
import { getAnimalName } from '../utils/animalUtils';
import { playCatchSound } from '../utils/soundEffects';
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
import { LevelMessage } from './LevelMessage';
import { Position, AnimalType } from './Game';
import { HighscoreList } from './game/HighscoreList';
import { SeasonToggle } from './game/SeasonToggle';
import { useWinterMode } from '@/hooks/useWinterMode';
import { HighscoreDialog } from './game/HighscoreDialog';
import { SoundToggle } from './game/SoundToggle';
import { GameHeader } from './game/GameHeader';

export const DesktopGame = () => {
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
  const [showHighscoreList, setShowHighscoreList] = useState(false);
  const [showHighscoreDialog, setShowHighscoreDialog] = useState(false);
  const [isLevelRunning, setIsLevelRunning] = useState(false);
  const { toast } = useToast();
  const { isWinter, setIsWinter } = useWinterMode();

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    setIsWinter(currentMonth >= 9 || currentMonth <= 2);
  }, [setIsWinter]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime && isLevelRunning && !gameCompleted) {
      intervalId = setInterval(() => {
        const now = Date.now();
        setCurrentTime(now - startTime);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [startTime, isLevelRunning, gameCompleted]);

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

  const handleStartLevel = () => {
    setShowLevelMessage(false);
    setIsLevelRunning(true);
    if (!startTime) {
      setStartTime(Date.now());
    } else {
      setStartTime(Date.now() - currentTime);
    }
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setGameCompleted(false);
    setStartTime(null);
    setIsLevelRunning(false);
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
      setIsLevelRunning(false);
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
          playCatchSound(animal.type);
          return { ...animal, caught: true };
        }
        return animal;
      })
    );
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (isLevelRunning) {
        setAnimals(prevAnimals => updateAnimalPositions(prevAnimals, obstacles));
      }
    }, 750);
    return () => clearInterval(moveInterval);
  }, [obstacles, isLevelRunning]);

  useEffect(() => {
    checkLevelComplete();
  }, [animals, checkLevelComplete]);

  const handleMove = useCallback((direction: string) => {
    if (gameCompleted || !isLevelRunning) return;
    
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
    
    if (validPosition.x !== playerPosition.x || validPosition.y !== playerPosition.y) {
      setPlayerPosition(validPosition);
      positionQueue.add(validPosition);
      checkCollisions(validPosition);
    }
  }, [playerPosition, gameCompleted, isLevelRunning, obstacles, checkCollisions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        handleMove(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove]);

  const handleHighscoreSubmit = () => {
    setShowHighscoreList(false);
    setShowHighscoreDialog(true);
  };

  const handleHighscoreDialogClose = () => {
    setShowHighscoreDialog(false);
    setShowHighscoreList(true); // Show the highscore list instead of resetting
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <GameHeader
        level={currentLevel}
        animals={animals}
        currentTime={currentTime}
        totalTime={totalTime}
        gameCompleted={gameCompleted}
        onRestart={resetGame}
        isWinter={isWinter}
        onToggleSeason={() => setIsWinter(!isWinter)}
        isMobile={false}
      />
      <div 
        className={`relative w-full sm:w-[800px] aspect-square rounded-lg border-4 border-fence overflow-hidden bg-cover bg-center ${
          isWinter ? 'bg-farm-winter' : 'bg-farm-summer'
        }`}
      >
        {obstacles.map((obstacle, index) => (
          <Obstacle 
            key={index}
            position={obstacle}
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
        {showLevelMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center mx-4">
              <LevelMessage 
                level={currentLevel} 
                showControls={LEVEL_CONFIGS[currentLevel].showControls}
                onStart={handleStartLevel}
              />
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={gameCompleted}>
        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Gratulation!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-center">Du hast alle Level geschafft und den Sonnenhof gerettet!</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Hourglass className="w-6 h-6" />
                <span className="font-mono text-2xl font-bold">{formatTime(totalTime)}</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center sm:justify-center gap-2">
            <AlertDialogAction onClick={resetGame} className="w-full sm:w-auto">
              Nochmal spielen
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => setShowHighscoreList(true)}
              className="w-full sm:w-auto"
            >
              Bestenliste
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HighscoreList
        isOpen={showHighscoreList}
        onClose={() => setShowHighscoreList(false)}
        onSaveScore={handleHighscoreSubmit}
        currentScore={gameCompleted ? totalTime : null}
      />

      <HighscoreDialog
        isOpen={showHighscoreDialog}
        onClose={handleHighscoreDialogClose}
        time={totalTime}
      />
    </div>
  );
};
