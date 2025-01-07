import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundEnabled } from '@/hooks/useSoundEnabled';

interface SoundToggleProps {
  className?: string;
}

export const SoundToggle = ({ className }: SoundToggleProps) => {
  const { isEnabled, setIsEnabled } = useSoundEnabled();

  return (
    <Button
      onClick={() => setIsEnabled(!isEnabled)}
      variant="outline"
      className={`bg-white hover:bg-gray-100 ${className}`}
    >
      {isEnabled ? '🔊' : '🔈'}
    </Button>
  );
};