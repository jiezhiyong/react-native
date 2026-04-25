import * as Location from 'expo-location';
import { PermissionStatus } from 'expo-modules-core';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from '@/components/ActivityIndicator';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// https://docs.expo.dev/versions/latest/sdk/location/
export default function ExpoLocationScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [subscription, setSubscription] = useState<Location.LocationSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 组件卸载时清理订阅
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  // 请求位置权限
  const requestPermissions = async () => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== PermissionStatus.GRANTED) {
        setErrorMsg('需要位置权限才能使用此功能');
        return false;
      }
      return true;
    } catch (error: any) {
      setErrorMsg(`请求位置权限时出错: ${error?.message}`);
      return false;
    }
  };

  // 获取当前位置
  const getCurrentLocation = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setErrorMsg('需要位置权限才能使用此功能');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(currentLocation);
    } catch (error: any) {
      setErrorMsg(`获取当前位置失败: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 开始监听位置变化
  const startLocationUpdates = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setErrorMsg('需要位置权限才能使用此功能');
      return;
    }

    try {
      if (subscription) {
        subscription.remove();
      }

      setErrorMsg(null);
      setIsWatching(true);

      // 获取一次初始位置
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);

      // 开始持续监听
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // 5秒更新一次
          distanceInterval: 10, // 移动10米更新一次
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );

      setSubscription(locationSubscription);
    } catch (error: any) {
      setErrorMsg(`位置监听启动失败: ${error?.message}`);
      setIsWatching(false);
    }
  };

  // 停止监听位置变化
  const stopLocationUpdates = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
    setIsWatching(false);
  };

  // 格式化位置信息显示
  const getLocationText = () => {
    if (errorMsg) {
      return <Text className="text-destructive">{errorMsg}</Text>;
    }

    if (!location) {
      return <Text className="text-muted-foreground">尚未获取位置信息</Text>;
    }

    const { coords, timestamp } = location;
    const date = new Date(timestamp);

    return (
      <View className="flex-col gap-2">
        <Text>纬度: {coords.latitude}</Text>
        <Text>经度: {coords.longitude}</Text>
        <Text>海拔: {coords.altitude !== null ? `${coords.altitude.toFixed(2)}米` : '未知'}</Text>
        <Text>精确度: {coords.accuracy !== null ? `${coords.accuracy.toFixed(2)}米` : '未知'}</Text>
        <Text>速度: {coords.speed !== null ? `${(coords.speed * 3.6).toFixed(2)}km/h` : '未知'}</Text>
        <Text>方向: {coords.heading !== null ? `${coords.heading.toFixed(2)}°` : '未知'}</Text>
        <Text>更新时间: {date.toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">位置服务</Text>
        <Text className="text-muted-foreground">获取和跟踪设备的地理位置信息</Text>
      </View>

      <View className="mb-6 bg-muted rounded-lg p-4">
        <Text className="mb-2 text-lg font-medium">位置信息:</Text>
        <View>{getLocationText()}</View>
      </View>

      <View className="space-y-4">
        <Button className="mb-3" onPress={getCurrentLocation} disabled={isWatching}>
          {loading ? <ActivityIndicator /> : <Text>获取当前位置</Text>}
        </Button>

        {!isWatching ? (
          <Button onPress={startLocationUpdates} variant="outline">
            <Text>开始位置监听</Text>
          </Button>
        ) : (
          <Button onPress={stopLocationUpdates} variant="destructive">
            <Text>停止位置监听</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
