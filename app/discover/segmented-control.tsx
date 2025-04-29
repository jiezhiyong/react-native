import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function ExpoSegmentedControlScreen() {
  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">分段控制器</Text>
        <Text className="text-secondary-foreground">使用分段控制器来切换不同的视图或选项。</Text>
      </View>
    </View>
  );
}
