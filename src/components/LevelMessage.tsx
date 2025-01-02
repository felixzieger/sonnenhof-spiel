import React from 'react';

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
        <div className="mt-4">
          <p>Nutze die Pfeiltasten, um dich auf dem Sonnenhof zu bewegen.</p>
        </div>
      )}
    </>
  );
};