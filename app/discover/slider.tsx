import Slider from '@react-native-community/slider';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function ExpoSliderScreen() {
  const [basicValue, setBasicValue] = useState(70);
  const [stepValue, setStepValue] = useState(1);

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">滑块控件</Text>
        <Text className="text-muted-foreground">实现可交互的值范围选择控件。</Text>
      </View>

      {/* 基本滑块 */}
      <View className="mb-6">
        <Text className="font-medium mb-2">基本滑块, {basicValue.toFixed(1)}</Text>
        <View className="rounded-lg p-4 bg-muted">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={100}
            value={basicValue}
            onValueChange={setBasicValue}
            minimumTrackTintColor="#333"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#333"
          />
        </View>
      </View>

      {/* 带步长的滑块 */}
      <View className="mb-6">
        <Text className="font-medium mb-2">带步长的滑块, {stepValue}</Text>
        <View className="rounded-lg p-4 bg-muted">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={stepValue}
            onValueChange={setStepValue}
            minimumTrackTintColor="#333"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#333"
          />
        </View>
      </View>
    </View>
  );
}
