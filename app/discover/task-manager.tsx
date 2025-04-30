import * as Location from 'expo-location';
import { PermissionStatus } from 'expo-modules-core';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

// 定义位置任务名称
const LOCATION_TASK_NAME = 'background-location-task';

export default function ExpoTaskManagerScreen() {
  const [isTaskRegistered, setIsTaskRegistered] = useState(false);
  const [isTaskAvailable, setIsTaskAvailable] = useState(false);
  const [error, setError] = useState('');
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  const [locations, setLocations] = useState<any | null>(null);

  useEffect(() => {
    // 定义位置任务执行器
    TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
      if (error) {
        console.error('位置任务执行错误:', error.message);
        return;
      }
      if (data) {
        const { locations } = data as { locations: any[] };
        console.log('收到位置更新:', locations);
        setLocations(locations);
      }
    });

    // 检查任务管理器是否可用
    async function checkAvailability() {
      try {
        const available = await TaskManager.isAvailableAsync();
        setIsTaskAvailable(available);
      } catch (error) {
        setError('检查任务管理器可用性失败: ' + (error as Error).message);
      }
    }

    // 检查任务是否已注册
    async function checkTaskRegistration() {
      try {
        const registered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        setIsTaskRegistered(registered);
      } catch (error) {
        setError('检查任务注册状态失败: ' + (error as Error).message);
      }
    }

    checkAvailability();
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
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">任务管理器</Text>
        <Text className="text-muted-foreground">使用和配置任务管理器相关功能</Text>
      </View>

      {/* 任务管理器状态 */}
      <View className="mb-6">
        <Text className="font-medium mb-2">任务状态</Text>
        <View className="bg-muted rounded-lg p-4 gap-2">
          <Text>任务管理器可用: {isTaskAvailable ? '是' : '否'}</Text>
          <Text>位置任务已注册: {isTaskRegistered ? '是' : '否'}</Text>
          <Text>位置权限: {locationPermission || '未请求'}</Text>
        </View>
      </View>

      {/* 任务控制 */}
      <View className="mb-6">
        <Text className="font-medium mb-2">任务控制</Text>
        <Button
          onPress={isTaskRegistered ? stopLocationUpdates : requestLocationPermissions}
          disabled={!isTaskAvailable}
          variant={isTaskRegistered ? 'destructive' : 'default'}
        >
          <Text>{isTaskRegistered ? '停止位置更新' : '启动位置更新'}</Text>
        </Button>
      </View>

      {/* 位置更新 */}
      {locations ? (
        <View className="bg-muted rounded-lg p-4 mb-8">
          <Text>{JSON.stringify(locations, null, 2)}</Text>
        </View>
      ) : null}

      {/* 错误提示 */}
      {error ? (
        <View className="bg-destructive/10 rounded-lg p-4 mb-8">
          <Text className="text-destructive">{error}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
