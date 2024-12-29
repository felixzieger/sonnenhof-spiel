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
    <div className="flex gap-4">
      <div>🐱 {getCaughtCount('cat')}/{getTotalCount('cat')}</div>
      <div>🐔 {getCaughtCount('chicken')}/{getTotalCount('chicken')}</div>
      <div>🐷 {getCaughtCount('pig')}/{getTotalCount('pig')}</div>
      <div>🐎 {getCaughtCount('horse')}/{getTotalCount('horse')}</div>
    </div>
  );
};