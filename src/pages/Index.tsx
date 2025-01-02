import { Game } from "@/components/Game";
import { useWinterMode } from "@/hooks/useWinterMode";

const Index = () => {
  const { isWinter } = useWinterMode();

  return (
    <div className={`min-h-screen p-2 sm:p-8 ${isWinter ? 'bg-frosty-blue' : 'bg-game-bg'}`}>
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">
        {isWinter ? '⛄' : '👨‍🌾'} Rette den Sonnenhof
      </h1>
      <Game />
    </div>
  );
};

export default Index;