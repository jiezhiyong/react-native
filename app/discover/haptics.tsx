import * as Haptics from 'expo-haptics';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Text } from '~/components/ui/text';

export default function ExpoHapticsScreen() {
  // 触发轻度触觉反馈
  const triggerLightHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // 触发中度触觉反馈
  const triggerMediumHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // 触发重度触觉反馈
  const triggerHeavyHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  // 触发成功触觉反馈
  const triggerSuccessHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // 触发警告触觉反馈
  const triggerWarningHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  // 触发错误触觉反馈
  const triggerErrorHaptic = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  // 触发选择触觉反馈
  const triggerSelectionHaptic = () => {
    Haptics.selectionAsync();
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">触觉反馈</Text>
        <Text className="text-secondary-foreground">
          使用触觉反馈增强用户交互体验，为不同的操作提供适当的振动反馈。
        </Text>
      </View>

      <View className="flex-col gap-3">
        <Text className="text-lg font-bold">触觉强度</Text>
        <Button onPress={triggerLightHaptic}>
          <Text>轻度反馈</Text>
        </Button>
        <Button onPress={triggerMediumHaptic}>
          <Text>中度反馈</Text>
        </Button>
        <Button onPress={triggerHeavyHaptic}>
          <Text>重度反馈</Text>
        </Button>
      </View>

      <Separator className="my-4" />

      <View className="flex-col gap-3">
        <Text className="text-lg font-bold">系统通知反馈</Text>
        <Text className="text-sm text-secondary-foreground">iOS 设备会触发不同类型的系统通知反馈</Text>
        <Button className="w-full bg-green-600" onPress={triggerSuccessHaptic}>
          <Text>成功反馈</Text>
        </Button>
        <Button className="w-full bg-yellow-600" onPress={triggerWarningHaptic}>
          <Text>警告反馈</Text>
        </Button>
        <Button className="w-full bg-red-600" onPress={triggerErrorHaptic}>
          <Text>错误反馈</Text>
        </Button>
      </View>

      <Separator className="my-4" />

      <View className="flex-col gap-3">
        <Text className="text-lg font-bold">选择反馈</Text>
        <Text className="text-sm text-secondary-foreground">轻微的触觉反馈，适用于用户选择项目时</Text>
        <Button onPress={triggerSelectionHaptic}>
          <Text>选择反馈</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
