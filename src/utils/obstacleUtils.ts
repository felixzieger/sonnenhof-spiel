import { Position } from '../components/Game';

/**
 * Generates an array of obstacle positions forming a rectangle
 * @param start Starting position (top-left corner)
 * @param width Width of the rectangle in grid cells
 * @param height Height of the rectangle in grid cells
 * @returns Array of Position objects representing obstacles
 */
export const createObstacleArea = (
  start: Position,
  width: number,
  height: number
): Position[] => {
  const obstacles: Position[] = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      obstacles.push({
        x: start.x + x,
        y: start.y + y
      });
    }
  }
  
  console.log(`Created obstacle area at (${start.x}, ${start.y}) with dimensions ${width}x${height}`);
  return obstacles;
};