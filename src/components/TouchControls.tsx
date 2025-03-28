import React, { useCallback, useRef } from 'react';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface TouchControlsProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const TouchControls = ({ onMove }: TouchControlsProps) => {
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMovingRef = useRef(false);
  const currentDirectionRef = useRef<'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const isTouchStartRef = useRef(false);

  const startMoving = useCallback((direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => {
    console.log('startMoving called', {
      direction,
      isCurrentlyMoving: isMovingRef.current,
      hasInterval: !!moveIntervalRef.current,
      isTouchStart: isTouchStartRef.current
    });

    // Clear any existing interval first
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    
    // Initial move - always move immediately on first interaction
    if (isTouchStartRef.current) {
      isMovingRef.current = true;
      currentDirectionRef.current = direction;
      lastMoveTimeRef.current = Date.now();
      console.log('Player moving:', direction);
      onMove(direction);
    }

    // Set up interval for continuous movement when holding
    moveIntervalRef.current = setInterval(() => {
      if (isMovingRef.current && currentDirectionRef.current === direction) {
        const currentTime = Date.now();
        if (currentTime - lastMoveTimeRef.current >= 140) {
          lastMoveTimeRef.current = currentTime;
          console.log('Player moving (continuous):', direction);
          onMove(direction);
        }
      }
    }, 140);
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
    isTouchStartRef.current = false;
  }, []);

  const handleStart = (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    console.log('Start event', {
      direction,
      type: e.type,
      targetId: (e.target as HTMLElement).id,
      timestamp: Date.now()
    });
    isTouchStartRef.current = true;
    startMoving(direction);
  };

  const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    console.log('End event', {
      type: e.type,
      targetId: (e.target as HTMLElement).id,
      timestamp: Date.now(),
      currentDirection: currentDirectionRef.current
    });
    stopMoving();
  };

  return (
    <div className="mt-4 w-full max-w-[400px] mx-auto">
      <div className="flex flex-col items-center gap-2">
        <button
          id="up-button"
          className="w-16 h-16 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm rounded-lg active:bg-gray-200/50 touch-none select-none"
          onTouchStart={handleStart('ArrowUp')}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          onMouseDown={handleStart('ArrowUp')}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
        >
          <ArrowBigUp className="w-12 h-12 pointer-events-none" />
        </button>
        <div className="flex gap-2">
          <button
            id="left-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm rounded-lg active:bg-gray-200/50 touch-none select-none"
            onTouchStart={handleStart('ArrowLeft')}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            onMouseDown={handleStart('ArrowLeft')}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
          >
            <ArrowBigLeft className="w-12 h-12 pointer-events-none" />
          </button>
          <button
            id="down-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm rounded-lg active:bg-gray-200/50 touch-none select-none"
            onTouchStart={handleStart('ArrowDown')}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            onMouseDown={handleStart('ArrowDown')}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
          >
            <ArrowBigDown className="w-12 h-12 pointer-events-none" />
          </button>
          <button
            id="right-button"
            className="w-16 h-16 flex items-center justify-center bg-gray-100/50 backdrop-blur-sm rounded-lg active:bg-gray-200/50 touch-none select-none"
            onTouchStart={handleStart('ArrowRight')}
            onTouchEnd={handleEnd}
            onTouchCancel={handleEnd}
            onMouseDown={handleStart('ArrowRight')}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
          >
            <ArrowBigRight className="w-12 h-12 pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
  );
};