import { useIsMobile } from '@/hooks/use-mobile';
import { MobileGame } from './MobileGame';
import { DesktopGame } from './DesktopGame';

export type Position = {
  x: number;
  y: number;
};

export type AnimalType = {
  id: number;
  type: 'cat' | 'chicken' | 'pig' | 'horse';
  position: Position;
  caught: boolean;
  lastMoveDirection?: 'towards' | 'away';
  moveDelay: number;
};

export const Game = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileGame /> : <DesktopGame />;
};

export default Game;