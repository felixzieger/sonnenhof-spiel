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
  className?: string;
}

export const GameMenu = ({ onRestart, isWinter, onToggleSeason, isMobile = false, className = '' }: GameMenuProps) => {
  const { isEnabled, setIsEnabled } = useSoundEnabled();
  
  if (!isMobile) return null;

  return (
    <div className={className}>
      <Menubar className="border-none bg-transparent">
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-transparent data-[state=open]:bg-transparent p-0">
            <Menu className="h-5 w-5" />
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
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};