import { useKeepAwake } from 'expo-keep-awake';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

// https://docs.expo.dev/versions/latest/sdk/keep-awake/
export default function ExpoKeepAwakeScreen() {
  useKeepAwake();

  return (
    <View className="flex-1 p-6 m-6 items-center justify-center bg-muted rounded-lg">
      <Text className="text-center mb-6">This screen will never sleep!</Text>
    </View>
  );
}
