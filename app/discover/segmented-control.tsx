import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function ExpoSegmentedControlScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [value, setValue] = useState('账户');

  const handleChange = (event: { nativeEvent: { selectedSegmentIndex: number; value: string } }) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
    setValue(event.nativeEvent.value);
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">分段控制器</Text>
        <Text className="text-muted-foreground">使用分段控制器来切换不同的视图或选项。</Text>
      </View>

      {/* 基本使用示例 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">基本使用, {value}</Text>
        <SegmentedControl
          values={['账户', '密码', '其他']}
          selectedIndex={selectedIndex}
          onChange={handleChange}
          backgroundColor=""
          tintColor="#fff"
          fontStyle={{ color: '#71717a' }}
          activeFontStyle={{ color: '#09090b' }}
        />
      </View>

      {/* 禁用状态示例 */}
      <View>
        <Text className="text-lg font-medium mb-2">禁用状态</Text>
        <SegmentedControl
          values={['账户', '密码', '其他']}
          selectedIndex={0}
          enabled={false}
          tintColor="#fff"
          fontStyle={{ color: '#71717a' }}
          activeFontStyle={{ color: '#09090b' }}
        />
      </View>
    </View>
  );
}
