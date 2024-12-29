import { Position } from '../components/Game';
import { createObstacleArea } from '../utils/obstacleUtils';

export const GRID_SIZE = 20;

// Example usage of createObstacleArea - you can modify these to create your desired layout
export const INITIAL_OBSTACLES: Position[] = [
  // Create a 2x2 obstacle area in the top-left corner
  ...createObstacleArea({ x: 0, y: 0 }, 2, 2),
  
  // Create a 2x2 obstacle area in the top-right corner
  ...createObstacleArea({ x: 18, y: 0 }, 2, 2),
  
  // Create a 2x2 obstacle area in the bottom-left corner
  ...createObstacleArea({ x: 0, y: 18 }, 2, 2),
  
  // Create a 2x2 obstacle area in the bottom-right corner
  ...createObstacleArea({ x: 18, y: 18 }, 2, 2),
  
  // Create some obstacles in the middle of the map
  ...createObstacleArea({ x: 3, y: 3 }, 2, 1),
  ...createObstacleArea({ x: 15, y: 4 }, 2, 1),
];

const generateMoveDelay = () => Math.floor(Math.random() * 4) * 100;

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
      { id: 1, type: 'cat' as const, position: { x: 2, y: 2 }, caught: false, moveDelay: generateMoveDelay() },
    ],
    message: "Die Katze hat Schnupfen und muss zum Tierarzt. Fang die Katze ein!",
    showControls: true
  },
  2: {
    animals: [
      ...Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        type: 'cat' as const,
        position: {
          x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
        },
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 14,
        type: 'pig' as const,
        position: {
          x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
        },
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 16,
        type: 'horse' as const,
        position: {
          x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
        },
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
        position: {
          x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
        },
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 14,
        type: 'pig' as const,
        position: {
          x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
        },
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        id: i + 16,
        type: 'horse' as const,
        position: {
          x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
        },
        caught: false,
        moveDelay: generateMoveDelay()
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 4,
        type: 'chicken' as const,
        position: {
          x: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_SIZE - 4)) + 2
        },
        caught: false,
        moveDelay: generateMoveDelay()
      }))
    ],
    message: "Oh nein, jetzt ist auch noch der Hühnerpförtner kaputt - der Sonnenhof spielt verrückt! Fang alle Tiere wieder ein!"
  }
};
