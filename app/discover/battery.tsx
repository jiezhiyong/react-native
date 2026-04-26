import * as Battery from 'expo-battery';
import { View } from 'react-native';

import { InfoItemRow } from '@/components/InfoItem';
import { Text } from '@/components/ui/text';

export default function ExpoBatteryScreen() {
  const { lowPowerMode, batteryLevel, batteryState } = Battery.usePowerState();

  return (
    <View className="flex-1 p-5 gap-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">电池状态</Text>
        <Text className="text-muted-foreground">监控设备电池状态和电量水平变化。</Text>
      </View>

      <InfoItemRow label="电池电量" value={batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : '...'} />
      <InfoItemRow label="充电状态" value={`${batteryState}, ${Battery.BatteryState[batteryState]}`} />
      <InfoItemRow label="省电模式" value={String(lowPowerMode)} />
    </View>
  );
}
