import * as Battery from 'expo-battery';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function ExpoBatteryScreen() {
  const { lowPowerMode, batteryLevel, batteryState } = Battery.usePowerState();

  return (
    <View className="flex-1 p-6 space-y-4">
      <View className="flex-row justify-between items-center border-b border-gray-200 py-4">
        <Text className="font-medium">电池电量:</Text>
        <Text>{batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : '...'}</Text>
      </View>

      <View className="flex-row justify-between items-center border-b border-gray-200 py-4">
        <Text className="font-medium">充电状态:</Text>
        <Text>
          {batteryState}, {Battery.BatteryState[batteryState]}
        </Text>
      </View>

      <View className="flex-row justify-between items-center border-b border-gray-200 py-4">
        <Text className="font-medium">省电模式:</Text>
        <Text>{String(lowPowerMode)}</Text>
      </View>
    </View>
  );
}
