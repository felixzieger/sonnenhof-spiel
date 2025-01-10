import { Game } from "@/components/Game";
import { Footer } from "@/components/Footer";
import { useWinterMode } from "@/hooks/useWinterMode";

const Index = () => {
  const { isWinter } = useWinterMode();

  return (
    <div className={`h-screen w-full p-0 md:p-8 ${isWinter ? 'bg-frosty-blue' : 'bg-game-bg'}`}>
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 mt-4 md:mt-8 text-center">
        {isWinter ? '⛄' : '👨‍🌾'} Rette den Sonnenhof {isWinter ? '❄️' : '☀️'} 
      </h1>
      <Game />
      <Footer />
    </div>
  );
};

export default Index;