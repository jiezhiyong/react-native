import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { InfoItemCol } from '~/components/InfoItem';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useEffectAsync } from '~/hooks/use-effect-async';

export default function ExpoNetInfoScreen() {
  const [netinfoState, setNetinfoState] = useState<NetInfoState | null>(null);
  const [locationForegroundStatusGranted, setLocationForegroundStatusGranted] = useState<boolean>(false);

  useEffectAsync(async () => {
    // 请求位置权限
    await requestLocationPermissions();

    // 获取初始网络状态
    checkNetworkStatus();

    // 订阅网络状态变化
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetinfoState(state);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const requestLocationPermissions = async () => {
    try {
      await Location.requestForegroundPermissionsAsync();
      setLocationForegroundStatusGranted(true);
      return true;
    } catch (e) {
      console.error(e);
      setLocationForegroundStatusGranted(false);
    }
  };

  const checkNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      setNetinfoState(state);
    } catch (error) {
      console.error('获取网络状态失败:', error);
      Alert.alert('错误', '获取网络状态失败');
    }
  };

  const details: any = netinfoState?.details;
  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">网络信息</Text>
        <Text className="text-muted-foreground">获取和监控设备的网络连接状态。</Text>
      </View>

      {/* 网络状态卡片 */}
      <View className="flex-1">
        <InfoItemCol label="连接状态" value={netinfoState?.isConnected ? '已连接' : '未连接'} />
        <InfoItemCol label="连接类型" value={netinfoState?.type} />
        <InfoItemCol label={`SSID (定位权限：${String(locationForegroundStatusGranted)})`} value={details?.ssid} />
        <InfoItemCol label="BSSID" value={details?.bssid} />
        <InfoItemCol label="信号强度(%)" value={details?.strength} />
        <InfoItemCol label="频率(MHz)" value={details?.frequency} />
        <InfoItemCol label="运营商" value={details?.carrier} />
        <InfoItemCol label="蜂窝类型" value={details?.cellularGeneration} />
        <Text className="">{JSON.stringify(details, null, 2)}</Text>
      </View>
    </View>
  );
}
