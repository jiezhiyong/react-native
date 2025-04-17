import { create } from 'zustand';

interface DebugPanelStore {
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  toggleVisible: () => void;
}

export const useDebugPanelStore = create<DebugPanelStore>((set) => ({
  isVisible: false,
  setVisible: (visible) => set({ isVisible: visible }),
  toggleVisible: () => set((state) => ({ isVisible: !state.isVisible })),
}));
