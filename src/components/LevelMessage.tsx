import React from 'react';
import { ArrowBigUp, ArrowBigDown, ArrowBigLeft, ArrowBigRight } from 'lucide-react';

interface LevelMessageProps {
  level: number;
  showControls?: boolean;
}

export const LevelMessage: React.FC<LevelMessageProps> = ({ level, showControls = false }) => {
  const messages = {
    1: "Lilly hat Schnupfen und muss zum Tierarzt. Fang Lilly ein!",
    2: "Das Stalltor stand offen, Pferde und Schweine sind ausgebüchst. Fang sie schnell wieder ein!",
    3: "Oh nein, jetzt ist auch noch der Hühnerpförtner kaputt - der Sonnenhof spielt verrückt! Fang alle Tiere wieder ein!"
  };

  return (
    <>
      {messages[level as keyof typeof messages]}
      {showControls && (
        <div className="mt-4 flex flex-col items-center">
          <p>Nutze die Pfeiltasten, um dich auf dem Sonnenhof zu bewegen.</p>
          <div className="mt-2">
            {/* Erste Reihe - Hoch */}
            <div className="flex justify-center mb-1">
              <ArrowBigUp className="w-8 h-8 p-1 border rounded bg-gray-100" />
            </div>
            {/* Zweite Reihe - Links, Runter, Rechts */}
            <div className="flex justify-center gap-1">
              <ArrowBigLeft className="w-8 h-8 p-1 border rounded bg-gray-100" />
              <ArrowBigDown className="w-8 h-8 p-1 border rounded bg-gray-100" />
              <ArrowBigRight className="w-8 h-8 p-1 border rounded bg-gray-100" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};