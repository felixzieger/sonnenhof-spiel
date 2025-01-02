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

interface GameMenuProps {
  onRestart: () => void;
  isWinter?: boolean;
  onToggleSeason?: () => void;
  isMobile?: boolean;
}

export const GameMenu = ({ onRestart, isWinter, onToggleSeason, isMobile = false }: GameMenuProps) => {
  const { isEnabled, setIsEnabled } = useSoundEnabled();
  
  if (!isMobile) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Menubar className="border-none bg-transparent">
        <MenubarMenu>
          <MenubarTrigger className="bg-white/80 backdrop-blur-sm data-[state=open]:bg-white">
            <Menu className="h-4 w-4" />
          </MenubarTrigger>
          <MenubarContent align="end" className="bg-white/80 backdrop-blur-sm">
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
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};