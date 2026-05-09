import { DEBUG_SETTINGS_STORAGE_KEY } from '@/lib/debug-settings';

export type DebugStorageScopeId = 'business-cache' | 'auth' | 'all';

export interface DebugStorageScope {
  id: DebugStorageScopeId;
  label: string;
  description: string;
  requiresConfirm: boolean;
  secureStorageKeys?: string[];
  matchKey: (key: string) => boolean;
}

const BUSINESS_CACHE_KEYS = ['scan-history-storage', 'locale-storage'];
const AUTH_KEYS = ['auth-storage'];

export const DEBUG_STORAGE_SCOPES: DebugStorageScope[] = [
  {
    id: 'business-cache',
    label: '清除业务缓存',
    description: '删除本地业务缓存，不删除登录态和 Debug Settings',
    requiresConfirm: false,
    matchKey: (key) => BUSINESS_CACHE_KEYS.includes(key),
  },
  {
    id: 'auth',
    label: '清除登录态',
    description: '删除登录态相关存储',
    requiresConfirm: true,
    secureStorageKeys: AUTH_KEYS,
    matchKey: (key) => AUTH_KEYS.includes(key),
  },
  {
    id: 'all',
    label: '清除全部',
    description: '删除 AsyncStorage 中所有 key，包含 Debug Settings，并清除登录态',
    requiresConfirm: true,
    secureStorageKeys: AUTH_KEYS,
    matchKey: () => true,
  },
];

export function isDebugSettingsKey(key: string) {
  return key === DEBUG_SETTINGS_STORAGE_KEY;
}
