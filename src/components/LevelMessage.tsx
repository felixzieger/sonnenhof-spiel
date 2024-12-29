import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface LevelMessageProps {
  level: number;
  showControls?: boolean;
}

export const LevelMessage: React.FC<LevelMessageProps> = ({ level, showControls = false }) => {
  const messages = {
    1: "Die Katze hat Schnupfen und muss zum Tierarzt. Fang die Katze ein!",
    2: "Das Stalltor stand offen, Pferde und Schweine sind ausgebüchst. Fang sie schnell wieder ein!",
    3: "Oh nein, jetzt ist auch noch der Hühnerpförtner kaputt - der Bauernhof spielt verrückt! Fang alle Tiere wieder ein!"
  };

  return (
    <>
      Level {level}: {messages[level as keyof typeof messages]}
      {showControls && (
        <div className="mt-4 flex flex-col items-center">
          <p>Nutze die Pfeiltasten, um dich auf dem Bauernhof zu bewegen:</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div></div>
            <ArrowUp className="w-6 h-6" />
            <div></div>
            <ArrowLeft className="w-6 h-6" />
            <div></div>
            <ArrowRight className="w-6 h-6" />
            <div></div>
            <ArrowDown className="w-6 h-6" />
            <div></div>
          </div>
        </div>
      )}
    </>
  );
};