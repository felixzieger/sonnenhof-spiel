import React, { useCallback, useRef } from 'react';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface TouchControlsProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const TouchControls = ({ onMove }: TouchControlsProps) => {
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMovingRef = useRef(false);

  const startMoving = useCallback((direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    if (isMovingRef.current) return;
    
    isMovingRef.current = true;
    onMove(direction);

    moveIntervalRef.current = setInterval(() => {
      onMove(direction);
    }, 200);
  }, [onMove]);

  const stopMoving = useCallback(() => {
    isMovingRef.current = false;
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  }, []);

  const handleTouchStart = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startMoving(direction);
  };

  const handleMouseDown = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.MouseEvent) => {
    // Only handle mouse events if it's not a touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    e.preventDefault();
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