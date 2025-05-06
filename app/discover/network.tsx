import { useNetInfo } from '@react-native-community/netinfo';
import * as Network from 'expo-network';
import { useNetworkState } from 'expo-network';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';
import { useEffectAsync } from '~/hooks/use-effect-async';

interface NetworkInfo {
  ipAddress: string | null;
  isAirplaneMode: boolean | null;
}

export default function ExpoNetworkScreen() {
  const networkState = useNetworkState();

  const netInfo = useNetInfo({
    shouldFetchWiFiSSID: true,
  });

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    ipAddress: null,
    isAirplaneMode: null,
  });

  const getIpAddress = useCallback(async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      setNetworkInfo((prev) => ({ ...prev, ipAddress: ip }));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const checkAirplaneMode = useCallback(async () => {
    try {
      const isEnabled = await Network.isAirplaneModeEnabledAsync();
      setNetworkInfo((prev) => ({ ...prev, isAirplaneMode: isEnabled }));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffectAsync(async () => {
    await getIpAddress();
    await checkAirplaneMode();
  }, []);

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">网络信息</Text>
        <Text className="text-muted-foreground">访问设备网络信息的库，如 IP 地址、MAC 地址和飞行模式状态</Text>
      </View>

      <Text className="text-lg font-medium mb-2">expo-network</Text>

      <View className="bg-muted rounded-lg p-4 mb-4">
        <Text>{JSON.stringify({ ...networkState, ...networkInfo }, null, 2)}</Text>
      </View>

      <Text className="text-lg font-medium mb-2">@react-native-community/netinfo</Text>
      <View className="flex-1">
        <View className="bg-muted rounded-lg p-4">
          <Text>{JSON.stringify(netInfo, null, 2)}</Text>
        </View>
      </View>
    </View>
  );
}
