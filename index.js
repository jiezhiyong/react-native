/* eslint-disable import/first */
import { LogBox } from 'react-native';

/**
 * 主要用于 React Native LogBox UI
 * 不适合屏蔽 React Native Web 直接输出到浏览器 console 的 warning。
 */
LogBox.ignoreLogs(['']);

// 注册 Expo Router 入口
import 'expo-router/entry';
