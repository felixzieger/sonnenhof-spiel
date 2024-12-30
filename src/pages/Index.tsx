import { Game } from "@/components/Game";

const Index = () => {
  return (
    <div className="min-h-screen bg-game-bg p-2 sm:p-8">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center">👨‍🌾 Sonnenhof Spiel</h1>
      <Game />
    </div>
  );
};

export default Index;