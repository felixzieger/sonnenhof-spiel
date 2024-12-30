import { Position } from '../components/Game';
import { createObstacleArea } from '../utils/obstacleUtils';

export const GRID_SIZE = 18; // Changed from 19 to 18 to fix off-by-one error

// Example usage of createObstacleArea - you can modify these to create your desired layout
export const INITIAL_OBSTACLES: Position[] = [
  // Maschinenhalle links
  ...createObstacleArea({ x: 2, y: 7 }, 2, 4),
  
  // Scheune mitte
  ...createObstacleArea({ x: 6, y: 7 }, 7, 4),
  
  // Maschinenhalle unten
  ...createObstacleArea({ x: 8, y: 15 }, 5, 2),
  
  // altes Haus
  ...createObstacleArea({ x: 11, y: 1 }, 2, 3),
  
  // neues Haus
  ...createObstacleArea({ x: 15, y: 1 }, 3, 3),
];

const generateMoveDelay = () => Math.floor(Math.random() * 4) * 100;

// Helper function to check if a position is valid (not on an obstacle)
const isValidPosition = (position: Position): boolean => {
  return !INITIAL_OBSTACLES.some(
    obstacle => obstacle.x === position.x && obstacle.y === position.y
  );
};

// Helper function to generate a random valid position
const getRandomValidPosition = (): Position => {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
      y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
    };
  } while (!isValidPosition(position));
  
  return position;
};

export interface LevelConfig {
  animals: Array<{
    id: number;
    type: 'cat' | 'chicken' | 'pig' | 'horse';
    position: Position;
    caught: boolean;
    moveDelay: number;
  }>;
  message: string;
  showControls?: boolean;
}

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    animals: [
      { 
        id: 1, 
        type: 'cat' as const, 
        position: getRandomValidPosition(), 
        caught: false, 
        moveDelay: generateMoveDelay() 
      },
    ],
    message: "Die Katze hat Schnupfen und muss zum Tierarzt. Fang die Katze ein!",
    showControls: true
  },
  2: {
    animals: [
      ...Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        type: 'cat' as const,
        position: getRandomValidPosition(),
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 14,
        type: 'pig' as const,
        position: getRandomValidPosition(),
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 16,
        type: 'horse' as const,
        position: getRandomValidPosition(),
        caught: false,
        moveDelay: generateMoveDelay()
      }))
    ],
    message: "Das Stalltor stand offen, Pferde und Schweine sind ausgebüchst. Fang sie schnell wieder ein!"
  },
  3: {
    animals: [
      ...Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        type: 'cat' as const,
        position: getRandomValidPosition(),
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 14,
        type: 'pig' as const,
        position: getRandomValidPosition(),
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 16,
        type: 'horse' as const,
        position: getRandomValidPosition(),
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 4,
        type: 'chicken' as const,
        position: getRandomValidPosition(),
        caught: false,
        moveDelay: generateMoveDelay()
      }))
    ],
    message: "Oh nein, jetzt ist auch noch der Hühnerpförtner kaputt - der Sonnenhof spielt verrückt! Fang alle Tiere wieder ein!"
  }
};
