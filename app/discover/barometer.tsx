import { Barometer } from 'expo-sensors';
import { BarometerMeasurement } from 'expo-sensors/build/Barometer';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '../../components/ui/text';

// 自定义类型定义
type SubscriptionType = { remove: () => void };

/**
 * 气压计示例组件
 * 展示当前设备气压传感器数据，并记录历史变化
 */
export default function BarometerScreen() {
  // 当前气压数据状态
  const [data, setData] = useState<BarometerMeasurement>({
    pressure: 0,
    relativeAltitude: null as any,
    timestamp: Date.now(),
  });

  // 气压监测开关状态
  const [isMonitoring, setIsMonitoring] = useState(false);

  // 气压传感器订阅对象
  const [subscription, setSubscription] = useState<SubscriptionType | null>(null);

  // 停止监测气压数据
  const stopMonitoring = () => {
    subscription?.remove();
    setSubscription(null);
    setIsMonitoring(false);
  };

  // 开始监测气压数据
  const startMonitoring = () => {
    // 设置数据更新频率为1秒
    Barometer.setUpdateInterval(1000);

    // 订阅气压传感器数据
    const sub = Barometer.addListener((barometerData) => {
      setData(barometerData);
    });

    setSubscription(sub as unknown as SubscriptionType);
    setIsMonitoring(true);
  };

  // 组件挂载和卸载时的处理
  useEffect(() => {
    startMonitoring();

    // 组件卸载时取消订阅
    return () => {
      stopMonitoring();
    };
  }, []);

  // 格式化当前气压值，保留两位小数
  const formattedPressure = data.pressure.toFixed(2);

  // 格式化相对高度（如果有）
  const formattedAltitude = data.relativeAltitude ? data.relativeAltitude.toFixed(2) : '不可用';

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">气压计</Text>
        <Text className="text-muted-foreground">使用设备气压计传感器监测环境气压变化。</Text>
      </View>

      {/* 当前气压数据 */}
      <View className="bg-blue-50 rounded-xl p-5 mb-6 items-center">
        <View className="flex-row items-center justify-center mb-2">
          <Text className="text-lg font-medium ml-2 text-gray-700">当前气压 (hPa)</Text>
        </View>
        <Text className="text-4xl font-bold text-blue-600 my-2">{formattedPressure}</Text>

        {data.relativeAltitude !== null && (
          <View className="mt-4 items-center">
            <Text className="text-md font-medium text-gray-700">相对海拔 (m)</Text>
            <Text className="text-2xl font-medium text-blue-500 mt-1">{formattedAltitude}</Text>
          </View>
        )}
      </View>

      {/* 控制按钮 */}
      <View className="flex-row justify-center mb-8">
        <TouchableOpacity
          className={`py-3 px-8 rounded-full mx-2 ${isMonitoring ? 'bg-red-500' : 'bg-blue-500'}`}
          onPress={isMonitoring ? stopMonitoring : startMonitoring}
        >
          <Text className="text-white font-medium">{isMonitoring ? '停止监测' : '开始监测'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
