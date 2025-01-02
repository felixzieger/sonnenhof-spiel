import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Snowflake } from 'lucide-react';
import { useWinterMode } from '@/hooks/useWinterMode';

interface SeasonToggleProps {
  className?: string;
}

export const SeasonToggle = ({ className }: SeasonToggleProps) => {
  const { isWinter, setIsWinter } = useWinterMode();

  return (
    <Button
      onClick={() => setIsWinter(!isWinter)}
      variant="outline"
      className={`bg-white hover:bg-gray-100 ${className}`}
    >
      {isWinter ? <Sun className="w-4 h-4" /> : <Snowflake className="w-4 h-4" />}
    </Button>
  );
};