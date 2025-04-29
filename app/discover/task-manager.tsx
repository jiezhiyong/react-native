import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PermissionStatus } from 'expo-modules-core';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// 定义位置任务名称
const LOCATION_TASK_NAME = 'background-location-task';

// 定义位置任务执行器
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('位置任务执行错误:', error.message);
    return Promise.resolve();
  }
  if (data) {
    const { locations } = data as { locations: any[] };
    console.log('收到位置更新:', locations);
    // 这里可以处理位置数据，比如发送到服务器等
  }
  return Promise.resolve();
});

export default function ExpoTaskManagerScreen() {
  const [isTaskRegistered, setIsTaskRegistered] = useState(false);
  const [isTaskAvailable, setIsTaskAvailable] = useState(false);
  const [error, setError] = useState('');
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);

  // 检查任务管理器是否可用
  useEffect(() => {
    async function checkAvailability() {
      try {
        const available = await TaskManager.isAvailableAsync();
        setIsTaskAvailable(available);
      } catch (error) {
        setError('检查任务管理器可用性失败: ' + (error as Error).message);
      }
    }
    checkAvailability();
  }, []);

  // 检查任务是否已注册
  useEffect(() => {
    async function checkTaskRegistration() {
      try {
        const registered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        setIsTaskRegistered(registered);
      } catch (error) {
        setError('检查任务注册状态失败: ' + (error as Error).message);
      }
    }
    checkTaskRegistration();
  }, []);

  // 请求位置权限
  const requestLocationPermissions = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(foregroundStatus);

      if (foregroundStatus === PermissionStatus.GRANTED) {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === PermissionStatus.GRANTED) {
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000, // 5秒更新一次
            distanceInterval: 10, // 10米更新一次
            foregroundService: {
              notificationTitle: '位置更新',
              notificationBody: '正在后台更新位置',
              notificationColor: '#0000ff',
            },
          });
          setIsTaskRegistered(true);
          Alert.alert('成功', '位置更新任务已启动');
        } else {
          Alert.alert('错误', '需要后台位置权限');
        }
      } else {
        Alert.alert('错误', '需要位置权限');
      }
    } catch (error) {
      setError('请求位置权限失败: ' + (error as Error).message);
    }
  };

  // 停止位置更新
  const stopLocationUpdates = async () => {
    try {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      setIsTaskRegistered(false);
      Alert.alert('成功', '位置更新已停止');
    } catch (error) {
      setError('停止位置更新失败: ' + (error as Error).message);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Task Manager</Text>
        <Text className="text-secondary-foreground">使用和配置 Task Manager 相关功能。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">位置更新任务</Text>
        <Text className="text-secondary-foreground">在后台持续获取位置信息。</Text>
      </View>

      {/* 任务管理器状态 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">任务状态</Text>
        <View className="bg-muted rounded-lg p-4">
          <Text className="text-secondary-foreground mb-2">任务管理器可用: {isTaskAvailable ? '是' : '否'}</Text>
          <Text className="text-secondary-foreground mb-2">位置任务已注册: {isTaskRegistered ? '是' : '否'}</Text>
          <Text className="text-secondary-foreground mb-2">位置权限: {locationPermission || '未请求'}</Text>
        </View>
      </View>

      {/* 任务控制 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">任务控制</Text>
        <View className="space-y-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={requestLocationPermissions}
            disabled={!isTaskAvailable || isTaskRegistered}
          >
            <Ionicons name="location" size={20} color="white" />
            <Text className="text-white ml-2">启动位置更新</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={stopLocationUpdates}
            disabled={!isTaskRegistered}
          >
            <Ionicons name="stop" size={20} color="white" />
            <Text className="text-white ml-2">停止位置更新</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 错误提示 */}
      {error ? (
        <View className="bg-red-100 rounded-lg p-4 mb-8">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-muted rounded-lg p-4">
        <Text className="text-base font-medium mb-2">使用说明</Text>
        <Text className="text-secondary-foreground">
          1. 点击"启动位置更新"按钮请求位置权限
          {'\n'}2. 需要同时授予前台和后台位置权限
          {'\n'}3. 位置更新将在后台持续进行
          {'\n'}4. 可以随时停止位置更新
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-location
          {'\n'}2. 在 iOS 上需要配置后台模式
          {'\n'}3. 在 Android 上需要配置前台服务
          {'\n'}4. 建议在真机上测试
        </Text>
      </View>
    </ScrollView>
  );
}
