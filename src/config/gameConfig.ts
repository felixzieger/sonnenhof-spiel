import { Position } from '../components/Game';
import { ObstacleType } from '../components/Obstacle';

export const GRID_SIZE = 20;

export interface Obstacle {
  id: number;
  type: ObstacleType;
  position: Position;
}

export const INITIAL_OBSTACLES: Obstacle[] = [
  { id: 1, type: 'house', position: { x: 3, y: 3 } },
  { id: 2, type: 'house', position: { x: 4, y: 3 } },
  { id: 3, type: 'house', position: { x: 15, y: 4 } },
  { id: 4, type: 'house', position: { x: 16, y: 4 } },
  // Bäume am Rand
  { id: 5, type: 'tree', position: { x: 0, y: 0 } },
  { id: 6, type: 'tree', position: { x: 1, y: 0 } },
  { id: 7, type: 'tree', position: { x: 18, y: 0 } },
  { id: 8, type: 'tree', position: { x: 19, y: 0 } },
  { id: 9, type: 'tree', position: { x: 0, y: 19 } },
  { id: 10, type: 'tree', position: { x: 1, y: 19 } },
  { id: 11, type: 'tree', position: { x: 18, y: 19 } },
  { id: 12, type: 'tree', position: { x: 19, y: 19 } },
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
      ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 4,
        type: 'chicken' as const,
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
    message: "Oh nein, jetzt ist auch noch der Hühnerpförtner kaputt - der Bauernhof spielt verrückt! Fang alle Tiere wieder ein!"
  }
};