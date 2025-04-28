import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      setIsLocked(true);
      Alert.alert('成功', '已锁定为竖屏');
    } catch (error) {
      console.error('锁定竖屏失败:', error);
      Alert.alert('错误', '锁定竖屏失败');
    }
  };

  const lockToLandscape = async () => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setIsLocked(true);
      Alert.alert('成功', '已锁定为横屏');
    } catch (error) {
      console.error('锁定横屏失败:', error);
      Alert.alert('错误', '锁定横屏失败');
    }
  };

  const unlockOrientation = async () => {
    try {
      await ScreenOrientation.unlockAsync();
      setIsLocked(false);
      Alert.alert('成功', '已解锁屏幕方向');
    } catch (error) {
      console.error('解锁屏幕方向失败:', error);
      Alert.alert('错误', '解锁屏幕方向失败');
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
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">屏幕方向控制</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何控制屏幕方向，包括锁定和解锁不同方向。</Text>
      </View>

      {/* 当前方向显示 */}
      <View className="bg-gray-100 rounded-lg p-4 mb-6">
        <Text className="text-base font-semibold mb-2">当前屏幕方向</Text>
        <Text className="text-lg">{getOrientationText(currentOrientation)}</Text>
        <Text className="text-sm text-gray-500 mt-2">状态: {isLocked ? '已锁定' : '未锁定'}</Text>
      </View>

      {/* 方向控制按钮 */}
      <View className="space-y-4">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={lockToPortrait}
        >
          <Ionicons name="phone-portrait" size={20} color="white" />
          <Text className="text-white ml-2">锁定为竖屏</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={lockToLandscape}
        >
          <Ionicons name="phone-landscape" size={20} color="white" />
          <Text className="text-white ml-2">锁定为横屏</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={unlockOrientation}
        >
          <Ionicons name="lock-closed" size={20} color="white" />
          <Text className="text-white ml-2">解锁屏幕方向</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 某些设备可能不支持所有方向
          {'\n'}2. 锁定方向后需要手动解锁才能切换
          {'\n'}3. 部分功能在模拟器上可能无法正常工作
        </Text>
      </View>
    </ScrollView>
  );
}
