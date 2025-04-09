import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// 自定义存储适配器，支持 Web 和原生平台
export const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        const value = localStorage.getItem(name);
        return value;
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
        localStorage.setItem(name, value);
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
        localStorage.removeItem(name);
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
