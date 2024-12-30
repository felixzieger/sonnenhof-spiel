import React, { useCallback, useRef } from 'react';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface TouchControlsProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const TouchControls = ({ onMove }: TouchControlsProps) => {
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMovingRef = useRef(false);
  const currentDirectionRef = useRef<'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | null>(null);

  const startMoving = useCallback((direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    console.log('startMoving called', {
      direction,
      isCurrentlyMoving: isMovingRef.current,
      hasInterval: !!moveIntervalRef.current
    });

    if (moveIntervalRef.current) {
      console.log('Clearing existing interval');
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    
    console.log('Starting movement in direction:', direction);
    isMovingRef.current = true;
    currentDirectionRef.current = direction;
    onMove(direction);

    moveIntervalRef.current = setInterval(() => {
      if (isMovingRef.current && currentDirectionRef.current === direction) {
        onMove(direction);
      }
    }, 150);
  }, [onMove]);

  const stopMoving = useCallback(() => {
    console.log('stopMoving called', {
      isCurrentlyMoving: isMovingRef.current,
      hasInterval: !!moveIntervalRef.current,
      currentDirection: currentDirectionRef.current
    });

    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    isMovingRef.current = false;
    currentDirectionRef.current = null;
  }, []);

  const handleTouchStart = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.TouchEvent) => {
    e.preventDefault();
    console.log('TouchStart event', {
      direction,
      touches: e.touches.length,
      targetId: (e.target as HTMLElement).id,
      timestamp: Date.now()
    });
    startMoving(direction);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    console.log('TouchEnd event', {
      touches: e.touches.length,
      targetId: (e.target as HTMLElement).id,
      timestamp: Date.now(),
      currentDirection: currentDirectionRef.current
    });
    stopMoving();
  };

  return (
    <div className="mt-4 w-full max-w-[400px] mx-auto bg-white/80 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <button
          id="up-button"
          className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none select-none"
          onTouchStart={handleTouchStart('ArrowUp')}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
          <ArrowBigUp className="w-12 h-12 pointer-events-none" />
        </button>
        <div className="flex gap-2">
          <button
            id="left-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none select-none"
            onTouchStart={handleTouchStart('ArrowLeft')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: 'none' }}
          >
            <ArrowBigLeft className="w-12 h-12 pointer-events-none" />
          </button>
          <button
            id="down-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none select-none"
            onTouchStart={handleTouchStart('ArrowDown')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: 'none' }}
          >
            <ArrowBigDown className="w-12 h-12 pointer-events-none" />
          </button>
          <button
            id="right-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg active:bg-gray-200 touch-none select-none"
            onTouchStart={handleTouchStart('ArrowRight')}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: 'none' }}
          >
            <ArrowBigRight className="w-12 h-12 pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};