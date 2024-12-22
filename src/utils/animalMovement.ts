import { Position } from '../components/Game';

export const getDistance = (pos1: Position, pos2: Position): number => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

export const moveTowardsPlayer = (animalPos: Position, playerPos: Position): Position => {
  const dx = playerPos.x - animalPos.x;
  const dy = playerPos.y - animalPos.y;
  return {
    x: animalPos.x + Math.sign(dx),
    y: animalPos.y + Math.sign(dy)
  };
};

export const moveAwayFromPlayer = (animalPos: Position, playerPos: Position, gridSize: number): Position => {
  const dx = playerPos.x - animalPos.x;
  const dy = playerPos.y - animalPos.y;
  return {
    x: Math.max(0, Math.min(gridSize - 1, animalPos.x - Math.sign(dx))),
    y: Math.max(0, Math.min(gridSize - 1, animalPos.y - Math.sign(dy)))
  };
};

export const getRandomMove = (position: Position, gridSize: number): Position => {
  const directions = [
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 }
  ];
  const move = directions[Math.floor(Math.random() * directions.length)];
  return {
    x: Math.max(0, Math.min(gridSize - 1, position.x + move.dx)),
    y: Math.max(0, Math.min(gridSize - 1, position.y + move.dy))
  };
};