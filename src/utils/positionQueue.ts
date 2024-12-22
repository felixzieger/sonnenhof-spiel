import { Position } from '../components/Game';

export class PositionQueue {
  private positions: Position[];
  private maxSize: number;

  constructor(maxSize: number = 10) {
    this.positions = [];
    this.maxSize = maxSize;
  }

  add(position: Position) {
    this.positions.push({ ...position });
    if (this.positions.length > this.maxSize) {
      this.positions.shift();
    }
  }

  getLatest(): Position | null {
    return this.positions.length > 0 ? this.positions[this.positions.length - 1] : null;
  }

  clear() {
    this.positions = [];
  }
}