import { useFocusEffect } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 与 ScrollHeader 默认一致：在此滚动距离内完成背景/文字颜色过渡 */
export const SCROLL_HEADER_DEFAULT_THRESHOLD = 100;
const DEFAULT_STATUS_BAR_STYLE = 'dark';

function getHeaderRowHeight() {
  return Platform.OS === 'ios' ? 44 : 56;
}

export interface UseScrollHeaderOptions {
  /** 从透明/装饰层过渡为纯白导航条的滚动距离，需与 ScrollHeader 的 `threshold` 一致 */
  threshold?: number;
}

/**
 * 与 ScrollHeader 配合的滚动 + 状态栏/图标深浅切换。
 * 页面将 `scrollHandler` 绑定到 Reanimated 的 `Animated.ScrollView` / 动画列表的 `onScroll`。
 */
export function useScrollHeader(options?: UseScrollHeaderOptions) {
  const { top: topInset } = useSafeAreaInsets();
  const threshold = options?.threshold ?? SCROLL_HEADER_DEFAULT_THRESHOLD;
  const scrollY = useSharedValue(0);
  const wasAbove = useSharedValue(false);
  const headerHeight = topInset + getHeaderRowHeight();

  const lastRef = useRef(false);
  const [isDarkStyle, setIsDarkStyle] = useState(false);

  const onThresholdChange = useCallback((isAbove: boolean) => {
    if (lastRef.current === isAbove) {
      return;
    }
    lastRef.current = isAbove;
    setIsDarkStyle(isAbove);
    // 已滚过阈值：白底、深色字 → 状态栏用深色（图标为深色）
    setStatusBarStyle(isAbove ? 'dark' : 'light');
  }, []);

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        const y = e.contentOffset.y;
        scrollY.value = y;
        const isAbove = y > threshold;
        if (isAbove !== wasAbove.value) {
          wasAbove.value = isAbove;
          runOnJS(onThresholdChange)(isAbove);
        }
      },
    },
    [threshold, onThresholdChange]
  );

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(lastRef.current ? 'dark' : 'light');

      return () => {
        setStatusBarStyle(DEFAULT_STATUS_BAR_STYLE);
      };
    }, [])
  );

  return {
    scrollY,
    scrollHandler,
    isDarkStyle,
    threshold,
    headerHeight,
  };
}
