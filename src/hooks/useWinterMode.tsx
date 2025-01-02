import { create } from 'zustand';

interface WinterModeStore {
  isWinter: boolean;
  setIsWinter: (isWinter: boolean) => void;
}

export const useWinterMode = create<WinterModeStore>((set) => ({
  isWinter: false,
  setIsWinter: (isWinter) => set({ isWinter }),
}));