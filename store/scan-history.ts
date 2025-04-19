import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ScanHistoryItem {
  id: string;
  content: string;
  timestamp: number;
  isUrl: boolean;
}

interface ScanHistoryState {
  history: ScanHistoryItem[];
  addHistory: (content: string, isUrl: boolean) => void;
  removeHistory: (id: string) => void;
  removeMultipleHistory: (ids: string[]) => void;
  clearHistory: () => void;
}

// 创建扫描历史记录存储
export const useScanHistoryStore = create<ScanHistoryState>()(
  persist(
    (set) => ({
      history: [],

      // 添加新的扫描记录
      addHistory: (content, isUrl) => {
        const newItem: ScanHistoryItem = {
          id: Date.now().toString(),
          content,
          timestamp: Date.now(),
          isUrl,
        };

        set((state) => ({
          history: [newItem, ...state.history],
        }));
      },

      // 删除单个历史记录
      removeHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }));
      },

      // 删除多个历史记录
      removeMultipleHistory: (ids) => {
        set((state) => ({
          history: state.history.filter((item) => !ids.includes(item.id)),
        }));
      },

      // 清空所有历史记录
      clearHistory: () => {
        set({ history: [] });
      },
    }),
    {
      name: 'scan-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
