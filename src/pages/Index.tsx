import { Game } from "@/components/Game";

const Index = () => {
  return (
    <div className="min-h-screen bg-game-bg p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">👨‍🌾 Sonnenhof Spiel</h1>
      <Game />
    </div>
  );
};

export default Index;