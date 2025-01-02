import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HighscoreListProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Score {
  name: string;
  time: number;
  date: string;
}

export const HighscoreList = ({ isOpen, onClose }: HighscoreListProps) => {
  const scores: Score[] = JSON.parse(localStorage.getItem("highscores") || "[]");

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>🏆 Bestenliste</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {scores.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Noch keine Einträge in der Bestenliste
            </p>
          ) : (
            <div className="space-y-2">
              {scores.map((score, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{index + 1}.</span>
                    <span>{score.name}</span>
                  </div>
                  <span className="font-mono">{formatTime(score.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};