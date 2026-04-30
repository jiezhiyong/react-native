import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Locales } from '@/i18n/i18n-types';
import { isLocale } from '@/i18n/i18n-util';

interface LocaleState {
  locale: Locales;
  setLocale: (locale: Locales) => void;
  toggleLocale: () => void;
}

export const DEFAULT_LOCALE: Locales = 'zh';

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale: isLocale(locale) ? locale : DEFAULT_LOCALE }),
      toggleLocale: () => set({ locale: get().locale === 'en' ? 'zh' : 'en' }),
    }),
    {
      name: 'locale-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ locale: state.locale }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<LocaleState> | undefined;
        return {
          ...currentState,
          locale: persisted?.locale && isLocale(persisted.locale) ? persisted.locale : DEFAULT_LOCALE,
        };
      },
    }
  )
);

export function useCurrentLocale() {
  return useLocaleStore((state) => state.locale);
}
