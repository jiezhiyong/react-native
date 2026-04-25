import { PermissionStatus } from 'expo-modules-core';
import { Pedometer } from 'expo-sensors';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useEffectAsync } from '@/hooks/use-effect-async';

export default function ExpoPedometerScreen() {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  useEffectAsync(async () => {
    await checkAvailability();
    await getStepCount();

    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, []);

  const checkAvailability = async () => {
    try {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);
      if (!available) {
        Alert.alert('提示', '此设备不支持计步功能');
      }
    } catch (error) {
      console.error('检查计步器可用性失败:', error);
      Alert.alert('错误', '检查计步器可用性失败');
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Pedometer.getPermissionsAsync();
      if (status !== PermissionStatus.GRANTED) {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== PermissionStatus.GRANTED) {
          Alert.alert('提示', '未授予计步器权限');
        }
      }
    } catch (error) {
      console.error('请求计步器权限失败:', error);
      Alert.alert('错误', '请求计步器权限失败');
    }
  };

  const getStepCount = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 1);

      const result = await Pedometer.getStepCountAsync(start, end);
      setStepCount(result.steps);
    } catch (error) {
      console.error('获取步数失败:', error);
      Alert.alert('错误', '获取步数失败');
    }
  };

  const startTracking = async () => {
    try {
      setIsTracking(true);
      const subscription = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });

      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.error('开始计步失败:', error);
      Alert.alert('错误', '开始计步失败');
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  if (!isAvailable) {
    return (
      <View className="flex-1 p-5 justify-center items-center bg-muted m-6 rounded-lg">
        <Text>此设备不支持计步功能</Text>
        <Button onPress={requestPermissions} className="mt-2">
          <Text>授权</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">计步器</Text>
        <Text className="text-muted-foreground">使用设备传感器计算和记录用户的步数。</Text>
      </View>

      <View className="space-y-6">
        <View className="py-10 bg-muted rounded-lg mb-6 items-center">
          <Text className="mb-2 text-muted-foreground">今日步数</Text>
          <Text className="text-4xl font-bold">{stepCount.toLocaleString()}</Text>
        </View>

        <View>
          {!isTracking ? (
            <Button onPress={startTracking}>
              <Text>订阅计步器更新</Text>
            </Button>
          ) : (
            <Button onPress={stopTracking} variant="destructive">
              <Text>停止订阅</Text>
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
