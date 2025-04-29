import * as Network from 'expo-network';
import { useNetworkState } from 'expo-network';
import { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useEffectAsync } from '~/hooks/use-effect-async';

interface NetworkInfo {
  ipAddress: string | null;
  isAirplaneMode: boolean | null;
}

export default function ExpoNetworkScreen() {
  const networkState = useNetworkState();

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    ipAddress: null,
    isAirplaneMode: null,
  });

  const getIpAddress = useCallback(async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      setNetworkInfo((prev) => ({ ...prev, ipAddress: ip }));
    } catch (error) {
      Alert.alert('错误', '获取IP地址失败: ' + error);
    } finally {
    }
  }, []);

  const checkAirplaneMode = useCallback(async () => {
    try {
      const isEnabled = await Network.isAirplaneModeEnabledAsync();
      setNetworkInfo((prev) => ({ ...prev, isAirplaneMode: isEnabled }));
    } catch (error) {
      Alert.alert('错误', '检查飞行模式失败: ' + error);
    } finally {
    }
  }, []);

  useEffectAsync(async () => {
    await getIpAddress();
    await checkAirplaneMode();
  }, []);

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">网络信息</Text>
        <Text className="text-secondary-foreground">访问设备网络信息的库，如 IP 地址、MAC 地址和飞行模式状态</Text>
      </View>

      <View className="bg-muted p-4 rounded-lg mb-4 flex gap-1">
        <Text>网络类型: {networkState.type || '未知'}</Text>
        <Text>是否已连接: {String(networkState.isConnected)}</Text>
        <Text>是否可访问互联网: {String(networkState.isInternetReachable)}</Text>
        <Text>IP地址: {networkInfo.ipAddress || '未知'}</Text>
        <Text>飞行模式: {String(networkInfo.isAirplaneMode || '未知')}</Text>
      </View>

      <View className="flex-row gap-2">
        <Button onPress={getIpAddress} className="flex-1">
          <Text>获取IP地址</Text>
        </Button>
        <Button onPress={checkAirplaneMode} className="flex-1">
          <Text>检查飞行模式</Text>
        </Button>
      </View>
    </View>
  );
}
