import Constants from 'expo-constants';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';

import { Text } from '../../components/ui/text';

export default function ExpoConstantsScreen() {
  // 设备和系统信息

  const deviceName = Constants.deviceName || '未知';
  const statusBarHeight = Constants.statusBarHeight || 0;
  const sessionId = Constants.sessionId || '未知';
  const systemFonts = Constants.systemFonts || [];

  // 应用信息
  const debugMode = Constants.debugMode;
  const executionEnvironment = Constants.executionEnvironment || '未知';

  // 构建卡片数据
  const cards = [
    {
      title: '应用信息',
      items: [
        { label: '运行环境', value: executionEnvironment },
        { label: '调试模式', value: debugMode ? '是' : '否' },
      ],
    },
    {
      title: '设备信息',
      items: [
        { label: '平台名称', value: Platform.OS },
        { label: '平台版本', value: Platform.Version?.toString() || '未知' },
        { label: '设备名称', value: deviceName },
      ],
    },
    {
      title: '其他',
      items: [
        { label: '会话ID', value: sessionId },
        { label: '状态栏高度', value: statusBarHeight.toString() + 'px' },
        { label: '系统字体数量', value: systemFonts.length.toString() + '种' },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">常量和配置</Text>
        <Text className="text-muted-foreground">访问和使用设备和平台相关的常量信息。</Text>
      </View>

      {cards.map((card, index) => (
        <View key={index} className="mb-6">
          <View className="">
            <Text className="text-lg font-bold">{card.title}</Text>
            <View className="">
              {card.items.map((item, itemIndex) => (
                <View key={itemIndex} className="py-3 flex-row justify-between border-b border-border gap-5">
                  <Text className="text-muted-foreground">{item.label}</Text>
                  <Text className="text-foreground">{String(item.value)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}

      <View className="">
        <Text className="text-sm text-muted-foreground">
          注意：某些信息在不同环境下可能显示为"未知"，这是正常现象。在生产环境和开发环境中，某些常量值可能会有所不同。
        </Text>
      </View>
    </ScrollView>
  );
}
