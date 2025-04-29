import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

// 加速度计数据接口
interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

// 订阅状态接口
interface SubscriptionStatus {
  isAvailable: boolean | null;
  isSubscribed: boolean;
}

export default function AccelerometerScreen() {
  // 加速度计数据状态
  const [data, setData] = useState<AccelerometerData>({
    x: 0,
    y: 0,
    z: 0,
  });

  // 更新间隔 (毫秒)
  const [updateInterval] = useState<number>(1000);

  // 订阅状态
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isAvailable: null,
    isSubscribed: false,
  });

  // 组件挂载时执行权限检查和初始化
  useEffect(() => {
    checkAvailability();

    return () => {
      // 组件卸载时清理订阅
      Accelerometer?.removeAllListeners();
    };
  }, []);

  // 检查加速度计可用性
  const checkAvailability = async () => {
    try {
      const isAccelerometerAvailable = await Accelerometer.isAvailableAsync();
      setSubscription((prev) => ({ ...prev, isAvailable: isAccelerometerAvailable }));

      if (!isAccelerometerAvailable) {
        Alert.alert('提示', '设备不支持加速度计功能');
      }
    } catch (error) {
      console.error('检查加速度计可用性时出错:', error);
      Alert.alert('错误', '检查加速度计可用性时发生错误');
    }
  };

  // 请求权限
  const requestPermission = async () => {
    try {
      // 注意：Accelerometer在大多数设备上不需要明确的权限
      // 但在某些特定设备或平台上可能需要
      // 例如在Web上需要用户交互后调用
      const { granted, canAskAgain, expires, status } = await Accelerometer.requestPermissionsAsync();

      // 权限获取成功后订阅数据
      if (granted) {
        subscribeToAccelerometer();
      } else if (canAskAgain) {
        Alert.alert('提示', '需要加速度计权限才能使用此功能');
      } else {
        Alert.alert('提示', '无法获取加速度计权限');
      }
    } catch (error) {
      console.error('请求加速度计权限时出错:', error);
      Alert.alert('错误', '无法获取加速度计权限');
    }
  };

  // 订阅加速度计数据
  const subscribeToAccelerometer = () => {
    setSubscription((prev) => ({ ...prev, isSubscribed: true }));

    // 设置更新频率
    Accelerometer.setUpdateInterval(updateInterval);

    // 订阅数据更新
    const subscription = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
    });

    // 保存订阅以便后续可以取消
    return subscription;
  };

  // 开始监听
  const startListening = () => {
    // 如果已知设备支持加速度计，直接订阅
    if (subscription.isAvailable) {
      const sub = subscribeToAccelerometer();
      return () => sub.remove();
    }

    // 如果未检查可用性，先检查再订阅
    else if (subscription.isAvailable === null) {
      checkAvailability().then(() => {
        requestPermission();
      });
    }
  };

  // 停止监听
  const stopListening = () => {
    setSubscription((prev) => ({ ...prev, isSubscribed: false }));
    Accelerometer.removeAllListeners();
  };

  // 格式化加速度计数据，保留2位小数
  const formatData = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">加速度计</Text>
        <Text className="text-secondary-foreground">使用设备加速度计感应设备的运动和方向变化。</Text>
      </View>

      {/* 状态信息 */}
      <View className="mb-6 p-4 bg-muted dark:bg-gray-800 rounded-lg flex-col gap-2">
        <Text className="text-gray-700 dark:text-gray-300">
          是否支持加速度计:&nbsp;
          {subscription.isAvailable === null ? '检查中 ...' : String(subscription.isAvailable)}
        </Text>
        <Text className="text-gray-700 dark:text-gray-300">监听状态:&nbsp; {String(subscription.isSubscribed)}</Text>
        <Text className="text-gray-700 dark:text-gray-300">更新间隔:&nbsp; {updateInterval} ms</Text>
      </View>

      {/* 数据显示 */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <Text>X轴</Text>
          <Text className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatData(data.x)}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
          <Text>Y轴</Text>
          <Text className="text-lg font-semibold text-green-600 dark:text-green-400">{formatData(data.y)}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-2 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
          <Text>Z轴</Text>
          <Text className="text-lg font-semibold text-red-600 dark:text-red-400">{formatData(data.z)}</Text>
        </View>
      </View>

      {/* 控制按钮 */}
      <Button
        variant={subscription.isSubscribed ? 'destructive' : 'default'}
        onPress={subscription.isSubscribed ? stopListening : startListening}
      >
        <Text>{subscription.isSubscribed ? '停止监听' : '开始监听'}</Text>
      </Button>
    </View>
  );
}
