import React, { useCallback, useRef } from 'react';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface TouchControlsProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const TouchControls = ({ onMove }: TouchControlsProps) => {
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMoving = useCallback((direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    // Clear any existing interval
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }

    // Initial move
    onMove(direction);

    // Set up continuous movement
    moveIntervalRef.current = setInterval(() => {
      onMove(direction);
    }, 150); // Adjust this value to control movement speed
  }, [onMove]);

  const stopMoving = useCallback(() => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, []);

  const handleTouchStart = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    startMoving(direction);
  };

  const handleMouseDown = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default mouse behavior
    startMoving(direction);
  };

  return (
    <div className="mt-4 w-full max-w-[400px] mx-auto bg-white/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <button
          className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
          onTouchStart={handleTouchStart('ArrowUp')}
          onTouchEnd={stopMoving}
          onMouseDown={handleMouseDown('ArrowUp')}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
        >
          <ArrowBigUp className="w-12 h-12" />
        </button>
        <div className="flex gap-2">
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onTouchStart={handleTouchStart('ArrowLeft')}
            onTouchEnd={stopMoving}
            onMouseDown={handleMouseDown('ArrowLeft')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <ArrowBigLeft className="w-12 h-12" />
          </button>
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onTouchStart={handleTouchStart('ArrowDown')}
            onTouchEnd={stopMoving}
            onMouseDown={handleMouseDown('ArrowDown')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <ArrowBigDown className="w-12 h-12" />
          </button>
          <button
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200"
            onTouchStart={handleTouchStart('ArrowRight')}
            onTouchEnd={stopMoving}
            onMouseDown={handleMouseDown('ArrowRight')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <ArrowBigRight className="w-12 h-12" />
          </button>
        </div>
      </div>
    </div>
  );
};