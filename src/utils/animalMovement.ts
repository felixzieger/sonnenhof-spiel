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
    { dx: 0, dy: 1 },   // nach unten
    { dx: 0, dy: -1 },  // nach oben
    { dx: 1, dy: 0 },   // nach rechts
    { dx: -1, dy: 0 }   // nach links
  ];

  // Wenn das Tier am Rand ist, bevorzugen wir Bewegungen weg vom Rand
  const isAtLeftEdge = position.x === 0;
  const isAtRightEdge = position.x === gridSize - 1;
  const isAtTopEdge = position.y === 0;
  const isAtBottomEdge = position.y === gridSize - 1;

  let availableDirections = [...directions];

  // Wenn das Tier an einem Rand ist, entfernen wir die Bewegung in Richtung des Rands
  // und verdoppeln die Chance für Bewegungen weg vom Rand
  if (isAtLeftEdge) {
    availableDirections = availableDirections.filter(d => d.dx !== -1);
    availableDirections.push({ dx: 1, dy: 0 }); // Zusätzliche Chance nach rechts
  }
  if (isAtRightEdge) {
    availableDirections = availableDirections.filter(d => d.dx !== 1);
    availableDirections.push({ dx: -1, dy: 0 }); // Zusätzliche Chance nach links
  }
  if (isAtTopEdge) {
    availableDirections = availableDirections.filter(d => d.dy !== -1);
    availableDirections.push({ dx: 0, dy: 1 }); // Zusätzliche Chance nach unten
  }
  if (isAtBottomEdge) {
    availableDirections = availableDirections.filter(d => d.dy !== 1);
    availableDirections.push({ dx: 0, dy: -1 }); // Zusätzliche Chance nach oben
  }

  const move = availableDirections[Math.floor(Math.random() * availableDirections.length)];
  
  return {
    x: Math.max(0, Math.min(gridSize - 1, position.x + move.dx)),
    y: Math.max(0, Math.min(gridSize - 1, position.y + move.dy))
  };
};