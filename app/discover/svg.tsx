import { useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ExpoSvgScreen() {
  const [isAnimated, setIsAnimated] = useState(false);
  const circleRadius = useSharedValue(30);

  // 动画属性
  const animatedCircleProps = useAnimatedProps(() => ({
    r: circleRadius.value,
  }));

  // 开始动画
  const startAnimation = () => {
    setIsAnimated(true);
    circleRadius.set(withSpring(60, { damping: 5 }));
  };

  // 重置动画
  const resetAnimation = () => {
    setIsAnimated(false);
    circleRadius.set(withSpring(30, { damping: 10 }));
  };

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Svg</Text>
        <Text className="text-muted-foreground">使用 SVG 图形和动画</Text>
      </View>

      <View className="flex-1">
        <View className="bg-muted rounded-lg p-4 items-center">
          <Svg width={300} height={200}>
            {/* 圆形 */}
            <AnimatedCircle cx="150" cy="100" fill="#169fe6" animatedProps={animatedCircleProps} />
          </Svg>
        </View>
      </View>

      {/* 控制按钮 */}
      <View className="gap-3 mt-3">
        <Button onPress={isAnimated ? resetAnimation : startAnimation} variant={isAnimated ? 'destructive' : 'default'}>
          <Text>{isAnimated ? '重置' : '开始动画'}</Text>
        </Button>
      </View>
    </View>
  );
}
