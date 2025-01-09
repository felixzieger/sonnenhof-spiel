import { Menu } from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"
import { SeasonToggle } from './game/SeasonToggle'
import { useSoundEnabled } from '@/hooks/useSoundEnabled'
import { useState } from 'react'
import { HighscoreList } from './game/HighscoreList'

interface GameMenuProps {
  onRestart: () => void;
  isWinter?: boolean;
  onToggleSeason?: () => void;
  isMobile?: boolean;
  className?: string;
}

export const GameMenu = ({ onRestart, isWinter, onToggleSeason, className = '' }: GameMenuProps) => {
  const { isEnabled, setIsEnabled } = useSoundEnabled();
  const [showHighscores, setShowHighscores] = useState(false);
  
  return (
    <div className={className}>
      <Menubar className="border-none bg-transparent h-auto p-0">
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent p-0 h-auto">
            <Menu className="h-[28px] w-[28px]" />
          </MenubarTrigger>
          <MenubarContent align="end" className="bg-white/95 backdrop-blur-sm">
            <MenubarItem onClick={onRestart}>
              <span>🔄 Neu starten</span>
            </MenubarItem>
            {onToggleSeason && (
              <MenubarItem onClick={onToggleSeason}>
                <span>{isWinter ? '☀️ Sommer' : '❄️ Winter'}</span>
              </MenubarItem>
            )}
            <MenubarItem onClick={() => setIsEnabled(!isEnabled)}>
              <span>{isEnabled ? '🔊 Ton aus' : '🔈 Ton an'}</span>
            </MenubarItem>
            <MenubarItem onClick={() => setShowHighscores(true)}>
              <span>🏆 Bestenliste</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <HighscoreList 
        isOpen={showHighscores}
        onClose={() => setShowHighscores(false)}
        onSaveScore={() => {}}
        currentScore={null}
      />
    </div>
  );
};