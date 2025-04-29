import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

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
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">网络信息</Text>
        <Text className="text-secondary-foreground">获取和监控设备的网络连接状态。</Text>
      </View>

      {/* 网络状态卡片 */}
      <View className="border border-input bg-muted rounded-lg p-6 mb-6">
        <Text>链接状态：{netinfoState?.isConnected ? '已连接' : '未连接'}</Text>
        <Text>连接类型：{netinfoState?.type || '未知'}</Text>

        <Text className="mt-4">
          SSID：{details?.ssid || '?'} (定位权限：{String(locationForegroundStatusGranted)})
        </Text>
        <Text>BSSID：{details?.bssid || ''}</Text>
        <Text>信号强度(%)：{details?.strength || '?'}</Text>
        <Text>频率(MHz)：{details?.frequency || '?'}</Text>

        <Text className="mt-4">运营商：{details?.carrier || '?'}</Text>
        <Text>蜂窝类型：{details?.cellularGeneration || '?'}</Text>
        <Text>信号强度(%)：{details?.strength || '?'}</Text>
      </View>

      {/* 操作按钮 */}
      <Button onPress={checkNetworkStatus}>
        <Text>刷新网络状态</Text>
      </Button>
    </ScrollView>
  );
}
