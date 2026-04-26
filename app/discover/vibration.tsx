import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import { Alert, Platform, ScrollView, Vibration, View } from 'react-native';

import { InfoItemRow } from '@/components/InfoItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

interface VibrationHistory {
  id: string;
  timestamp: Date;
  type: 'vibration' | 'haptics';
  method: string;
  parameters?: any;
}

export default function VibrationScreen() {
  const [isVibrating, setIsVibrating] = useState(false);
  const [customDuration, setCustomDuration] = useState('1000');
  const [customPattern, setCustomPattern] = useState('100,200,300');
  const [vibrationHistory, setVibrationHistory] = useState<VibrationHistory[]>([]);

  const vibrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 添加到历史记录
  const addToHistory = (type: 'vibration' | 'haptics', method: string, parameters?: any) => {
    const historyItem: VibrationHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      method,
      parameters,
    };

    setVibrationHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // 保留最新10条
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 原生 Vibration API 方法
  const handleSimpleVibration = () => {
    try {
      Vibration.vibrate();
      addToHistory('vibration', 'vibrate', { duration: 'default' });
    } catch (error) {
      Alert.alert('错误', '设备不支持震动功能');
    }
  };

  const handleCustomDurationVibration = () => {
    try {
      const duration = parseInt(customDuration);
      if (isNaN(duration) || duration <= 0) {
        Alert.alert('错误', '请输入有效的持续时间（毫秒）');
        return;
      }

      if (Platform.OS === 'android') {
        Vibration.vibrate(duration);
        addToHistory('vibration', 'vibrate', { duration });
      } else {
        // iOS 只支持固定时长的震动
        Vibration.vibrate();
        addToHistory('vibration', 'vibrate', { duration: 'default (iOS)' });
        Alert.alert('提示', 'iOS 只支持默认时长震动');
      }
    } catch (error) {
      Alert.alert('错误', '震动失败');
    }
  };

  const handlePatternVibration = () => {
    try {
      const patternStr = customPattern.trim();
      if (!patternStr) {
        Alert.alert('错误', '请输入震动模式');
        return;
      }

      const pattern = patternStr
        .split(',')
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));
      if (pattern.length === 0) {
        Alert.alert('错误', '请输入有效的震动模式（用逗号分隔的数字）');
        return;
      }

      if (Platform.OS === 'android') {
        Vibration.vibrate(pattern);
        addToHistory('vibration', 'vibrate', { pattern });
      } else {
        // iOS 不支持自定义模式
        Vibration.vibrate();
        addToHistory('vibration', 'vibrate', { pattern: 'default (iOS)' });
        Alert.alert('提示', 'iOS 不支持自定义震动模式，使用默认震动');
      }
    } catch (error) {
      Alert.alert('错误', '震动失败');
    }
  };

  const startContinuousVibration = () => {
    try {
      if (isVibrating) {
        stopContinuousVibration();
        return;
      }

      setIsVibrating(true);

      if (Platform.OS === 'android') {
        // Android 支持无限重复
        Vibration.vibrate([100, 100], true);
        addToHistory('vibration', 'vibrate', { repeat: true });
      } else {
        // iOS 模拟连续震动
        const vibrationPattern = () => {
          Vibration.vibrate();
          vibrationTimeoutRef.current = setTimeout(vibrationPattern, 200);
        };
        vibrationPattern();
        addToHistory('vibration', 'vibrate (continuous simulation)', { repeat: true });
      }
    } catch (error) {
      Alert.alert('错误', '启动连续震动失败');
      setIsVibrating(false);
    }
  };

  const stopContinuousVibration = () => {
    try {
      Vibration.cancel();
      if (vibrationTimeoutRef.current) {
        clearTimeout(vibrationTimeoutRef.current);
        vibrationTimeoutRef.current = null;
      }
      setIsVibrating(false);
      addToHistory('vibration', 'cancel', {});
    } catch (error) {
      Alert.alert('错误', '停止震动失败');
    }
  };

  // Expo Haptics API 方法
  const handleLightHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      addToHistory('haptics', 'impactAsync', { style: 'Light' });
    } catch (error) {
      Alert.alert('错误', '设备不支持触觉反馈');
    }
  };

  const handleMediumHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addToHistory('haptics', 'impactAsync', { style: 'Medium' });
    } catch (error) {
      Alert.alert('错误', '设备不支持触觉反馈');
    }
  };

  const handleHeavyHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      addToHistory('haptics', 'impactAsync', { style: 'Heavy' });
    } catch (error) {
      Alert.alert('错误', '设备不支持触觉反馈');
    }
  };

  const handleSuccessHaptic = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addToHistory('haptics', 'notificationAsync', { type: 'Success' });
    } catch (error) {
      Alert.alert('错误', '设备不支持触觉反馈');
    }
  };

  const handleWarningHaptic = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      addToHistory('haptics', 'notificationAsync', { type: 'Warning' });
    } catch (error) {
      Alert.alert('错误', '设备不支持触觉反馈');
    }
  };

  const handleErrorHaptic = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      addToHistory('haptics', 'notificationAsync', { type: 'Error' });
    } catch (error) {
      Alert.alert('错误', '设备不支持触觉反馈');
    }
  };

  const handleSelectionHaptic = async () => {
    try {
      await Haptics.selectionAsync();
      addToHistory('haptics', 'selectionAsync', {});
    } catch (error) {
      Alert.alert('错误', '设备不支持触觉反馈');
    }
  };

  // 清空历史记录
  const clearHistory = () => {
    setVibrationHistory([]);
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">震动与触觉反馈</Text>
        <Text className="text-muted-foreground">
          演示 React Native Vibration API 和 Expo Haptics 的各种震动和触觉反馈功能
        </Text>
      </View>

      {/* React Native Vibration API */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">React Native Vibration API</Text>
        <Text className="text-sm text-muted-foreground mb-4">原生震动 API，支持简单震动和自定义模式</Text>

        <View className="gap-3">
          <Button onPress={handleSimpleVibration} className="w-full">
            <Text>简单震动</Text>
          </Button>

          <View>
            <Text className="text-sm font-medium mb-2">自定义持续时间（毫秒）</Text>
            <View className="flex-row gap-3">
              <Input
                className="flex-1"
                placeholder="1000"
                value={customDuration}
                onChangeText={setCustomDuration}
                keyboardType="numeric"
              />
              <Button onPress={handleCustomDurationVibration}>
                <Text>震动</Text>
              </Button>
            </View>
            <Text className="text-xs text-muted-foreground mt-1">注：iOS 只支持默认时长</Text>
          </View>

          <View>
            <Text className="text-sm font-medium mb-2">震动模式（逗号分隔）</Text>
            <View className="flex-row gap-3">
              <Input
                className="flex-1"
                placeholder="100,200,300"
                value={customPattern}
                onChangeText={setCustomPattern}
              />
              <Button onPress={handlePatternVibration}>
                <Text>震动</Text>
              </Button>
            </View>
            <Text className="text-xs text-muted-foreground mt-1">
              模式：[等待, 震动, 等待, 震动...]，注：iOS 不支持自定义模式
            </Text>
          </View>

          <Button
            onPress={startContinuousVibration}
            variant={isVibrating ? 'destructive' : 'default'}
            className="w-full"
          >
            <Text>{isVibrating ? '停止连续震动' : '开始连续震动'}</Text>
          </Button>
        </View>
      </Card>

      {/* Expo Haptics API */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">Expo Haptics API</Text>
        <Text className="text-sm text-muted-foreground mb-4">
          高级触觉反馈 API，提供更丰富的反馈类型（主要支持 iOS）
        </Text>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium mb-2">冲击反馈（Impact Feedback）</Text>
            <View className="flex-row gap-2">
              <Button className="flex-1" onPress={handleLightHaptic}>
                <Text className="text-xs">轻微</Text>
              </Button>
              <Button className="flex-1" onPress={handleMediumHaptic}>
                <Text className="text-xs">中等</Text>
              </Button>
              <Button className="flex-1" onPress={handleHeavyHaptic}>
                <Text className="text-xs">强烈</Text>
              </Button>
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium mb-2">通知反馈（Notification Feedback）</Text>
            <View className="flex-row gap-2">
              <Button className="flex-1" onPress={handleSuccessHaptic}>
                <Text className="text-xs">成功</Text>
              </Button>
              <Button className="flex-1" onPress={handleWarningHaptic}>
                <Text className="text-xs">警告</Text>
              </Button>
              <Button className="flex-1" onPress={handleErrorHaptic}>
                <Text className="text-xs">错误</Text>
              </Button>
            </View>
          </View>

          <Button onPress={handleSelectionHaptic} className="w-full">
            <Text>选择反馈（Selection Feedback）</Text>
          </Button>
        </View>
      </Card>

      {/* 平台信息 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">平台兼容性</Text>
        <InfoItemRow label="当前平台" value={Platform.OS} />
        <InfoItemRow label="平台版本" value={Platform.Version} />
        <View className="mt-3 gap-2">
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">Android</Text>：完整支持 Vibration API，基础支持 Haptics
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">iOS</Text>：限制的 Vibration API，完整支持 Haptics
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">Web</Text>：浏览器限制，可能不支持震动
          </Text>
        </View>
      </Card>

      {/* 操作历史 */}
      <Card className="p-4 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-medium">操作历史 ({vibrationHistory.length})</Text>
          {vibrationHistory.length > 0 && (
            <Button variant="outline" size="sm" onPress={clearHistory}>
              <Text>清空</Text>
            </Button>
          )}
        </View>

        {vibrationHistory.length > 0 ? (
          <View className="gap-2">
            {vibrationHistory.map((item) => (
              <View key={item.id} className="border border-border rounded-lg p-3">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="font-medium text-sm">
                    {item.type === 'vibration' ? '📳 Vibration' : '🔄 Haptics'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</Text>
                </View>
                <Text className="text-sm text-muted-foreground">方法：{item.method}</Text>
                {item.parameters && (
                  <Text className="text-xs text-muted-foreground mt-1">参数：{JSON.stringify(item.parameters)}</Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-center text-muted-foreground py-8">暂无操作记录，点击上方按钮体验震动效果</Text>
        )}
      </Card>

      {/* 使用说明 */}
      <Card className="p-4 mb-6">
        <Text className="text-lg font-medium mb-3">使用说明</Text>
        <View className="gap-2">
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">Vibration API</Text>：React Native 原生震动接口
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">Haptics API</Text>：Expo 提供的高级触觉反馈
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">平台差异</Text>：Android 和 iOS 支持的功能不完全相同
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">静音模式</Text>：部分设备在静音模式下可能不震动
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
