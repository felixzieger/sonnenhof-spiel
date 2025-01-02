import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HighscoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  time: number;
}

export const HighscoreDialog = ({ isOpen, onClose, time }: HighscoreDialogProps) => {
  const [playerName, setPlayerName] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!playerName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib deinen Namen ein",
        variant: "destructive",
      });
      return;
    }

    // Bestehende Highscores aus dem localStorage holen
    const existingScores = JSON.parse(localStorage.getItem("highscores") || "[]");
    
    // Neuen Score hinzufügen
    const newScore = {
      name: playerName,
      time: time,
      date: new Date().toISOString(),
    };
    
    // Scores sortieren (niedrigste Zeit zuerst)
    const updatedScores = [...existingScores, newScore]
      .sort((a, b) => a.time - b.time)
      .slice(0, 10); // Nur die besten 10 behalten
    
    // Im localStorage speichern
    localStorage.setItem("highscores", JSON.stringify(updatedScores));
    
    toast({
      title: "Erfolgreich gespeichert!",
      description: "Deine Zeit wurde in der Bestenliste gespeichert.",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bestenliste</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Dein Name</Label>
            <Input
              id="name"
              placeholder="Name eingeben..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};