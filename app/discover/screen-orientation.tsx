import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoScreenOrientationScreen() {
  const [currentOrientation, setCurrentOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // 获取当前屏幕方向
    getCurrentOrientation();

    // 监听屏幕方向变化
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setCurrentOrientation(event.orientationInfo.orientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const getCurrentOrientation = async () => {
    try {
      const orientation = await ScreenOrientation.getOrientationAsync();
      setCurrentOrientation(orientation);
    } catch (error) {
      console.error('获取屏幕方向失败:', error);
    }
  };

  const lockToPortrait = async () => {
    try {
      const isSupported = await ScreenOrientation.supportsOrientationLockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      if (!isSupported) {
        console.error('竖屏锁定不支持');
        return;
      }
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsLocked(true);
    } catch (error) {
      console.error('锁定竖屏失败:', error);
    }
  };

  const lockToLandscape = async () => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsLocked(true);
    } catch (error) {
      console.error('锁定横屏失败:', error);
    }
  };

  const getOrientationText = (orientation: ScreenOrientation.Orientation | null) => {
    if (!orientation) return '未知';
    switch (orientation) {
      case ScreenOrientation.Orientation.PORTRAIT_UP:
        return '竖屏（正向）';
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return '竖屏（倒置）';
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return '横屏（左转）';
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return '横屏（右转）';
      default:
        return '未知';
    }
  };

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">屏幕方向</Text>
        <Text className="text-secondary-foreground">控制和响应设备屏幕方向的变化。</Text>
      </View>

      {/* 当前方向显示 */}
      <View className="bg-muted rounded-lg p-4 mb-6">
        <Text>当前屏幕方向: {getOrientationText(currentOrientation)}</Text>
        <Text>状态: {isLocked ? '已手动锁定' : '未手动锁定'}</Text>
      </View>

      {/* 方向控制按钮 */}
      <View className="flex gap-3">
        <Button
          onPress={currentOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ? lockToLandscape : lockToPortrait}
        >
          <Text>{currentOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ? '切换横屏' : '切换竖屏'}</Text>
        </Button>
      </View>
    </View>
  );
}
