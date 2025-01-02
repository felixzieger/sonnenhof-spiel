import { create } from 'zustand';

interface SoundState {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

export const useSoundEnabled = create<SoundState>((set) => ({
  isEnabled: true,
  setIsEnabled: (enabled) => set({ isEnabled: enabled }),
}));