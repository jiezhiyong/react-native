import Checkbox from 'expo-checkbox';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Text } from '../../components/ui/text';

export default function ExpoCheckboxScreen() {
  // 基础复选框状态
  const [isChecked, setIsChecked] = useState(true);

  // 不同颜色的复选框状态
  const [colorStates, setColorStates] = useState({
    red: true,
    green: true,
  });

  // 更新颜色复选框状态
  const updateColorState = (key: keyof typeof colorStates, value: boolean) => {
    setColorStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">复选框</Text>
        <Text className="text-muted-foreground">实现和自定义交互式复选框组件。</Text>
      </View>

      {/* 基本用法 */}
      <View className="mb-6">
        <Text className="text-xl font-medium text-foreground mb-2">基本用法</Text>
        <View className="flex-row items-center mb-4">
          <Checkbox value={isChecked} onValueChange={setIsChecked} className="mr-2 size-5" />
          <Text className="text-foreground">我接受服务条款 ({isChecked ? '已选择' : '未选择'})</Text>
        </View>
      </View>

      {/* 不同颜色 */}
      <View className="mb-6">
        <Text className="text-xl font-medium text-foreground mb-2">不同颜色</Text>

        <View className="flex-row items-center mb-2">
          <Checkbox
            value={colorStates.red}
            onValueChange={(value) => updateColorState('red', value)}
            color={colorStates.red ? '#ef4444' : undefined}
            className="mr-2 size-5"
          />
          <Text className="text-foreground">红色</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Checkbox
            value={colorStates.green}
            onValueChange={(value) => updateColorState('green', value)}
            color={colorStates.green ? '#22c55e' : undefined}
            className="mr-2 size-5"
          />
          <Text className="text-foreground">绿色</Text>
        </View>
      </View>

      {/* 禁用状态 */}
      <View className="mb-6">
        <Text className="text-xl font-medium text-foreground mb-2">禁用状态</Text>

        <View className="flex-row items-center mb-2">
          <Checkbox value={false} disabled={true} className="mr-2 size-5 opacity-50" />
          <Text className="text-muted-foreground">禁用状态（未选中）</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Checkbox value={true} disabled={true} className="mr-2 size-5 opacity-50" />
          <Text className="text-muted-foreground">禁用状态（已选中）</Text>
        </View>
      </View>
    </View>
  );
}
