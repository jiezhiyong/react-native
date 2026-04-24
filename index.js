/* eslint-disable import/first */
import { LogBox } from 'react-native';

// react-native-web：Tailwind/NativeWind 的 shadow-* 在部分路径仍会映射为 shadow* 样式属性
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated. Use style.pointerEvents',
  'shadow* style props are deprecated. Use "boxShadow"',
]);

// 注册 Expo Router 入口
import 'expo-router/entry';
