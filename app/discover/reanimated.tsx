import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">动画示例</Text>
        <Text className="text-gray-600 mb-4">此功能展示了 React Native Reanimated 的各种动画效果。</Text>
      </View>

      <View className="space-y-8">
        {/* 基本动画 */}
        <View className="space-y-4">
          <Text className="text-base font-semibold">基本动画</Text>
          <Animated.View className="w-20 h-20 bg-blue-500 rounded-lg" style={animatedStyle} />
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-lg p-3 flex-row items-center justify-center"
              onPress={isAnimating ? stopBasicAnimation : startBasicAnimation}
            >
              <Ionicons name={isAnimating ? 'stop' : 'play'} size={20} color="white" />
              <Text className="text-white ml-2">{isAnimating ? '停止动画' : '开始动画'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 手势动画 */}
        <View className="space-y-4">
          <Text className="text-base font-semibold">手势动画</Text>
          <GestureDetector gesture={gesture}>
            <Animated.View className="w-20 h-20 bg-green-500 rounded-lg" style={gestureStyle} />
          </GestureDetector>
          <Text className="text-sm text-gray-500">尝试拖动方块，松开后会回到原位</Text>
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 基本动画包括缩放、旋转和平移
          {'\n'}2. 手势动画支持拖拽操作
          {'\n'}3. 所有动画都使用原生线程运行
        </Text>
      </View>
    </ScrollView>
  );
}
