import { Hourglass } from 'lucide-react';
import { ScoreBoard } from '../ScoreBoard';
import { AnimalType } from '../Game';
import { GameMenu } from '../GameMenu';

interface GameHeaderProps {
  level: number;
  animals: AnimalType[];
  currentTime: number;
  totalTime: number;
  gameCompleted: boolean;
  onRestart: () => void;
  isWinter?: boolean;
  onToggleSeason?: () => void;
}

export const GameHeader = ({ 
  level, 
  animals, 
  currentTime, 
  totalTime, 
  gameCompleted,
  onRestart,
  isWinter,
  onToggleSeason 
}: GameHeaderProps) => {
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Level {level}</h2>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md flex items-center gap-1">
          <Hourglass className="w-4 h-4" />
          <span className="font-mono text-lg">
            {formatTime(gameCompleted ? totalTime : currentTime)}
          </span>
        </div>
        <GameMenu 
          onRestart={onRestart}
          isWinter={isWinter}
          onToggleSeason={onToggleSeason}
          isMobile={true}
          className="bg-white p-2 rounded-lg shadow-md md:hidden"
        />
      </div>
      <div className="bg-white p-2 rounded-lg shadow-md w-full">
        <ScoreBoard animals={animals} />
      </div>
    </div>
  );
};