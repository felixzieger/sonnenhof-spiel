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

const getHorseMove = (position: Position, gridSize: number): Position => {
  // Generate random movement distance between 2 and 3 fields
  const moveDistance = Math.floor(Math.random() * 2) + 2; // This gives us either 2 or 3
  
  // Get random direction
  const directions = [
    { dx: 1, dy: 0 },    // right
    { dx: -1, dy: 0 },   // left
    { dx: 0, dy: 1 },    // down
    { dx: 0, dy: -1 },   // up
    { dx: 1, dy: 1 },    // diagonal down-right
    { dx: -1, dy: 1 },   // diagonal down-left
    { dx: 1, dy: -1 },   // diagonal up-right
    { dx: -1, dy: -1 },  // diagonal up-left
  ];
  
  const direction = directions[Math.floor(Math.random() * directions.length)];
  
  // Calculate new position with the random distance
  const newPosition = {
    x: Math.max(0, Math.min(gridSize - 1, position.x + (direction.dx * moveDistance))),
    y: Math.max(0, Math.min(gridSize - 1, position.y + (direction.dy * moveDistance)))
  };
  
  console.log('Horse moving from:', position, 'to:', newPosition, 'with distance:', moveDistance);
  return newPosition;
};

export const updateAnimalPositions = (
  currentAnimals: AnimalType[], 
  obstacles: typeof INITIAL_OBSTACLES
): AnimalType[] => {
  const currentPlayerPos = positionQueue.getLatest();
  if (!currentPlayerPos) return currentAnimals;

  return currentAnimals.map(animal => {
    if (animal.caught) return animal;

    // Prüfe, ob das Tier sich bewegen soll basierend auf seiner moveDelay
    const shouldMove = Date.now() % 750 >= animal.moveDelay;
    
    console.log(`Animal ${animal.id} (${animal.type}):`, {
      moveDelay: animal.moveDelay,
      currentTime: Date.now(),
      shouldMove
    });

    if (!shouldMove) {
      return animal;
    }

    let newPosition: Position;

    switch (animal.type) {
      case 'horse':
        newPosition = getHorseMove(animal.position, GRID_SIZE);
        console.log('Horse moving to:', newPosition);
        break;
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