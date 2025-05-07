import * as ScreenCapture from 'expo-screen-capture';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useEffectAsync } from '~/hooks/use-effect-async';

export default function ExpoScreenCaptureScreen() {
  // 自动阻止屏幕截图（组件加载时启动保护，卸载时移除保护）
  ScreenCapture.usePreventScreenCapture();

  const [status, requestPermission] = ScreenCapture.usePermissions();
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [screenshotCount, setScreenshotCount] = useState(0);
  const [lastScreenshotTime, setLastScreenshotTime] = useState<string | null>(null);

  // 手动控制屏幕捕获保护
  const toggleProtection = async () => {
    if (isProtectionEnabled) {
      await ScreenCapture.allowScreenCaptureAsync();
      setIsProtectionEnabled(false);
    } else {
      await ScreenCapture.preventScreenCaptureAsync();
      setIsProtectionEnabled(true);
    }
  };

  useEffectAsync(async () => {
    await requestPermission();
    const res = await ScreenCapture.isAvailableAsync();
    setIsAvailable(res);

    // 添加屏幕截图监听器
    const subscription = ScreenCapture.addScreenshotListener(() => {
      const now = new Date();
      setLastScreenshotTime(now.toLocaleTimeString());
      setScreenshotCount((prev) => prev + 1);
    });

    // 组件卸载时清理监听器
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">屏幕保护</Text>
        <Text className="text-muted-foreground mb-4">
          保护应用中屏幕不被捕获或录制（目前，在 iOS 上无法阻止截屏。这是由于底层操作系统限制造成的）
        </Text>
      </View>

      <View className="flex-1">
        {/* 屏幕截图保护状态和控制 */}
        <Text className="text-lg font-medium mb-2">屏幕截图保护状态: {isProtectionEnabled ? '已启用' : '已禁用'}</Text>
        <View className="p-4 bg-muted rounded-lg mb-6 flex gap-3">
          <Text>可用状态: {isAvailable ? '可用' : '不可用'}</Text>
          <Text>权限状态: {status?.granted ? '已授予权限' : '未授予权限'}</Text>
        </View>

        {/* 屏幕截图监听器信息 */}
        <Text className="text-lg font-medium mb-2">屏幕截图监听器</Text>
        <View className="p-4 bg-muted rounded-lg mb-6 flex gap-3">
          <Text>截图次数: {screenshotCount}</Text>
          <Text className="mt-1">上次截图时间: {lastScreenshotTime || '-'}</Text>
        </View>
      </View>

      <Button onPress={toggleProtection} variant={isProtectionEnabled ? 'destructive' : 'default'}>
        <Text>{isProtectionEnabled ? '禁用屏幕截图保护' : '启用屏幕截图保护'}</Text>
      </Button>
    </View>
  );
}
