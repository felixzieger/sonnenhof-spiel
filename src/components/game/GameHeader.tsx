import { Hourglass } from 'lucide-react';
import { ScoreBoard } from '../ScoreBoard';
import { AnimalType } from '../Game';

interface GameHeaderProps {
  level: number;
  animals: AnimalType[];
  currentTime: number;
  totalTime: number;
  gameCompleted: boolean;
}

export const GameHeader = ({ level, animals, currentTime, totalTime, gameCompleted }: GameHeaderProps) => {
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-2">
      <div className="bg-white p-2 rounded-lg shadow-md">
        <h2 className="text-lg font-bold">Level {level}</h2>
      </div>
      <div className="bg-white p-2 rounded-lg shadow-md flex items-center gap-1">
        <Hourglass className="w-4 h-4" />
        <span className="font-mono text-lg">
          {formatTime(gameCompleted ? totalTime : currentTime)}
        </span>
      </div>
      <div className="bg-white p-2 rounded-lg shadow-md">
        <ScoreBoard animals={animals} />
      </div>
    </div>
  );
};