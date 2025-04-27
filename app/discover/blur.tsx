import { BlurView } from 'expo-blur';
import { Image, Platform, View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function ExpoBlurScreen() {
  return (
    <View className="flex-1 p-6">
      <Text className="text-lg font-semibold mb-3">不同模糊强度效果对比 - Light</Text>

      <View className="flex-row justify-between mb-6">
        {[10, 40, 70, 100].map((level) => (
          <View key={level} className="relative w-20 h-20 overflow-hidden rounded-lg">
            <Image source={require('~/assets/images/icon.png')} className="absolute w-full h-full" resizeMode="cover" />
            <BlurView
              intensity={level}
              className="absolute w-full h-full"
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            >
              <View className="flex-1 items-center justify-center">
                <Text className="text-white text-xs text-center">{level}%</Text>
              </View>
            </BlurView>
          </View>
        ))}
      </View>

      <Text className="text-lg font-semibold mb-3">不同模糊强度效果对比 - Dark</Text>

      <View className="flex-row justify-between mb-4">
        {[10, 40, 70, 100].map((level) => (
          <View key={level} className="relative w-20 h-20 overflow-hidden rounded-lg">
            <Image source={require('~/assets/images/icon.png')} className="absolute w-full h-full" resizeMode="cover" />
            <BlurView
              intensity={level}
              tint="dark"
              className="absolute w-full h-full"
              experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            >
              <View className="flex-1 items-center justify-center">
                <Text className="text-white text-xs text-center">{level}%</Text>
              </View>
            </BlurView>
          </View>
        ))}
      </View>
    </View>
  );
}
