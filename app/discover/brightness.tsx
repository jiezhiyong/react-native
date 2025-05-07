import Slider from '@react-native-community/slider';
import * as Brightness from 'expo-brightness';
import { PermissionStatus } from 'expo-modules-core';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { sleep } from '~/lib/utils';

export default function ExpoBrightnessScreen() {
  const [brightness, setBrightness] = useState<number>(0);
  const [systemBrightness, setSystemBrightness] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // 请求权限（仅Android平台需要）
  const requestPermission = async () => {
    const { status } = await Brightness.requestPermissionsAsync();

    if (status === PermissionStatus.GRANTED) {
      setHasPermission(true);
      getBrightness();
    }
  };

  useEffect(() => {
    requestPermission();

    return () => {
      resetBrightness();
    };
  }, []);

  // 获取设备亮度
  const getBrightness = async () => {
    try {
      await sleep(100);
      const brightnessValue = await Brightness.getBrightnessAsync();
      setBrightness(brightnessValue);

      if (systemBrightness) {
        return;
      }
      if (Platform.OS === 'android') {
        const sysBrightness = await Brightness.getSystemBrightnessAsync();
        setSystemBrightness(sysBrightness);
      } else {
        setSystemBrightness(brightnessValue);
      }
    } catch (error) {
      console.error('获取亮度失败:', error);
    }
  };

  // 设置设备亮度
  const handleBrightnessChange = async (value: number) => {
    try {
      await Brightness.setBrightnessAsync(value);
      setBrightness(value);
    } catch (error) {
      console.error('设置亮度失败:', error);
    }
  };

  // 重置为系统亮度
  const resetBrightness = async () => {
    try {
      if (Platform.OS === 'android') {
        await Brightness.restoreSystemBrightnessAsync();
        getBrightness();
      } else if (systemBrightness) {
        await Brightness.setBrightnessAsync(systemBrightness);
        getBrightness();
      }
    } catch (error) {
      console.error('重置亮度失败:', error);
    }
  };

  if (hasPermission === false) {
    return (
      <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
        <Text className="text-center mb-6">需要权限来控制设备亮度</Text>
        <Button onPress={requestPermission}>
          <Text>请求权限</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">屏幕亮度</Text>
        <Text className="text-muted-foreground">控制和调节设备屏幕的亮度级别。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">当前设备亮度</Text>
        <Text className="text-3xl font-medium">{Math.round(brightness * 100)}%</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">调整亮度</Text>
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
          <Text>0%</Text>
          <Text>50%</Text>
          <Text>100%</Text>
        </View>
      </View>

      <Button className="mb-6" onPress={resetBrightness}>
        <Text>重置为系统亮度</Text>
      </Button>

      <View>
        <Text className="text-lg font-medium mb-2">注意</Text>
        <Text className="text-sm text-muted-foreground">1. 在Android上，应用关闭后亮度会恢复为系统亮度。</Text>
        <Text className="text-sm text-muted-foreground">2. 在iOS上，应用关闭或设备锁屏后亮度会恢复为系统亮度。</Text>
      </View>
    </View>
  );
}
