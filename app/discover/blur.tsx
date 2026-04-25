import { BlurView } from 'expo-blur';
import { Image, Platform, View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function ExpoBlurScreen() {
  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">模糊视图</Text>
        <Text className="text-muted-foreground">使用模糊效果为界面元素添加深度和层次感</Text>
      </View>

      <Text className="text-lg font-medium mb-2">不同模糊强度效果对比 - Light</Text>

      <View className="flex-row justify-between mb-6">
        {[15, 30, 75, 100].map((level) => (
          <View key={level} className="relative size-24 overflow-hidden rounded-lg">
            <Image source={require('@/assets/images/icon.png')} className="absolute w-full h-full" resizeMode="cover" />
            <BlurView
              intensity={level}
              className="absolute w-full h-full"
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            >
              <View className="flex-1 items-center justify-center">
                <Text className="text-white text-center">{level}%</Text>
              </View>
            </BlurView>
          </View>
        ))}
      </View>

      <Text className="text-lg font-medium mb-2">不同模糊强度效果对比 - Dark</Text>

      <View className="flex-row justify-between">
        {[15, 30, 75, 100].map((level) => (
          <View key={level} className="relative size-24 overflow-hidden rounded-lg">
            <Image source={require('@/assets/images/icon.png')} className="absolute w-full h-full" resizeMode="cover" />
            <BlurView
              intensity={level}
              tint="dark"
              className="absolute w-full h-full"
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            >
              <View className="flex-1 items-center justify-center">
                <Text className="text-white text-center">{level}%</Text>
              </View>
            </BlurView>
          </View>
        ))}
      </View>
    </View>
  );
}
