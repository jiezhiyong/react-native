export type DebugApiEnv = 'inte' | 'rc' | 'prod';

export type DebugFlagEffect = 'reload' | 'runtime';

export type DebugFlagValue = boolean | string | number;

export interface DebugFlag {
  value: DebugFlagValue;
  effect: DebugFlagEffect;
}

export interface DebugSettings {
  apiEnv: DebugApiEnv;
  requestEncryptionEnabled: boolean;
  abFlags: Record<string, DebugFlag>;
  featureFlags: Record<string, DebugFlag>;
}
