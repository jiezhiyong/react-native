import { Ionicons } from '@expo/vector-icons';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from 'react';
import { Platform, ScrollView, StatusBar, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ExpoSystemUIScreen() {
  const [statusBarStyle, setStatusBarStyle] = useState<'light' | 'dark'>('dark');
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const colorScheme = useColorScheme();

  useEffect(() => {
    // 设置系统 UI 样式
    SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [backgroundColor]);

  const toggleStatusBarStyle = () => {
    setStatusBarStyle(statusBarStyle === 'light' ? 'dark' : 'light');
  };

  const toggleStatusBarVisibility = () => {
    setStatusBarHidden(!statusBarHidden);
  };

  const changeBackgroundColor = () => {
    setBackgroundColor(backgroundColor === '#ffffff' ? '#000000' : '#ffffff');
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">系统界面</Text>
        <Text className="text-secondary-foreground">适配和利用系统界面元素和样式。</Text>
      </View>

      <StatusBar
        barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
        hidden={statusBarHidden}
        backgroundColor={backgroundColor}
      />
      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">系统 UI 功能</Text>
          <Text className="text-secondary-foreground">使用系统 UI 相关功能。</Text>
        </View>

        {/* 状态栏样式 */}
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">状态栏样式</Text>
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={toggleStatusBarStyle}
          >
            <Ionicons name={statusBarStyle === 'light' ? 'sunny' : 'moon'} size={20} color="white" />
            <Text className="text-white ml-2">切换为{statusBarStyle === 'light' ? '深色' : '浅色'}样式</Text>
          </TouchableOpacity>
        </View>

        {/* 状态栏可见性 */}
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">状态栏可见性</Text>
          <TouchableOpacity
            className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={toggleStatusBarVisibility}
          >
            <Ionicons name={statusBarHidden ? 'eye' : 'eye-off'} size={20} color="white" />
            <Text className="text-white ml-2">{statusBarHidden ? '显示' : '隐藏'}状态栏</Text>
          </TouchableOpacity>
        </View>

        {/* 背景颜色 */}
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">背景颜色</Text>
          <TouchableOpacity
            className="bg-purple-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={changeBackgroundColor}
          >
            <Ionicons name="color-palette" size={20} color="white" />
            <Text className="text-white ml-2">切换背景颜色</Text>
          </TouchableOpacity>
        </View>

        {/* 系统信息 */}
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">系统信息</Text>
          <View className="bg-white rounded-lg p-4">
            <Text className="text-secondary-foreground mb-2">系统主题: {colorScheme}</Text>
            <Text className="text-secondary-foreground mb-2">平台: {Platform.OS}</Text>
            <Text className="text-secondary-foreground">版本: {Platform.Version}</Text>
          </View>
        </View>

        {/* 说明区域 */}
        <View className="bg-gray-100 rounded-lg p-4">
          <Text className="text-base font-semibold mb-2">使用说明</Text>
          <Text className="text-secondary-foreground">
            1. 支持状态栏样式控制
            {'\n'}2. 支持状态栏可见性控制
            {'\n'}3. 支持背景颜色设置
            {'\n'}4. 支持系统主题检测
          </Text>
        </View>

        <View className="mt-6">
          <Text className="text-sm text-gray-500">
            注意：
            {'\n'}1. 需要安装 expo-system-ui
            {'\n'}2. 不同平台可能有不同限制
            {'\n'}3. 状态栏样式影响用户体验
            {'\n'}4. 背景颜色变化会立即生效
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
