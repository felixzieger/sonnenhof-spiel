import React from 'react';
import { AnimalType } from './Game';

interface ScoreBoardProps {
  animals: AnimalType[];
}

export const ScoreBoard = ({ animals }: ScoreBoardProps) => {
  const getCaughtCount = (type: AnimalType['type']) => {
    return animals.filter(a => a.type === type && a.caught).length;
  };

  const getTotalCount = (type: AnimalType['type']) => {
    return animals.filter(a => a.type === type).length;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Gefangene Tiere:</h2>
      <div className="flex gap-4">
        <div>Katzen: {getCaughtCount('cat')}/{getTotalCount('cat')}</div>
        <div>Hühner: {getCaughtCount('chicken')}/{getTotalCount('chicken')}</div>
        <div>Schweine: {getCaughtCount('pig')}/{getTotalCount('pig')}</div>
        <div>Pferde: {getCaughtCount('horse')}/{getTotalCount('horse')}</div>
      </div>
    </div>
  );
};