import { Menu } from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"

interface GameMenuProps {
  onRestart: () => void;
}

export const GameMenu = ({ onRestart }: GameMenuProps) => {
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
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};