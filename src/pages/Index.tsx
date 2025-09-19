
import { Game } from "@/components/Game";
import { Footer } from "@/components/Footer";
import { useWinterMode } from "@/hooks/useWinterMode";

const Index = () => {
  const { isWinter } = useWinterMode();

  return (
    <div className={`min-h-screen p-0 md:p-8 ${isWinter ? 'bg-frosty-blue' : 'bg-game-bg'}`}>
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center mt-4 md:mt-8">
        {isWinter ? '⛄' : '👨‍🌾'} Rette den <a href="https://sonnenhof-zieger.de/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Sonnenhof</a> {isWinter ? '❄️' : '☀️'}
      </h1>
      
      <Game />
      <Footer />
    </div>
  );
};

export default Index;
