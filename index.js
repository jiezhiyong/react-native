/* eslint-disable import/first */
import { LogBox } from 'react-native';

/**
 * FormatJS polyfills
 * typesafe-i18n 渲染时会调用 new Intl.PluralRules(locale)，iOS simulator 的运行时缺少对应 Intl 能力时就会在 <TypesafeI18n> 处崩掉
 */
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/zh';

/**
 * 主要用于 React Native LogBox UI
 * 不适合屏蔽 React Native Web 直接输出到浏览器 console 的 warning。
 */
LogBox.ignoreLogs(['']);

// 注册 Expo Router 入口
import 'expo-router/entry';
