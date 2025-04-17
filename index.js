/* eslint-disable import/first */
import { LogBox } from 'react-native';

// TODO: 忽略特定警告 (未生效)
LogBox.ignoreLogs(['props.pointerEvents is deprecated. Use style.pointerEvents']);

// 注册 Expo Router 入口
import 'expo-router/entry';
