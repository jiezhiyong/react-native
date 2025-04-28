import { Ionicons } from '@expo/vector-icons';
import * as TrackingTransparency from 'expo-tracking-transparency';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoTrackingTransparencyScreen() {
  const [trackingStatus, setTrackingStatus] = useState<string>('未知');

  useEffect(() => {
    checkTrackingStatus();
  }, []);

  const checkTrackingStatus = async () => {
    try {
      const status = await TrackingTransparency.getTrackingPermissionsAsync();
      setTrackingStatus(status.status);
    } catch (error) {
      console.error('获取跟踪状态失败:', error);
      setTrackingStatus('错误');
    }
  };

  const requestTrackingPermission = async () => {
    try {
      const { status } = await TrackingTransparency.requestTrackingPermissionsAsync();
      setTrackingStatus(status);

      if (status === 'granted') {
        Alert.alert('成功', '已获得跟踪权限');
      } else if (status === 'denied') {
        Alert.alert('提示', '用户拒绝了跟踪权限');
      }
    } catch (error) {
      console.error('请求跟踪权限失败:', error);
      Alert.alert('错误', '请求跟踪权限时出错');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'granted':
        return '已授权';
      case 'denied':
        return '已拒绝';
      case 'not-determined':
        return '未确定';
      default:
        return status;
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">跟踪透明度</Text>
        <Text className="text-gray-600 mb-4">
          此功能用于请求用户允许应用跟踪其活动。主要用于 iOS 14.5 及以上版本。
        </Text>
      </View>

      <View className="mb-6 p-4 bg-gray-100 rounded-lg">
        <Text className="text-base mb-2">当前跟踪状态</Text>
        <Text className="text-lg font-semibold">{getStatusText(trackingStatus)}</Text>
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
        onPress={requestTrackingPermission}
      >
        <Ionicons name="shield-checkmark" size={20} color="white" />
        <Text className="text-white ml-2 text-lg">请求跟踪权限</Text>
      </TouchableOpacity>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：此功能主要用于 iOS 设备。在 Android 设备上可能不会显示权限请求对话框。
        </Text>
      </View>
    </ScrollView>
  );
}
