import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function ExpoSliderScreen() {
  const [basicValue, setBasicValue] = useState(0);
  const [stepValue, setStepValue] = useState(0);
  const [customValue, setCustomValue] = useState(0);

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">滑块功能</Text>
        <Text className="text-gray-600 mb-4">
          此功能展示了如何使用 React Native 的滑块组件。
        </Text>
      </View>

      {/* 基本滑块 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">基本滑块</Text>
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-gray-600 mb-2">当前值: {basicValue.toFixed(1)}</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            value={basicValue}
            onValueChange={setBasicValue}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#3B82F6"
          />
        </View>
      </View>

      {/* 带步长的滑块 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">带步长的滑块</Text>
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-gray-600 mb-2">当前值: {stepValue}</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={stepValue}
            onValueChange={setStepValue}
            minimumTrackTintColor="#10B981"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#10B981"
          />
        </View>
      </View>

      {/* 自定义样式滑块 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">自定义样式滑块</Text>
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-gray-600 mb-2">当前值: {customValue.toFixed(1)}</Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            value={customValue}
            onValueChange={setCustomValue}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#8B5CF6"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-500">0</Text>
            <Text className="text-gray-500">50</Text>
            <Text className="text-gray-500">100</Text>
          </View>
        </View>
      </View>

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 支持基本滑块功能
          {'\n'}2. 支持设置步长
          {'\n'}3. 支持自定义样式
          {'\n'}4. 支持实时值显示
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 @react-native-community/slider
          {'\n'}2. 不同平台样式可能略有差异
          {'\n'}3. 支持手势操作
          {'\n'}4. 可以自定义最小值和最大值
        </Text>
      </View>
    </ScrollView>
  );
}
