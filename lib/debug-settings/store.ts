import Constants from 'expo-constants';
import { create } from 'zustand';

import { DEFAULT_DEBUG_SETTINGS, readDebugSettingsFromStorage, writeDebugSettingsToStorage } from './storage';
import type { DebugSettings } from './types';

type DebugSettingsState = {
  settings: DebugSettings;
  hasHydrated: boolean;
  hydrate: () => Promise<void>;
  updateSettings: (updater: (settings: DebugSettings) => DebugSettings) => Promise<DebugSettings>;
};

function isDebugSettingsEnabled() {
  const extra = Constants.expoConfig?.extra as { appVariant?: string } | undefined;
  return __DEV__ || extra?.appVariant === 'development' || extra?.appVariant === 'preview';
}

export const useDebugSettingsStore = create<DebugSettingsState>((set, get) => ({
  settings: DEFAULT_DEBUG_SETTINGS,
  hasHydrated: false,
  hydrate: async () => {
    if (!isDebugSettingsEnabled()) {
      set({ settings: DEFAULT_DEBUG_SETTINGS, hasHydrated: true });
      return;
    }

    const settings = await readDebugSettingsFromStorage();
    set({ settings, hasHydrated: true });
  },
  updateSettings: async (updater) => {
    const nextSettings = updater(get().settings);

    if (isDebugSettingsEnabled()) {
      await writeDebugSettingsToStorage(nextSettings);
    }

    set({ settings: isDebugSettingsEnabled() ? nextSettings : DEFAULT_DEBUG_SETTINGS });
    return nextSettings;
  },
}));

export async function getDebugSettings(): Promise<DebugSettings> {
  if (!isDebugSettingsEnabled()) {
    return DEFAULT_DEBUG_SETTINGS;
  }

  return readDebugSettingsFromStorage();
}

export async function getRequestEncryptionEnabled(): Promise<boolean> {
  const settings = await getDebugSettings();
  return settings.requestEncryptionEnabled;
}

export async function getDebugApiEnv() {
  const settings = await getDebugSettings();
  return settings.apiEnv;
}
