import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHighscores } from "@/hooks/useHighscores";

interface HighscoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  time: number;
}

export const HighscoreDialog = ({ isOpen, onClose, time }: HighscoreDialogProps) => {
  const [playerName, setPlayerName] = useState("");
  const { toast } = useToast();
  const { saveHighscore } = useHighscores();

  const handleSubmit = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib deinen Namen ein",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveHighscore({ playerName: playerName.trim(), timeMs: time });
      onClose();
    } catch (error) {
      console.error('Error saving highscore:', error);
    }
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