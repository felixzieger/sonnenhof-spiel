import { Position } from '../components/Game';
import { GRID_SIZE } from '../config/gameConfig';

export interface Viewport {
  offsetX: number;
  offsetY: number;
  visibleSize: number;
}

export const calculateViewport = (playerPos: Position, visibleGridSize: number): Viewport => {
  // Calculate the offset needed to center the player
  const halfVisible = Math.floor(visibleGridSize / 2);
  
  // Calculate initial offsets that would center the player
  let offsetX = Math.max(0, Math.min(playerPos.x - halfVisible, GRID_SIZE - visibleGridSize));
  let offsetY = Math.max(0, Math.min(playerPos.y - halfVisible, GRID_SIZE - visibleGridSize));

  return {
    offsetX,
    offsetY,
    visibleSize: visibleGridSize
  };
};

export const isPositionVisible = (pos: Position, viewport: Viewport): boolean => {
  return pos.x >= viewport.offsetX && 
         pos.x < viewport.offsetX + viewport.visibleSize &&
         pos.y >= viewport.offsetY && 
         pos.y < viewport.offsetY + viewport.visibleSize;
};

export const adjustPositionForViewport = (pos: Position, viewport: Viewport): Position => {
  return {
    x: pos.x - viewport.offsetX,
    y: pos.y - viewport.offsetY
  };
};