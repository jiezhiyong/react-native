import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import { Box, Move3D, MoveHorizontal, MoveVertical } from 'lucide-react-native';

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
  const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  // 更新间隔 (毫秒)
  const [updateInterval, setUpdateInterval] = useState<number>(100);
  // 订阅状态
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isAvailable: null,
    isSubscribed: false,
  });

  // 检查加速度计可用性
  const checkAvailability = async () => {
    try {
      const isAvailableResult = await Accelerometer.isAvailableAsync();
      setSubscription((prev) => ({ ...prev, isAvailable: isAvailableResult }));
      
      if (!isAvailableResult) {
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
      await Accelerometer.requestPermissionsAsync();
      
      // 权限获取成功后订阅数据
      subscribeToAccelerometer();
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

  // 组件挂载时执行权限检查和初始化
  useEffect(() => {
    checkAvailability();
    
    return () => {
      // 组件卸载时清理订阅
      Accelerometer.removeAllListeners();
    };
  }, []);

  // 格式化加速度计数据，保留4位小数
  const formatData = (value: number): string => {
    return value.toFixed(4);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Stack.Screen options={{ title: '加速度计演示', headerTitleAlign: 'center' }} />
      
      <View className="p-4">
        <Text className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">加速度计数据</Text>
        
        {/* 状态信息 */}
        <View className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Text className="mb-2 text-gray-700 dark:text-gray-300">
            状态: {subscription.isAvailable === null ? '检查中...' : subscription.isAvailable ? '可用' : '不可用'}
          </Text>
          <Text className="text-gray-700 dark:text-gray-300">
            监听: {subscription.isSubscribed ? '已开启' : '已停止'}
          </Text>
        </View>
        
        {/* 数据显示 */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <MoveHorizontal size={24} color="#3b82f6" />
            <Text className="text-lg font-semibold text-blue-600 dark:text-blue-400">X轴: {formatData(data.x)}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <MoveVertical size={24} color="#10b981" />
            <Text className="text-lg font-semibold text-green-600 dark:text-green-400">Y轴: {formatData(data.y)}</Text>
          </View>
          
          <View className="flex-row justify-between items-center mb-4 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
            <Move3D size={24} color="#ef4444" />
            <Text className="text-lg font-semibold text-red-600 dark:text-red-400">Z轴: {formatData(data.z)}</Text>
          </View>
        </View>
        
        {/* 控制按钮 */}
        <View className="flex-row justify-around my-4">
          <View className="w-2/5">
            <Button
              title={subscription.isSubscribed ? '停止监听' : '开始监听'}
              onPress={subscription.isSubscribed ? stopListening : startListening}
              color={subscription.isSubscribed ? '#ef4444' : '#10b981'}
            />
          </View>
        </View>
        
        {/* 说明信息 */}
        <View className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Text className="text-sm text-gray-700 dark:text-gray-300">
            说明: 加速度计测量设备在三个物理轴(x、y和z)上的加速度变化。
            数值以G为单位，1G = 9.8 m/s²（地球重力加速度）。
            设备静止放置时，垂直于地面的轴将读数约为1G。
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}