import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function ExpoSegmentedControlScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [value, setValue] = useState('选项一');
  const segments = ['选项一', '选项二', '选项三'];

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
        <Text className="font-medium mb-2">基本使用, {value}</Text>
        <SegmentedControl
          values={segments}
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
        <Text className="font-medium mb-2">禁用状态</Text>
        <SegmentedControl
          values={['账户', '密码']}
          enabled={false}
          tintColor="#fff"
          fontStyle={{ color: '#71717a' }}
          activeFontStyle={{ color: '#09090b' }}
        />
      </View>
    </View>
  );
}
