import { Menu, Award } from "lucide-react"
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
import { useNavigate } from 'react-router-dom'

interface GameMenuProps {
  onRestart: () => void;
  isWinter?: boolean;
  onToggleSeason?: () => void;
  isMobile?: boolean;
  className?: string;
}

export const GameMenu = ({ onRestart, isWinter, onToggleSeason, className = '' }: GameMenuProps) => {
  const { isEnabled, setIsEnabled } = useSoundEnabled();
  const navigate = useNavigate();
  
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
            <MenubarItem onClick={() => navigate('/leaderboard')}>
              <Award className="mr-2" />
              <span>Bestenliste</span>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};