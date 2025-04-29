// https://docs.expo.dev/versions/latest/sdk/linear-gradient/
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoLinearGradientScreen() {
  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">线性渐变</Text>
        <Text className="text-secondary-foreground">使用线性渐变创建丰富多彩的背景和界面元素。</Text>
      </View>

      {/* 基础渐变背景 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">基础渐变背景</Text>
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={{ height: 80, borderRadius: 6 }} />
      </View>

      {/* 对角线渐变 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">对角线渐变</Text>
        <LinearGradient
          colors={['#ff9a9e', '#fad0c4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 80, borderRadius: 6 }}
        />
      </View>

      {/* 多色渐变 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">多色渐变</Text>
        <LinearGradient
          colors={['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 80, borderRadius: 6 }}
        />
      </View>

      {/* 渐变按钮 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">渐变按钮</Text>
        <LinearGradient
          colors={['#06b6d4', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 6 }}
        >
          <Button className="bg-transparent">
            <Text className="text-white">渐变按钮</Text>
          </Button>
        </LinearGradient>
      </View>
    </View>
  );
}
