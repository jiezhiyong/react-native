import AsyncStorage from '@react-native-async-storage/async-storage';

import type { DebugApiEnv, DebugSettings } from './types';

export const DEBUG_SETTINGS_STORAGE_KEY = '@debug-panel/settings';

export const DEFAULT_DEBUG_SETTINGS: DebugSettings = {
  apiEnv: 'prod',
  requestEncryptionEnabled: false,
  abFlags: {},
  featureFlags: {},
};

function isDebugSettings(value: unknown): value is Partial<DebugSettings> {
  return Boolean(value && typeof value === 'object');
}

function isDebugApiEnv(value: string | null): value is DebugApiEnv {
  return value === 'inte' || value === 'rc' || value === 'prod';
}

async function readLegacyDebugSettings(): Promise<DebugSettings> {
  const [apiEnv, requestEncryption] = await Promise.all([
    AsyncStorage.getItem('env'),
    AsyncStorage.getItem('requestEncryption'),
  ]);

  return {
    ...DEFAULT_DEBUG_SETTINGS,
    apiEnv: isDebugApiEnv(apiEnv) ? apiEnv : DEFAULT_DEBUG_SETTINGS.apiEnv,
    requestEncryptionEnabled: requestEncryption === 'enabled',
  };
}

export async function readDebugSettingsFromStorage(): Promise<DebugSettings> {
  const raw = await AsyncStorage.getItem(DEBUG_SETTINGS_STORAGE_KEY);

  if (!raw) {
    return readLegacyDebugSettings();
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!isDebugSettings(parsed)) {
      return DEFAULT_DEBUG_SETTINGS;
    }

    return {
      ...DEFAULT_DEBUG_SETTINGS,
      ...parsed,
      abFlags: parsed.abFlags ?? DEFAULT_DEBUG_SETTINGS.abFlags,
      featureFlags: parsed.featureFlags ?? DEFAULT_DEBUG_SETTINGS.featureFlags,
    };
  } catch {
    return DEFAULT_DEBUG_SETTINGS;
  }
}

export async function writeDebugSettingsToStorage(settings: DebugSettings): Promise<void> {
  await AsyncStorage.setItem(DEBUG_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
