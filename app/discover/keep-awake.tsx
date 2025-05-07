import { useKeepAwake } from 'expo-keep-awake';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

// https://docs.expo.dev/versions/latest/sdk/keep-awake/
export default function ExpoKeepAwakeScreen() {
  useKeepAwake();

  return (
    <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">屏幕常亮</Text>
        <Text className="text-muted-foreground">在应用运行时保持设备屏幕不进入休眠状态</Text>
      </View>

      <Text className="text-center mb-6">This screen will never sleep!</Text>
    </View>
  );
}
