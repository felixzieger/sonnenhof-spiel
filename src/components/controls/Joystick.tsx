import React, { useState, useRef } from 'react';
import { useDrag } from '@use-gesture/react';

interface JoystickProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const Joystick = ({ onMove }: JoystickProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMoveTime = useRef(0);
  const moveDelay = 200; // 200ms delay between moves
  
  const bind = useDrag(({ movement: [x, y], down, event }) => {
    // Prevent default behavior for touch events
    if (event instanceof TouchEvent) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!down) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    // Limit the joystick movement to a circle
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = 50;
    const scale = distance > maxDistance ? maxDistance / distance : 1;

    const newX = x * scale;
    const newY = y * scale;
    
    setPosition({ x: newX, y: newY });

    // Check if enough time has passed since last move
    const currentTime = Date.now();
    if (currentTime - lastMoveTime.current < moveDelay) {
      return;
    }

    // Determine direction based on position
    const threshold = 20;
    if (Math.abs(newX) > Math.abs(newY)) {
      if (newX > threshold) onMove('ArrowRight');
      else if (newX < -threshold) onMove('ArrowLeft');
    } else {
      if (newY > threshold) onMove('ArrowDown');
      else if (newY < -threshold) onMove('ArrowUp');
    }

    lastMoveTime.current = currentTime;
  }, {
    pointer: { touch: true },
    preventDefault: true,
    filterTaps: true,
    bounds: { left: -50, right: 50, top: -50, bottom: 50 },
    // Add these options for better touch handling
    eventOptions: { 
      passive: false,
      capture: true
    },
  });

  return (
    <div 
      className="relative w-32 h-32 bg-white/80 rounded-full backdrop-blur-sm shadow-lg touch-none select-none"
      onTouchStart={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div 
        {...bind()}
        className="absolute cursor-grab active:cursor-grabbing bg-blue-600 w-16 h-16 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white touch-none select-none"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
      />
    </div>
  );
};