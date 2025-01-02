import React from 'react';
import { Button } from './ui/button';

interface LevelMessageProps {
  level: number;
  showControls?: boolean;
  onStart: () => void;
}

export const LevelMessage: React.FC<LevelMessageProps> = ({ level, showControls = false, onStart }) => {
  const messages = {
    1: "Die Katze Lilly hat Schnupfen und muss zum Tierarzt. Fang Lilly ein!",
    2: "Das Stalltor stand offen, die Pferde und Schweine sind ausgebüchst. Fang sie schnell wieder ein!",
    3: "Oh nein, jetzt ist auch noch der Hühnerpförtner kaputt - der Sonnenhof spielt verrückt! Fang alle Tiere wieder ein!"
  };

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        console.log('Enter key pressed in LevelMessage');
        onStart();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [onStart]);

  const handleStartClick = () => {
    console.log('Start button clicked in LevelMessage');
    console.log('onStart function:', onStart);
    onStart();
  };

  return (
    <>
      <p className="mb-4">{messages[level as keyof typeof messages]}</p>
      {showControls && (
        <p className="mb-4">Nutze die Pfeiltasten, um dich auf dem Sonnenhof zu bewegen.</p>
      )}
      <Button onClick={handleStartClick} className="w-full">
        Level starten
      </Button>
    </>
  );
};
