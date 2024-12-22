import { Position, AnimalType } from '../components/Game';
import { GRID_SIZE, INITIAL_OBSTACLES } from '../config/gameConfig';
import { getDistance, moveTowardsPlayer, moveAwayFromPlayer, getRandomMove } from './animalMovement';
import { PositionQueue } from './positionQueue';

export const positionQueue = new PositionQueue();

export const isPositionBlocked = (position: Position, obstacles: typeof INITIAL_OBSTACLES) => {
  return obstacles.some(obstacle => 
    obstacle.position.x === position.x && 
    obstacle.position.y === position.y
  );
};

export const getValidMove = (
  currentPos: Position, 
  newPos: Position, 
  obstacles: typeof INITIAL_OBSTACLES
): Position => {
  if (
    newPos.x < 0 || 
    newPos.x >= GRID_SIZE || 
    newPos.y < 0 || 
    newPos.y >= GRID_SIZE ||
    isPositionBlocked(newPos, obstacles)
  ) {
    return currentPos;
  }
  return newPos;
};

export const updateAnimalPositions = (
  currentAnimals: AnimalType[], 
  obstacles: typeof INITIAL_OBSTACLES
): AnimalType[] => {
  const currentPlayerPos = positionQueue.getLatest();
  if (!currentPlayerPos) return currentAnimals;

  const currentTime = Date.now();
  console.log('Current time:', currentTime);
  
  return currentAnimals.map(animal => {
    if (animal.caught) return animal;

    // Prüfe, ob genug Zeit seit der letzten Bewegung vergangen ist
    const timeSinceLastMove = currentTime % 750;
    const shouldMove = timeSinceLastMove >= animal.moveDelay && timeSinceLastMove < (animal.moveDelay + 50);
    
    console.log(`Animal ${animal.id} (${animal.type}):`, {
      moveDelay: animal.moveDelay,
      timeSinceLastMove,
      shouldMove
    });

    if (!shouldMove) {
      return animal;
    }

    let newPosition: Position;

    switch (animal.type) {
      case 'pig':
        newPosition = getRandomMove(animal.position, GRID_SIZE);
        console.log('Pig moving randomly to:', newPosition);
        break;
      case 'cat':
        const newDirection = animal.lastMoveDirection === 'towards' ? 'away' : 'towards';
        newPosition = newDirection === 'towards'
          ? moveTowardsPlayer(animal.position, currentPlayerPos)
          : moveAwayFromPlayer(animal.position, currentPlayerPos, GRID_SIZE);
        console.log('Cat moving', newDirection, 'player to:', newPosition);
        break;
      case 'chicken':
        const distanceToPlayer = getDistance(animal.position, currentPlayerPos);
        console.log('Chicken distance to player:', distanceToPlayer);
        if (distanceToPlayer <= 3) {
          newPosition = moveAwayFromPlayer(animal.position, currentPlayerPos, GRID_SIZE);
          console.log('Chicken running away to:', newPosition);
        } else {
          newPosition = getRandomMove(animal.position, GRID_SIZE);
          console.log('Chicken moving randomly to:', newPosition);
        }
        break;
      default:
        return animal;
    }

    const validPosition = getValidMove(animal.position, newPosition, obstacles);
    console.log(`${animal.type} final position after obstacle check:`, validPosition);

    return {
      ...animal,
      position: validPosition,
      lastMoveDirection: animal.type === 'cat' 
        ? (animal.lastMoveDirection === 'towards' ? 'away' : 'towards') 
        : animal.lastMoveDirection
    };
  });
};