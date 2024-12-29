import { Position } from '../components/Game';

export const GRID_SIZE = 20;

export const INITIAL_OBSTACLES: Position[] = [
  { x: 3, y: 3 },
  { x: 4, y: 3 },
  { x: 15, y: 4 },
  { x: 16, y: 4 },
  // Hindernisse am Rand
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 18, y: 0 },
  { x: 19, y: 0 },
  { x: 0, y: 19 },
  { x: 1, y: 19 },
  { x: 18, y: 19 },
  { x: 19, y: 19 },
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
