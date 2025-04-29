import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoStatusBarScreen() {
  const [isHidden, setIsHidden] = useState(false);
  const [style, setStyle] = useState<'light' | 'dark'>('light');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [translucent, setTranslucent] = useState(false);

  // 切换状态栏可见性
  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  // 切换状态栏样式
  const toggleStyle = () => {
    setStyle(style === 'light' ? 'dark' : 'light');
  };

  // 切换背景颜色
  const toggleBackgroundColor = () => {
    setBackgroundColor(backgroundColor === '#000000' ? '#ffffff' : '#000000');
  };

  // 切换半透明效果
  const toggleTranslucent = () => {
    setTranslucent(!translucent);
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Status Bar</Text>
        <Text className="text-secondary-foreground">使用和配置 Status Bar 相关功能。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">状态栏</Text>
        <Text className="text-secondary-foreground">控制状态栏的样式和行为。</Text>
      </View>

      {/* 状态栏控制 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">状态栏控制</Text>
        <View className="space-y-4">
          {/* 可见性控制 */}
          <TouchableOpacity className="bg-blue-500 rounded-lg p-4 flex-row items-center" onPress={toggleVisibility}>
            <Ionicons name={isHidden ? 'eye-off' : 'eye'} size={20} color="white" />
            <Text className="text-white ml-2">{isHidden ? '显示状态栏' : '隐藏状态栏'}</Text>
          </TouchableOpacity>

          {/* 样式控制 */}
          <TouchableOpacity className="bg-purple-500 rounded-lg p-4 flex-row items-center" onPress={toggleStyle}>
            <Ionicons name={style === 'light' ? 'moon' : 'sunny'} size={20} color="white" />
            <Text className="text-white ml-2">切换为{style === 'light' ? '深色' : '浅色'}样式</Text>
          </TouchableOpacity>

          {/* 背景颜色控制 */}
          <TouchableOpacity
            className="bg-green-500 rounded-lg p-4 flex-row items-center"
            onPress={toggleBackgroundColor}
          >
            <Ionicons name="color-palette" size={20} color="white" />
            <Text className="text-white ml-2">切换背景颜色</Text>
          </TouchableOpacity>

          {/* 半透明控制 */}
          {Platform.OS === 'android' && (
            <TouchableOpacity
              className="bg-orange-500 rounded-lg p-4 flex-row items-center"
              onPress={toggleTranslucent}
            >
              <Ionicons name="contrast" size={20} color="white" />
              <Text className="text-white ml-2">{translucent ? '禁用' : '启用'}半透明效果</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 状态栏预览 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">状态栏预览</Text>
        <View className="h-12 rounded-lg overflow-hidden" style={{ backgroundColor }}>
          <StatusBar hidden={isHidden} style={style} backgroundColor={backgroundColor} translucent={translucent} />
        </View>
      </View>

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-secondary-foreground">
          1. 控制状态栏的可见性
          {'\n'}2. 切换状态栏的样式（浅色/深色）
          {'\n'}3. 更改状态栏的背景颜色
          {'\n'}4. 控制半透明效果（仅 Android）
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 半透明效果仅在 Android 上可用
          {'\n'}2. 某些设备可能有特殊的状态栏行为
          {'\n'}3. 建议在真机上测试
          {'\n'}4. 某些设置可能需要重启应用才能生效
        </Text>
      </View>
    </ScrollView>
  );
}
