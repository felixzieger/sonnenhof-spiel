import React from 'react';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface TouchControlsProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const TouchControls = ({ onMove }: TouchControlsProps) => {
  return (
    <div className="mt-4 w-full max-w-[400px] mx-auto bg-white/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <button
          className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
          onClick={() => onMove('ArrowUp')}
        >
          <ArrowBigUp className="w-12 h-12" />
        </button>
        <div className="flex gap-2">
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onClick={() => onMove('ArrowLeft')}
          >
            <ArrowBigLeft className="w-12 h-12" />
          </button>
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onClick={() => onMove('ArrowDown')}
          >
            <ArrowBigDown className="w-12 h-12" />
          </button>
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onClick={() => onMove('ArrowRight')}
          >
            <ArrowBigRight className="w-12 h-12" />
          </button>
        </div>
      </div>
    </div>
  );
};