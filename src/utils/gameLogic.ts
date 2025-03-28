import { Position, AnimalType } from '../components/Game';
import { GRID_SIZE } from '../config/gameConfig';
import { getDistance, moveTowardsPlayer, moveAwayFromPlayer, getRandomMove } from './animalMovement';
import { PositionQueue } from './positionQueue';

// Create a singleton instance of PositionQueue
const positionQueueInstance = new PositionQueue();
export { positionQueueInstance as positionQueue };

export const isPositionBlocked = (position: Position, obstacles: Position[], playerPosition: Position): boolean => {
  // Check if position is outside game boundaries
  if (position.x < 0 || position.x >= GRID_SIZE || position.y < 0 || position.y >= GRID_SIZE) {
    console.log('Position blocked: Outside game boundaries', position);
    return true;
  }

  // Check if position is blocked by an obstacle
  const blockedByObstacle = obstacles.some(obstacle => 
    obstacle.x === position.x && obstacle.y === position.y
  );
  
  if (blockedByObstacle) {
    console.log('Position blocked: Obstacle present', position);
    return true;
  }

  // Check if position is blocked by player
  const blockedByPlayer = position.x === playerPosition.x && position.y === playerPosition.y;
  if (blockedByPlayer) {
    console.log('Position blocked: Player present', position);
    return true;
  }

  return false;
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

const tryAlternativeEscape = (
  animalPos: Position,
  playerPos: Position,
  obstacles: Position[],
  gridSize: number
): Position => {
  // Calculate the main direction vector from player to animal
  const dx = animalPos.x - playerPos.x;
  const dy = animalPos.y - playerPos.y;

  // Try moving 90 degrees to the left of the escape direction
  const leftMove: Position = {
    x: Math.max(0, Math.min(gridSize - 1, animalPos.x - dy)),
    y: Math.max(0, Math.min(gridSize - 1, animalPos.y + dx))
  };

  // Try moving 90 degrees to the right of the escape direction
  const rightMove: Position = {
    x: Math.max(0, Math.min(gridSize - 1, animalPos.x + dy)),
    y: Math.max(0, Math.min(gridSize - 1, animalPos.y - dx))
  };

  console.log('Trying alternative escape moves:', { leftMove, rightMove });

  // Check if either alternative move is valid
  if (!isPositionBlocked(leftMove, obstacles, playerPos)) {
    console.log('Using left alternative move');
    return leftMove;
  }
  if (!isPositionBlocked(rightMove, obstacles, playerPos)) {
    console.log('Using right alternative move');
    return rightMove;
  }

  console.log('No valid alternative moves found, staying in place');
  return animalPos;
};

export const getValidMove = (
  currentPos: Position, 
  newPos: Position, 
  obstacles: Position[]
): Position => {
  if (isPositionBlocked(newPos, obstacles, currentPos)) {
    return currentPos;
  }
  return newPos;
};

export const updateAnimalPositions = (
  currentAnimals: AnimalType[], 
  obstacles: Position[]
): AnimalType[] => {
  const currentPlayerPos = positionQueueInstance.getLatest();
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
        
        if (newPosition.x === currentPlayerPos.x && newPosition.y === currentPlayerPos.y) {
          return {
            ...animal,
            position: animal.position,
            lastMoveDirection: newDirection
          };
        }
        
        return {
          ...animal,
          position: getValidMove(animal.position, newPosition, obstacles),
          lastMoveDirection: newDirection
        };
      case 'chicken':
        const distanceToPlayer = getDistance(animal.position, currentPlayerPos);
        if (distanceToPlayer <= 3) {
          // Try to move away from player
          newPosition = moveAwayFromPlayer(animal.position, currentPlayerPos, GRID_SIZE);
          
          // If the direct escape route is blocked, try alternative paths
          if (isPositionBlocked(newPosition, obstacles, currentPlayerPos)) {
            newPosition = tryAlternativeEscape(animal.position, currentPlayerPos, obstacles, GRID_SIZE);
          }
        } else {
          newPosition = getRandomMove(animal.position, GRID_SIZE);
        }
        break;
      default:
        return animal;
    }

    // Check if the new position is blocked by player
    if (newPosition.x === currentPlayerPos.x && newPosition.y === currentPlayerPos.y) {
      return animal;
    }

    return {
      ...animal,
      position: getValidMove(animal.position, newPosition, obstacles)
    };
  });
};