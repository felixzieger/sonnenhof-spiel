
import { Game } from "@/components/Game";
import { Footer } from "@/components/Footer";
import { useWinterMode } from "@/hooks/useWinterMode";
import { useTopHighscores } from "@/hooks/useTopHighscores";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { isWinter } = useWinterMode();
  const { topHighscores, isLoading, error } = useTopHighscores();

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen p-0 md:p-8 ${isWinter ? 'bg-frosty-blue' : 'bg-game-bg'}`}>
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center mt-4 md:mt-8">
        {isWinter ? '⛄' : '👨‍🌾'} Rette den Sonnenhof {isWinter ? '❄️' : '☀️'} 
      </h1>
      
      <div className="max-w-sm mx-auto mb-4">
        <div className="bg-white/90 rounded-lg p-3 shadow-md">
          <h2 className="text-center text-lg font-semibold mb-2">🏆 Top 5 Bestzeiten</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-sm text-red-500">{error}</p>
          ) : topHighscores.length === 0 ? (
            <p className="text-center text-sm text-gray-500">Noch keine Bestzeiten vorhanden</p>
          ) : (
            <div className="space-y-1">
              {topHighscores.map((score) => (
                <div key={score.id} className="flex justify-between text-sm">
                  <span className="font-medium">
                    {score.rank}. {score.player_name}
                  </span>
                  <span className="font-mono">{formatTime(score.time_ms)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Game />
      <Footer />
    </div>
  );
};

export default Index;
