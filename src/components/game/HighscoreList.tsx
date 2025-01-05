import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHighscores } from "@/hooks/useHighscores";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface HighscoreListProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveScore: () => void;
  currentScore: number | null;
}

export const HighscoreList = ({ isOpen, onClose, onSaveScore, currentScore }: HighscoreListProps) => {
  const { highscores, isLoading } = useHighscores();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(highscores.length / itemsPerPage);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const paginatedHighscores = highscores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>🏆 Bestenliste</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : highscores.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Noch keine Einträge in der Bestenliste
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {paginatedHighscores.map((score, index) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {(currentPage - 1) * itemsPerPage + index + 1}.
                      </span>
                      <span>{score.player_name}</span>
                    </div>
                    <span className="font-mono">{formatTime(score.time_ms)}</span>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
        <DialogFooter className="flex gap-2">
          {currentScore && (
            <Button onClick={onSaveScore} className="w-full">
              In Bestenliste eintragen
            </Button>
          )}
          <Button onClick={() => {
            onClose();
            window.location.reload();
          }} variant="outline" className="w-full">
            Neues Spiel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};