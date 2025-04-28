import { Ionicons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoPedometerScreen() {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [stepCount, setStepCount] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);

  useEffect(() => {
    checkAvailability();
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, []);

  const checkAvailability = async () => {
    try {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);
      if (!available) {
        Alert.alert('提示', '此设备不支持计步功能');
      }
    } catch (error) {
      console.error('检查计步器可用性失败:', error);
      Alert.alert('错误', '检查计步器可用性失败');
    }
  };

  const startTracking = async () => {
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 1);

      const result = await Pedometer.getStepCountAsync(start, end);
      setStepCount(result.steps);
      setIsTracking(true);

      const subscription = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
      });

      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.error('开始计步失败:', error);
      Alert.alert('错误', '开始计步失败');
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setStepCount(0);
  };

  if (!isAvailable) {
    return (
      <View className="flex-1 p-6 justify-center items-center">
        <Text className="text-lg">此设备不支持计步功能</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">计步器</Text>
        <Text className="text-gray-600 mb-4">此功能用于获取用户的步数和行走距离。需要设备支持计步传感器。</Text>
      </View>

      <View className="space-y-6">
        <View className="p-4 bg-gray-100 rounded-lg">
          <Text className="text-base mb-2">今日步数</Text>
          <Text className="text-3xl font-bold">{stepCount}</Text>
        </View>

        <View className="space-y-4">
          {!isTracking ? (
            <TouchableOpacity
              className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
              onPress={startTracking}
            >
              <Ionicons name="play" size={20} color="white" />
              <Text className="text-white ml-2 text-lg">开始计步</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
              onPress={stopTracking}
            >
              <Ionicons name="stop" size={20} color="white" />
              <Text className="text-white ml-2 text-lg">停止计步</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要设备支持计步传感器
          {'\n'}2. 步数统计可能有误差
          {'\n'}3. 距离计算基于平均步长估算
        </Text>
      </View>
    </ScrollView>
  );
}
