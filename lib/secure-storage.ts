import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// 检查是否在浏览器环境中
const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// 自定义存储适配器，支持 Web 和原生平台
export const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        // 检查是否在浏览器环境
        if (isBrowser()) {
          const value = localStorage.getItem(name);
          return value;
        }
        return null; // 在服务器端渲染环境中返回 null
      } catch (e) {
        console.error('本地存储不可用:', e);
        return null;
      }
    } else {
      try {
        return await SecureStore.getItemAsync(name);
      } catch (e) {
        console.error('安全存储不可用:', e);
        return null;
      }
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        // 检查是否在浏览器环境
        if (isBrowser()) {
          localStorage.setItem(name, value);
        }
      } catch (e) {
        console.error('本地存储不可用:', e);
      }
    } else {
      try {
        await SecureStore.setItemAsync(name, value);
      } catch (e) {
        console.error('安全存储不可用:', e);
      }
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        // 检查是否在浏览器环境
        if (isBrowser()) {
          localStorage.removeItem(name);
        }
      } catch (e) {
        console.error('本地存储不可用:', e);
      }
    } else {
      try {
        await SecureStore.deleteItemAsync(name);
      } catch (e) {
        console.error('安全存储不可用:', e);
      }
    }
  },
};
