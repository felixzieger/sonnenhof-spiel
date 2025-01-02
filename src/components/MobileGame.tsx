import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Hourglass } from 'lucide-react';
import { TouchControls } from './TouchControls';
import { GameHeader } from './game/GameHeader';
import { GameBoard } from './game/GameBoard';
import { useGameLogic } from '../hooks/useGameLogic';
import { HighscoreDialog } from './game/HighscoreDialog';
import { HighscoreList } from './game/HighscoreList';

export const MobileGame = () => {
  const {
    currentLevel,
    playerPosition,
    animals,
    obstacles,
    gameCompleted,
    showLevelMessage,
    currentTime,
    totalTime,
    handleMove,
    resetGame,
    startLevel,
  } = useGameLogic();

  const [showHighscoreDialog, setShowHighscoreDialog] = React.useState(false);
  const [showHighscoreList, setShowHighscoreList] = React.useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        console.log('Keyboard event in mobile view:', e.key);
        handleMove(e.key as 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <GameHeader 
        level={currentLevel}
        animals={animals}
        currentTime={currentTime}
        totalTime={totalTime}
        gameCompleted={gameCompleted}
      />
      
      <GameBoard 
        playerPosition={playerPosition}
        animals={animals}
        obstacles={obstacles}
        gridSize={20}
        currentLevel={currentLevel}
        showLevelMessage={showLevelMessage}
        onRestart={resetGame}
        onStart={startLevel}
      />

      <TouchControls onMove={handleMove} />

      <AlertDialog open={gameCompleted}>
        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">Gratulation!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-center">Du hast alle Level geschafft und den Sonnenhof gerettet!</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Hourglass className="w-6 h-6" />
                <span className="font-mono text-2xl font-bold">
                  {formatTime(totalTime)}
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center sm:justify-center gap-2">
            <AlertDialogAction onClick={resetGame} className="w-full sm:w-auto">
              Nochmal spielen
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={() => setShowHighscoreList(true)}
              className="w-full sm:w-auto"
            >
              Bestenliste
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HighscoreDialog
        isOpen={showHighscoreDialog}
        onClose={() => setShowHighscoreDialog(false)}
        time={totalTime}
      />

      <HighscoreList
        isOpen={showHighscoreList}
        onClose={() => setShowHighscoreList(false)}
        onSaveScore={() => setShowHighscoreDialog(true)}
        currentScore={gameCompleted ? totalTime : null}
      />
    </div>
  );
};