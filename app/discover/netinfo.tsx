import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoNetInfoScreen() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [isWifiEnabled, setIsWifiEnabled] = useState<boolean | null>(null);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    // 获取初始网络状态
    checkNetworkStatus();

    // 订阅网络状态变化
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      setIsWifiEnabled(state.isWifiEnabled);
      setDetails(state.details);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const checkNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
      setConnectionType(state.type);
      setIsWifiEnabled(state.isWifiEnabled);
      setDetails(state.details);
    } catch (error) {
      console.error('获取网络状态失败:', error);
      Alert.alert('错误', '获取网络状态失败');
    }
  };

  const getConnectionIcon = () => {
    if (!isConnected) return 'cloud-offline';
    switch (connectionType) {
      case 'wifi':
        return 'wifi';
      case 'cellular':
        return 'cellular';
      case 'ethernet':
        return 'desktop';
      default:
        return 'cloud';
    }
  };

  const getConnectionColor = () => {
    if (!isConnected) return 'text-red-500';
    switch (connectionType) {
      case 'wifi':
        return 'text-green-500';
      case 'cellular':
        return 'text-blue-500';
      case 'ethernet':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getConnectionDetails = () => {
    if (!details) return null;

    switch (connectionType) {
      case 'wifi':
        return (
          <View className="mt-4">
            <Text className="text-gray-600">SSID: {details.ssid}</Text>
            <Text className="text-gray-600">BSSID: {details.bssid}</Text>
            <Text className="text-gray-600">信号强度: {details.strength}%</Text>
            <Text className="text-gray-600">频率: {details.frequency}MHz</Text>
          </View>
        );
      case 'cellular':
        return (
          <View className="mt-4">
            <Text className="text-gray-600">运营商: {details.carrier}</Text>
            <Text className="text-gray-600">蜂窝类型: {details.cellularGeneration}</Text>
            <Text className="text-gray-600">信号强度: {details.strength}%</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">网络信息</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何检测和监控网络连接状态。</Text>
      </View>

      {/* 网络状态卡片 */}
      <View className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <View className="flex-row items-center">
          <Ionicons name={getConnectionIcon()} size={32} className={getConnectionColor()} />
          <View className="ml-4">
            <Text className="text-lg font-semibold">{isConnected ? '已连接' : '未连接'}</Text>
            <Text className="text-gray-600">连接类型: {connectionType || '未知'}</Text>
          </View>
        </View>

        {getConnectionDetails()}
      </View>

      {/* 网络详情 */}
      <View className="bg-gray-100 rounded-lg p-4 mb-6">
        <Text className="text-base font-semibold mb-2">网络详情</Text>
        <View className="space-y-2">
          <Text className="text-gray-600">WiFi 状态: {isWifiEnabled ? '已启用' : '未启用'}</Text>
          <Text className="text-gray-600">连接类型: {connectionType || '未知'}</Text>
          <Text className="text-gray-600">是否连接: {isConnected ? '是' : '否'}</Text>
        </View>
      </View>

      {/* 操作按钮 */}
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
        onPress={checkNetworkStatus}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text className="text-white ml-2">刷新网络状态</Text>
      </TouchableOpacity>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 网络状态会实时更新
          {'\n'}2. 支持 WiFi 和蜂窝网络检测
          {'\n'}3. 可以获取详细的网络信息
          {'\n'}4. 需要相应的权限
        </Text>
      </View>
    </ScrollView>
  );
}
