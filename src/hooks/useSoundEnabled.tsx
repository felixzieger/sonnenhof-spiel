import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SoundState {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

export const useSoundEnabled = create<SoundState>()(
  persist(
    (set) => ({
      isEnabled: true,
      setIsEnabled: (enabled) => set({ isEnabled: enabled }),
    }),
    {
      name: 'sound-settings',
    }
  )
);