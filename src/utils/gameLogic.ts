import { Position, AnimalType } from '../components/Game';
import { GRID_SIZE } from '../config/gameConfig';
import { getDistance, moveTowardsPlayer, moveAwayFromPlayer, getRandomMove } from './animalMovement';
import { PositionQueue } from './positionQueue';

export const positionQueue = new PositionQueue();

export const isPositionBlocked = (position: Position, obstacles: Position[]) => {
  return obstacles.some(obstacle => 
    obstacle.x === position.x && 
    obstacle.y === position.y
  );
};

const getHorseMove = (position: Position, gridSize: number): Position => {
  const moveDistance = Math.floor(Math.random() * 2) + 2;
  
  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: -1 },
  ];
  
  const direction = directions[Math.floor(Math.random() * directions.length)];
  
  return {
    x: Math.max(0, Math.min(gridSize - 1, position.x + (direction.dx * moveDistance))),
    y: Math.max(0, Math.min(gridSize - 1, position.y + (direction.dy * moveDistance)))
  };
};

export const getValidMove = (
  currentPos: Position, 
  newPos: Position, 
  obstacles: Position[]
): Position => {
  if (isPositionBlocked(newPos, obstacles)) {
    return currentPos;
  }
  return newPos;
};

export const updateAnimalPositions = (
  currentAnimals: AnimalType[], 
  obstacles: Position[]
): AnimalType[] => {
  const currentPlayerPos = positionQueue.getLatest();
  if (!currentPlayerPos) return currentAnimals;

  return currentAnimals.map(animal => {
    if (animal.caught) return animal;

    const shouldMove = Math.random() < 0.85; // 85% Chance sich zu bewegen
    
    if (!shouldMove) {
      return animal;
    }

    let newPosition: Position;

    switch (animal.type) {
      case 'horse':
        newPosition = getHorseMove(animal.position, GRID_SIZE);
        break;
      case 'pig':
        newPosition = getRandomMove(animal.position, GRID_SIZE);
        break;
      case 'cat':
        const newDirection = animal.lastMoveDirection === 'towards' ? 'away' : 'towards';
        newPosition = newDirection === 'towards'
          ? moveTowardsPlayer(animal.position, currentPlayerPos)
          : moveAwayFromPlayer(animal.position, currentPlayerPos, GRID_SIZE);
        return {
          ...animal,
          position: getValidMove(animal.position, newPosition, obstacles),
          lastMoveDirection: newDirection
        };
      case 'chicken':
        const distanceToPlayer = getDistance(animal.position, currentPlayerPos);
        if (distanceToPlayer <= 3) {
          newPosition = moveAwayFromPlayer(animal.position, currentPlayerPos, GRID_SIZE);
        } else {
          newPosition = getRandomMove(animal.position, GRID_SIZE);
        }
        break;
      default:
        return animal;
    }

    return {
      ...animal,
      position: getValidMove(animal.position, newPosition, obstacles)
    };
  });
};