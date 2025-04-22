import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import * as Brightness from 'expo-brightness';
import { useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoBrightnessScreen() {
  const [brightness, setBrightness] = useState<number>(0);
  const [systemBrightness, setSystemBrightness] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 请求权限（仅Android平台需要）
  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      const { status } = await Brightness.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } else {
      // iOS不需要权限
      setHasPermission(true);
    }
  }, []);

  // 获取设备亮度
  const getBrightness = useCallback(async () => {
    try {
      const brightnessValue = await Brightness.getBrightnessAsync();
      setBrightness(brightnessValue);

      // 只有在Android上才能获取系统亮度
      if (Platform.OS === 'android') {
        const sysBrightness = await Brightness.getSystemBrightnessAsync();
        setSystemBrightness(sysBrightness);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('获取亮度失败:', error);
      setIsLoading(false);
    }
  }, []);

  // 设置设备亮度
  const handleBrightnessChange = useCallback(async (value: number) => {
    try {
      await Brightness.setBrightnessAsync(value);
      setBrightness(value);
    } catch (error) {
      console.error('设置亮度失败:', error);
    }
  }, []);

  // 重置为系统亮度
  const resetBrightness = useCallback(async () => {
    try {
      if (Platform.OS === 'android' && systemBrightness !== null) {
        await Brightness.setSystemBrightnessAsync(systemBrightness);
        getBrightness();
      } else {
        // iOS上，恢复系统亮度
        // 注意：useSystemBrightnessAsync不是Hook，而是普通的异步函数
        await Brightness.useSystemBrightnessAsync();
        getBrightness();
      }
    } catch (error) {
      console.error('重置亮度失败:', error);
    }
  }, [systemBrightness, getBrightness]);

  // 组件加载时请求权限
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // 获取权限后获取亮度
  useEffect(() => {
    if (hasPermission) {
      getBrightness();
    }
  }, [hasPermission, getBrightness]);

  // 当页面重新获得焦点时刷新亮度
  useFocusEffect(
    useCallback(() => {
      if (hasPermission) {
        getBrightness();
      }

      return () => {
        // 离开页面时重置亮度（可选）
        // resetBrightness();
      };
    }, [hasPermission, getBrightness])
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-center mb-4">需要权限来控制设备亮度</Text>
        <Button onPress={requestPermission}>
          <Text>请求权限</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white dark:bg-gray-800">
      <Text className="text-2xl font-bold mb-6 text-center">设备亮度控制</Text>

      <View className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <Text className="text-lg mb-2">当前亮度</Text>
        <Text className="text-3xl font-semibold">{Math.round(brightness * 100)}%</Text>
      </View>

      <View className="mb-8">
        <Text className="text-base mb-2">调整亮度:</Text>
        <Slider
          value={brightness}
          onValueChange={handleBrightnessChange}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          thumbTintColor="#3b82f6"
          minimumTrackTintColor="#3b82f6"
          maximumTrackTintColor="#d1d5db"
        />
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs">0%</Text>
          <Text className="text-xs">50%</Text>
          <Text className="text-xs">100%</Text>
        </View>
      </View>

      <View className="flex-row justify-around gap-2">
        <Button className="flex-1" onPress={() => handleBrightnessChange(0.1)}>
          <Text>低亮度</Text>
        </Button>
        <Button className="flex-1" onPress={() => handleBrightnessChange(0.5)}>
          <Text>中亮度</Text>
        </Button>
        <Button className="flex-1" onPress={() => handleBrightnessChange(1)}>
          <Text>高亮度</Text>
        </Button>
      </View>

      <Button className="mt-4 bg-gray-500" onPress={resetBrightness}>
        <Text>重置为系统亮度</Text>
      </Button>

      {Platform.OS === 'android' && (
        <View className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <Text className="text-lg mb-2">系统亮度: {Math.round(systemBrightness * 100)}%</Text>
          <Text className="text-sm text-gray-500">注意: 在Android上，应用关闭后亮度会恢复为系统亮度。</Text>
        </View>
      )}

      {Platform.OS === 'ios' && (
        <View className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
          <Text className="text-sm text-gray-500">注意: 在iOS上，应用关闭或设备锁屏后亮度会恢复为系统亮度。</Text>
        </View>
      )}
    </View>
  );
}
