import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Position, AnimalType } from '../components/Game';
import { GRID_SIZE, INITIAL_OBSTACLES, LEVEL_CONFIGS } from '../config/gameConfig';
import { updateAnimalPositions, positionQueue, getValidMove } from '../utils/gameLogic';
import { getAnimalName } from '../utils/animalUtils';
import { playCatchSound } from '../utils/soundEffects';

export const useGameLogic = () => {
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
  const [isLevelRunning, setIsLevelRunning] = useState(false);
  const { toast } = useToast();

  const startLevel = useCallback((level: number) => {
    console.log('startLevel called in useGameLogic');
    console.log('level:', level);
    console.log('Current showLevelMessage state:', showLevelMessage);
    console.log('isLevelRunning state:', isLevelRunning);
    
    setPlayerPosition({ x: 10, y: 5 });
    setAnimals(LEVEL_CONFIGS[level].animals.map(animal => ({
      ...animal,
      moveDelay: Math.floor(Math.random() * 300)
    })));
    positionQueue.clear();
    
    // Set these states in a more predictable order
    setIsLevelRunning(true);
    setShowLevelMessage(false);
    
    if (level === 1) {
      setStartTime(Date.now());
      setCurrentTime(0);
      setTotalTime(0);
    }
    
    console.log('States updated in startLevel');
  }, []); // Remove showLevelMessage from dependencies to avoid cycles

  const resetGame = useCallback(() => {
    console.log('resetGame called');
    setCurrentLevel(1);
    setGameCompleted(false);
    setStartTime(null);
    setShowLevelMessage(true);
    setIsLevelRunning(false);
    startLevel(1);
  }, [startLevel]);

  const checkLevelComplete = useCallback(() => {
    const allCaught = animals.every(animal => animal.caught);
    if (allCaught && !gameCompleted) {
      if (currentLevel < 3) {
        const nextLevel = currentLevel + 1;
        setCurrentLevel(nextLevel);
        setShowLevelMessage(true);
        setIsLevelRunning(false);
        startLevel(nextLevel);
      } else {
        setTotalTime(currentTime);
        setGameCompleted(true);
        setIsLevelRunning(false);
      }
    }
  }, [animals, currentLevel, gameCompleted, currentTime, startLevel]);

  const checkCollisions = useCallback((playerPos: Position) => {
    console.log('Checking collisions with player at:', playerPos);
    setAnimals(prevAnimals => 
      prevAnimals.map(animal => {
        if (!animal.caught && 
            Math.abs(animal.position.x - playerPos.x) < 1 && 
            Math.abs(animal.position.y - playerPos.y) < 1) {
          playCatchSound(animal.type);
          return { ...animal, caught: true };
        }
        return animal;
      })
    );
  }, []);

  const handleMove = useCallback((direction: string) => {
    if (gameCompleted || !isLevelRunning) return;
    
    if (!startTime) {
      setStartTime(Date.now());
      setCurrentTime(0);
    }

    setPlayerPosition(prevPosition => {
      const newPosition = { ...prevPosition };
      
      switch (direction) {
        case 'ArrowUp':
          newPosition.y = Math.max(0, prevPosition.y - 1);
          break;
        case 'ArrowDown':
          newPosition.y = Math.min(GRID_SIZE - 1, prevPosition.y + 1);
          break;
        case 'ArrowLeft':
          newPosition.x = Math.max(0, prevPosition.x - 1);
          break;
        case 'ArrowRight':
          newPosition.x = Math.min(GRID_SIZE - 1, prevPosition.x + 1);
          break;
        default:
          return prevPosition;
      }

      const validPosition = getValidMove(prevPosition, newPosition, obstacles);
      console.log('Moving player to:', validPosition);
      
      if (validPosition.x !== prevPosition.x || validPosition.y !== prevPosition.y) {
        positionQueue.add(validPosition);
        checkCollisions(validPosition);
        return validPosition;
      }
      
      return prevPosition;
    });
  }, [gameCompleted, isLevelRunning, startTime, obstacles, checkCollisions]);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setAnimals(prevAnimals => updateAnimalPositions(prevAnimals, obstacles));
    }, 750);
    return () => clearInterval(moveInterval);
  }, [obstacles]);

  useEffect(() => {
    checkLevelComplete();
  }, [animals, checkLevelComplete]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime && !gameCompleted && isLevelRunning) {
      intervalId = setInterval(() => {
        const now = Date.now();
        setCurrentTime(now - startTime);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [startTime, gameCompleted, isLevelRunning]);

  return {
    currentLevel,
    playerPosition,
    animals,
    obstacles,
    gameCompleted,
    setGameCompleted,
    showLevelMessage,
    currentTime,
    totalTime,
    handleMove,
    resetGame,
    startLevel,
    isLevelRunning
  };
};
