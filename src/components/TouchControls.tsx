import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface TouchControlsProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const TouchControls = ({ onMove }: TouchControlsProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <button
          className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
          onClick={() => onMove('ArrowUp')}
        >
          <ArrowUp className="w-8 h-8" />
        </button>
        <div className="flex gap-2">
          <button
            className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onClick={() => onMove('ArrowLeft')}
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <button
            className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onClick={() => onMove('ArrowDown')}
          >
            <ArrowDown className="w-8 h-8" />
          </button>
          <button
            className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onClick={() => onMove('ArrowRight')}
          >
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};