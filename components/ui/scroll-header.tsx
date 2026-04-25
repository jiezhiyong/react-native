import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageSourcePropType, Platform, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCROLL_HEADER_DEFAULT_THRESHOLD } from '@/hooks/useScrollHeader';

const IOS_BAR = 44;
const ANDROID_BAR = 56;

/** 与导航条行高一致；与 `useScrollHeader` / `ScrollHeader` 中 `headerRowHeight` 保持同步 */
export function getScrollHeaderRowHeight() {
  return Platform.OS === 'ios' ? IOS_BAR : ANDROID_BAR;
}

export interface ScrollHeaderRightButton {
  icon: React.ReactNode;
  onPress: () => void;
}

export interface ScrollHeaderProps {
  title: string;
  scrollY: SharedValue<number>;
  /** 与 useScrollHeader 的 threshold 一致 */
  threshold?: number;
  backgroundImageSource?: ImageSourcePropType;
  rightButtons?: ScrollHeaderRightButton[];
  /** 无背景图时的顶部装饰渐变 */
  gradientColors?: readonly [string, string];
  /**
   * 为 true 时，顶部背景从完全透明随滚动变为纯白；
   * 为 false 时，导航条区域初始即为白色，仅装饰层/标题仍做过渡（适用于不需要穿透效果的页面）
   */
  startTransparent?: boolean;
  className?: string;
}

/**
 * 随滚动在「透明/深色底图 + 浅色字」与「白底 + 黑字」之间平滑过渡的顶部栏。
 * 与 `useScrollHeader` 配合使用，不依赖全局 store。
 */
export function ScrollHeader({
  title,
  scrollY,
  threshold = SCROLL_HEADER_DEFAULT_THRESHOLD,
  backgroundImageSource,
  rightButtons = [],
  gradientColors = ['#c96442', '#d9b9a5'] as const,
  startTransparent = true,
  className,
}: ScrollHeaderProps) {
  const { top: topInset } = useSafeAreaInsets();
  const headerRowHeight = Platform.OS === 'ios' ? IOS_BAR : ANDROID_BAR;
  const totalHeight = topInset + headerRowHeight;
  const { width } = useWindowDimensions();
  const input = [0, Math.max(1, threshold)] as const;

  const solidBarStyle = useAnimatedStyle(() => {
    if (!startTransparent) {
      return { backgroundColor: '#faf9f5' };
    }
    return {
      backgroundColor: interpolateColor(scrollY.value, input, ['rgba(250,249,245,0)', '#faf9f5']),
    };
  }, [startTransparent, threshold]);

  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(scrollY.value, input, [1, 0], Extrapolation.CLAMP),
    }),
    [threshold]
  );

  const titleStyle = useAnimatedStyle(
    () => ({
      color: interpolateColor(scrollY.value, input, ['#faf9f5', '#141413']),
    }),
    [threshold]
  );

  return (
    <View
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        height: totalHeight,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: totalHeight,
            zIndex: 0,
            pointerEvents: 'none',
          },
          solidBarStyle,
        ]}
      />

      <Animated.View
        style={[
          { position: 'absolute', top: 0, left: 0, right: 0, height: totalHeight, zIndex: 0, pointerEvents: 'none' },
          overlayStyle,
        ]}
      >
        {backgroundImageSource ? (
          <Image
            source={backgroundImageSource}
            contentFit="cover"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, width, height: totalHeight }}
            transition={0}
          />
        ) : (
          <LinearGradient
            colors={[gradientColors[0], gradientColors[1]] as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: totalHeight }}
          />
        )}
      </Animated.View>

      <View
        className="flex-row items-center justify-between px-5"
        style={{
          paddingTop: topInset,
          height: totalHeight,
          zIndex: 1,
          position: 'relative',
        }}
      >
        <Animated.Text style={[titleStyle, { fontSize: 20, fontWeight: '600' }]}>{title}</Animated.Text>
        <View className="flex-row">
          {rightButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              className="gap-3 size-10 items-center justify-center"
              onPress={button.onPress}
            >
              {button.icon}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
