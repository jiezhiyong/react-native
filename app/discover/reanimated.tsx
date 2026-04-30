import { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const { width } = Dimensions.get('window');

export default function ReanimatedScreen() {
  const [isAnimating, setIsAnimating] = useState(false);

  // 基本动画
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const position = useSharedValue(0);

  // 手势动画
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }, { translateX: position.value }],
    };
  });

  const gestureStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  const startBasicAnimation = () => {
    setIsAnimating(true);
    scale.value = withSequence(withSpring(1.5, { damping: 2 }), withSpring(1, { damping: 2 }));
    rotation.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1, false);
    position.value = withRepeat(
      withSequence(withTiming(width - 100, { duration: 1000 }), withTiming(0, { duration: 1000 })),
      -1,
      true
    );
  };

  const stopBasicAnimation = () => {
    setIsAnimating(false);
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
    position.value = withSpring(0);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">高级动画</Text>
        <Text className="text-muted-foreground">使用 Reanimated 创建流畅的高性能动画效果。</Text>
      </View>

      {/* 基本动画 */}
      <Text className="text-lg font-medium mb-2">基本动画</Text>
      <View className="flex gap-3 mb-6">
        <Animated.View className="w-20 h-20 bg-blue-500 rounded-lg" style={animatedStyle} />
        <Button
          onPress={isAnimating ? stopBasicAnimation : startBasicAnimation}
          variant={isAnimating ? 'destructive' : 'default'}
        >
          <Text className="text-white ml-2">{isAnimating ? '停止动画' : '开始动画'}</Text>
        </Button>
      </View>

      {/* 手势动画 */}
      <Text className="text-lg font-medium">手势动画</Text>
      <Text className="text-muted-foreground mb-2">尝试拖动方块，松开后会回到原位</Text>
      <View className="flex gap-3">
        <GestureDetector gesture={gesture}>
          <Animated.View className="w-20 h-20 bg-green-500 rounded-lg" style={gestureStyle} />
        </GestureDetector>
      </View>
    </View>
  );
}
