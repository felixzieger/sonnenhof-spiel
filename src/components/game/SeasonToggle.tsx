import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Snowflake } from 'lucide-react';

interface SeasonToggleProps {
  isWinter: boolean;
  onToggle: () => void;
}

export const SeasonToggle = ({ isWinter, onToggle }: SeasonToggleProps) => {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      className="bg-white hover:bg-gray-100"
    >
      {isWinter ? <Sun className="w-4 h-4" /> : <Snowflake className="w-4 h-4" />}
    </Button>
  );
};