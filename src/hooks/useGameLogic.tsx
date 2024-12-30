import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Position, AnimalType } from '../components/Game';
import { GRID_SIZE, INITIAL_OBSTACLES, LEVEL_CONFIGS } from '../config/gameConfig';
import { updateAnimalPositions, positionQueue, getValidMove } from '../utils/gameLogic';

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
  const { toast } = useToast();

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

  const handleMove = useCallback((direction: string) => {
    if (gameCompleted) return;
    
    if (!startTime) {
      setStartTime(Date.now());
      setCurrentTime(0);
    }
    
    setShowLevelMessage(false);

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
  }, [gameCompleted, startTime, obstacles, checkCollisions]);

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

  const getAnimalName = (type: AnimalType['type']) => {
    switch (type) {
      case 'cat': return 'Katze';
      case 'chicken': return 'Huhn';
      case 'pig': return 'Schwein';
      case 'horse': return 'Pferd';
    }
  };

  return {
    currentLevel,
    playerPosition,
    animals,
    obstacles,
    gameCompleted,
    showLevelMessage,
    currentTime,
    totalTime,
    handleMove,
    resetGame,
    startLevel,
  };
};