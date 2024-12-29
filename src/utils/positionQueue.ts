import { Position } from '../components/Game';

export class PositionQueue {
  private positions: Position[] = [];
  private maxSize = 5;

  add(position: Position) {
    this.positions.push(position);
    if (this.positions.length > this.maxSize) {
      this.positions.shift();
    }
  }

  getLatest(): Position | null {
    return this.positions[this.positions.length - 1] || null;
  }

  clear() {
    this.positions = [];
  }
}