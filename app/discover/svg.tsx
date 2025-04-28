import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function ExpoSvgScreen() {
  const [isAnimating, setIsAnimating] = useState(false);
  const circleRadius = useSharedValue(30);
  const rectWidth = useSharedValue(100);
  const pathScale = useSharedValue(1);

  // 动画属性
  const animatedCircleProps = useAnimatedProps(() => ({
    r: circleRadius.value,
  }));

  const animatedRectProps = useAnimatedProps(() => ({
    width: rectWidth.value,
  }));

  const animatedPathProps = useAnimatedProps(() => ({
    transform: [{ scale: pathScale.value }],
  }));

  // 开始动画
  const startAnimation = () => {
    setIsAnimating(true);
    circleRadius.value = withSpring(50, { damping: 10 });
    rectWidth.value = withSpring(150, { damping: 10 });
    pathScale.value = withSpring(1.2, { damping: 10 });
  };

  // 重置动画
  const resetAnimation = () => {
    setIsAnimating(false);
    circleRadius.value = withTiming(30);
    rectWidth.value = withTiming(100);
    pathScale.value = withTiming(1);
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">SVG 图形</Text>
        <Text className="text-gray-600 mb-4">
          此功能展示了如何使用 SVG 图形和动画。
        </Text>
      </View>

      {/* SVG 画布 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">SVG 示例</Text>
        <View className="bg-gray-100 rounded-lg p-4 items-center">
          <Svg width={300} height={300}>
            {/* 圆形 */}
            <AnimatedCircle
              cx="150"
              cy="100"
              fill="red"
              animatedProps={animatedCircleProps}
            />

            {/* 矩形 */}
            <AnimatedRect
              x="100"
              y="150"
              height="50"
              fill="blue"
              animatedProps={animatedRectProps}
            />

            {/* 路径 */}
            <G transform="translate(150, 200)">
              <AnimatedPath
                d="M0,0 L50,0 L25,50 Z"
                fill="green"
                animatedProps={animatedPathProps}
              />
            </G>

            {/* 文本 */}
            <SvgText
              x="150"
              y="280"
              textAnchor="middle"
              fill="black"
              fontSize="16"
            >
              SVG 示例
            </SvgText>
          </Svg>
        </View>

        {/* 控制按钮 */}
        <View className="flex-row justify-center mt-4 space-x-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center"
            onPress={startAnimation}
            disabled={isAnimating}
          >
            <Ionicons name="play" size={20} color="white" />
            <Text className="text-white ml-2">开始动画</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-purple-500 rounded-lg p-4 flex-row items-center"
            onPress={resetAnimation}
            disabled={!isAnimating}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white ml-2">重置</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 基本图形：圆形、矩形、路径
          {'\n'}2. 动画效果：缩放、大小变化
          {'\n'}3. 交互控制：开始/重置动画
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 react-native-svg 和 react-native-reanimated
          {'\n'}2. 支持所有 SVG 基本图形
          {'\n'}3. 支持动画和交互
          {'\n'}4. 性能优化建议使用 Animated 组件
        </Text>
      </View>
    </ScrollView>
  );
}
