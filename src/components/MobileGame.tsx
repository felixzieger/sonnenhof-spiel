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
  } = useGameLogic();

  // Add keyboard support
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
      />

      <TouchControls onMove={handleMove} />

      <AlertDialog open={gameCompleted}>
        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-4 w-[90%] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Gratulation!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Du hast alle Level geschafft und den Sonnenhof gerettet!</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Hourglass className="w-6 h-6" />
                <span className="font-mono text-2xl font-bold">
                  {formatTime(totalTime)}
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetGame}>
              Nochmal spielen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};