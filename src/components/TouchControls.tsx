import React, { useCallback, useRef } from 'react';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface TouchControlsProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const TouchControls = ({ onMove }: TouchControlsProps) => {
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMovingRef = useRef(false);

  const startMoving = useCallback((direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    console.log('startMoving called', {
      direction,
      isCurrentlyMoving: isMovingRef.current,
      hasInterval: !!moveIntervalRef.current
    });

    if (isMovingRef.current) {
      console.log('Movement already in progress, returning');
      return;
    }
    
    console.log('Starting movement in direction:', direction);
    isMovingRef.current = true;
    onMove(direction);

    console.log('Setting up movement interval');
    moveIntervalRef.current = setInterval(() => {
      console.log('Interval triggered - moving in direction:', direction);
      onMove(direction);
    }, 150);
  }, [onMove]);

  const stopMoving = useCallback(() => {
    console.log('stopMoving called', {
      isCurrentlyMoving: isMovingRef.current,
      hasInterval: !!moveIntervalRef.current
    });

    if (moveIntervalRef.current) {
      console.log('Clearing movement interval');
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    isMovingRef.current = false;
  }, []);

  const handleTouchStart = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.TouchEvent) => {
    console.log('TouchStart event', {
      direction,
      touches: e.touches.length,
      targetId: (e.target as HTMLElement).id,
      timestamp: Date.now()
    });
    e.preventDefault();
    startMoving(direction);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    console.log('TouchEnd event', {
      touches: e.touches.length,
      targetId: (e.target as HTMLElement).id,
      timestamp: Date.now()
    });
    e.preventDefault();
    stopMoving();
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    console.log('TouchCancel event', {
      touches: e.touches.length,
      targetId: (e.target as HTMLElement).id,
      timestamp: Date.now()
    });
    e.preventDefault();
    stopMoving();
  };

  const handleMouseDown = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.MouseEvent) => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      console.log('Ignoring mouse event on touch device');
      return;
    }
    console.log('MouseDown event', {
      direction,
      timestamp: Date.now()
    });
    e.preventDefault();
    startMoving(direction);
  };

  return (
    <div className="mt-4 w-full max-w-[400px] mx-auto bg-white/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <button
          id="up-button"
          className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none"
          onTouchStart={handleTouchStart('ArrowUp')}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          onMouseDown={handleMouseDown('ArrowUp')}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
        >
          <ArrowBigUp className="w-12 h-12" />
        </button>
        <div className="flex gap-2">
          <button
            id="left-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none"
            onTouchStart={handleTouchStart('ArrowLeft')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onMouseDown={handleMouseDown('ArrowLeft')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <ArrowBigLeft className="w-12 h-12" />
          </button>
          <button
            id="down-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none"
            onTouchStart={handleTouchStart('ArrowDown')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onMouseDown={handleMouseDown('ArrowDown')}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            <ArrowBigDown className="w-12 h-12" />
          </button>
          <button
            id="right-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none"
            onTouchStart={handleTouchStart('ArrowRight')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
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