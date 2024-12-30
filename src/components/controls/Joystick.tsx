import React, { useState } from 'react';
import { useDrag } from '@use-gesture/react';

interface JoystickProps {
  onMove: (direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight') => void;
}

export const Joystick = ({ onMove }: JoystickProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const bind = useDrag(({ movement: [x, y], down }) => {
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

    // Determine direction based on position
    const threshold = 20;
    if (Math.abs(newX) > Math.abs(newY)) {
      if (newX > threshold) onMove('ArrowRight');
      else if (newX < -threshold) onMove('ArrowLeft');
    } else {
      if (newY > threshold) onMove('ArrowDown');
      else if (newY < -threshold) onMove('ArrowUp');
    }
  });

  return (
    <div className="relative w-32 h-32 bg-white/80 rounded-full backdrop-blur-sm shadow-lg">
      <div 
        {...bind()}
        className="absolute cursor-grab active:cursor-grabbing bg-blue-600 w-16 h-16 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg border-2 border-white"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
        }}
      />
    </div>
  );
};