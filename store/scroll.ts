import { StatusBarStyle } from 'expo-status-bar';
import { Animated } from 'react-native';
import { create } from 'zustand';

interface ScrollState {
  // 动画值
  homeScrollY: Animated.Value;
  mineScrollY: Animated.Value;
  discoverScrollY: Animated.Value;

  // 当前值（用于组件渲染）
  homeScrollValue: number;
  mineScrollValue: number;
  discoverScrollValue: number;

  // 更新方法
  updateHomeScroll: (value: number) => void;
  updateMineScroll: (value: number) => void;
  updateDiscoverScroll: (value: number) => void;

  // 状态栏样式
  statusBarStyle: StatusBarStyle;
  setStatusBarStyle: (style: StatusBarStyle) => void;

  // 当前激活的tab
  activeTab: 'home' | 'mine' | 'discover';
  setActiveTab: (tab: 'home' | 'mine' | 'discover') => void;
}

export const useTabsScrollStore = create<ScrollState>((set) => ({
  // 初始化动画值
  homeScrollY: new Animated.Value(0),
  mineScrollY: new Animated.Value(0),
  discoverScrollY: new Animated.Value(0),

  // 初始化数值
  homeScrollValue: 0,
  mineScrollValue: 0,
  discoverScrollValue: 0,

  // 更新方法
  updateHomeScroll: (value) => set({ homeScrollValue: value }),
  updateMineScroll: (value) => set({ mineScrollValue: value }),
  updateDiscoverScroll: (value) => set({ discoverScrollValue: value }),

  // 状态栏默认为light
  statusBarStyle: 'light',
  setStatusBarStyle: (style) => set({ statusBarStyle: style }),

  // 默认激活tab为home
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
