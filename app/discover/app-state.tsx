import React, { useEffect, useState } from 'react';
import { Appearance, AppState, AppStateStatus, ColorSchemeName, ScrollView, View } from 'react-native';

import { InfoItemRow } from '@/components/InfoItem';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

interface StateHistoryItem {
  timestamp: Date;
  from: AppStateStatus | 'initial';
  to: AppStateStatus;
}

interface ThemeHistoryItem {
  timestamp: Date;
  from: ColorSchemeName | 'initial';
  to: ColorSchemeName;
}

export default function AppStateScreen() {
  const [currentAppState, setCurrentAppState] = useState<AppStateStatus>(AppState.currentState);
  const [currentColorScheme, setCurrentColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');
  const [appStateHistory, setAppStateHistory] = useState<StateHistoryItem[]>([]);
  const [themeHistory, setThemeHistory] = useState<ThemeHistoryItem[]>([]);

  useEffect(() => {
    // AppState 监听器
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = currentAppState;
      setCurrentAppState(nextAppState);

      // 记录状态变化历史
      setAppStateHistory((prev) => [
        {
          timestamp: new Date(),
          from: prev.length === 0 ? 'initial' : previousState,
          to: nextAppState,
        },
        ...prev.slice(0, 9), // 只保留最新的10条记录
      ]);
    };

    // Appearance 监听器
    const handleColorSchemeChange = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      const previousScheme = currentColorScheme;
      setCurrentColorScheme(colorScheme ?? 'light');

      // 记录主题变化历史
      setThemeHistory((prev) => [
        {
          timestamp: new Date(),
          from: prev.length === 0 ? 'initial' : previousScheme,
          to: colorScheme ?? 'light',
        },
        ...prev.slice(0, 9), // 只保留最新的10条记录
      ]);
    };

    // 添加监听器
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    const themeSubscription = Appearance.addChangeListener(handleColorSchemeChange);

    // 清理函数
    return () => {
      appStateSubscription?.remove();
      themeSubscription?.remove();
    };
  }, [currentAppState, currentColorScheme]);

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 获取状态显示文本
  const getAppStateText = (state: AppStateStatus) => {
    switch (state) {
      case 'active':
        return '前台活跃';
      case 'background':
        return '后台运行';
      case 'inactive':
        return '非活跃状态';
      default:
        return state;
    }
  };

  // 获取主题显示文本
  const getColorSchemeText = (scheme: ColorSchemeName) => {
    if (scheme === 'dark') return '深色模式';
    if (scheme === 'light') return '浅色模式';
    return '未知/自动';
  };

  // 获取状态颜色
  const getAppStateColor = (state: AppStateStatus | 'initial') => {
    if (state === 'active') return 'text-green-600';
    if (state === 'background') return 'text-orange-600';
    if (state === 'inactive') return 'text-red-600';
    return 'text-muted-foreground';
  };

  // 获取主题颜色
  const getColorSchemeColor = (scheme: ColorSchemeName | 'initial') => {
    if (scheme === 'dark') return 'text-primary';
    if (scheme === 'light') return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">AppState + Appearance</Text>
        <Text className="text-muted-foreground">监听应用状态变化和系统外观主题变化，实时显示当前状态和历史记录</Text>
      </View>

      {/* 当前状态 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">当前状态</Text>
        <InfoItemRow label="应用状态" value={getAppStateText(currentAppState)} />
        <InfoItemRow label="系统主题" value={getColorSchemeText(currentColorScheme)} />
      </Card>

      {/* 应用状态变化历史 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">应用状态变化历史</Text>
        {appStateHistory.length > 0 ? (
          <View className="space-y-2">
            {appStateHistory.map((item, index) => (
              <View key={index} className="border-b border-border pb-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground">{formatTime(item.timestamp)}</Text>
                  <View className="flex-row items-center">
                    <Text className={`text-sm ${getAppStateColor(item.from)}`}>
                      {item.from === 'initial' ? '初始' : getAppStateText(item.from as AppStateStatus)}
                    </Text>
                    <Text className="text-sm text-muted-foreground mx-2">→</Text>
                    <Text className={`text-sm ${getAppStateColor(item.to)}`}>{getAppStateText(item.to)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-muted-foreground text-center py-4">暂无状态变化记录，请尝试切换应用到后台或前台</Text>
        )}
      </Card>

      {/* 主题变化历史 */}
      <Card className="p-4 mb-6">
        <Text className="text-lg font-medium mb-3">系统主题变化历史</Text>
        {themeHistory.length > 0 ? (
          <View className="space-y-2">
            {themeHistory.map((item, index) => (
              <View key={index} className="border-b border-border pb-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground">{formatTime(item.timestamp)}</Text>
                  <View className="flex-row items-center">
                    <Text className={`text-sm ${getColorSchemeColor(item.from)}`}>
                      {item.from === 'initial' ? '初始' : getColorSchemeText(item.from as ColorSchemeName)}
                    </Text>
                    <Text className="text-sm text-muted-foreground mx-2">→</Text>
                    <Text className={`text-sm ${getColorSchemeColor(item.to)}`}>{getColorSchemeText(item.to)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-muted-foreground text-center py-4">暂无主题变化记录，请尝试切换系统深色/浅色模式</Text>
        )}
      </Card>

      {/* 使用说明 */}
      <Card className="p-4 mb-6">
        <Text className="text-lg font-medium mb-3">使用说明</Text>
        <View className="space-y-2">
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">应用状态监听</Text>：切换应用到后台/前台观察状态变化
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">主题监听</Text>：在系统设置中切换深色/浅色模式观察变化
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">实时更新</Text>：所有变化都会实时反映在界面上
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">历史记录</Text>：保留最近10次状态变化的时间和详情
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
