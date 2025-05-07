import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoStatusBarScreen() {
  const [isHidden, setIsHidden] = useState(false);
  const [style, setStyle] = useState<'light' | 'dark'>('light');
  const [backgroundColor, setBackgroundColor] = useState('#169fe6');
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
    setBackgroundColor(backgroundColor === '#169fe6' ? '#000000' : '#169fe6');
  };

  // 切换半透明效果
  const toggleTranslucent = () => {
    setTranslucent(!translucent);
  };

  return (
    <View className="flex-1 p-5">
      <StatusBar animated hidden={isHidden} style={style} backgroundColor={backgroundColor} translucent={translucent} />

      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">状态栏</Text>
        <Text className="text-muted-foreground">控制状态栏的样式和行为</Text>
      </View>

      {/* 状态栏控制 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">状态栏控制</Text>
        <View className="gap-3">
          {/* 可见性控制 */}
          <Button onPress={toggleVisibility}>
            <Text>{isHidden ? '显示状态栏' : '隐藏状态栏'}</Text>
          </Button>

          {/* 样式控制 */}
          <Button onPress={toggleStyle}>
            <Text>切换为{style === 'light' ? '深色' : '浅色'}样式</Text>
          </Button>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">仅限 Android</Text>
        <View className="gap-3">
          {/* 背景颜色控制 */}
          <Button onPress={toggleBackgroundColor} disabled={Platform.OS !== 'android'}>
            <Text>切换背景颜色</Text>
          </Button>

          {/* 半透明控制 */}
          <Button onPress={toggleTranslucent} disabled={Platform.OS !== 'android'}>
            <Text>{translucent ? '禁用' : '启用'}半透明效果</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
