import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { Check } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoNavigationBarScreen() {
  const [visibility, setVisibility] = useState<NavigationBar.NavigationBarVisibility>('visible');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [behavior, setBehavior] = useState<NavigationBar.NavigationBarBehavior>('overlay-swipe');
  const [position, setPosition] = useState<NavigationBar.NavigationBarPosition>('relative');
  const [buttonStyle, setButtonStyle] = useState<NavigationBar.NavigationBarButtonStyle>('light');
  const [error, setError] = useState('');

  // 初始化导航栏设置
  useEffect(() => {
    async function setupNavigationBar() {
      try {
        // 设置初始状态
        await NavigationBar.setBackgroundColorAsync(backgroundColor);
        await NavigationBar.setBehaviorAsync(behavior);
        await NavigationBar.setPositionAsync(position);
        await NavigationBar.setButtonStyleAsync(buttonStyle);
        await NavigationBar.setVisibilityAsync(visibility);
      } catch (error) {
        setError('导航栏初始化失败: ' + (error as Error).message);
      }
    }
    setupNavigationBar();
  }, []);

  // 切换导航栏可见性
  const toggleVisibility = async () => {
    try {
      const newVisibility = visibility === 'visible' ? 'hidden' : 'visible';
      await NavigationBar.setVisibilityAsync(newVisibility);
      setVisibility(newVisibility);
    } catch (error) {
      setError('切换导航栏可见性失败: ' + (error as Error).message);
    }
  };

  // 更改背景颜色
  const changeBackgroundColor = async (color: string) => {
    try {
      await NavigationBar.setBackgroundColorAsync(color);
      setBackgroundColor(color);
    } catch (error) {
      setError('更改背景颜色失败: ' + (error as Error).message);
    }
  };

  // 更改行为模式
  const changeBehavior = async (newBehavior: NavigationBar.NavigationBarBehavior) => {
    try {
      await NavigationBar.setBehaviorAsync(newBehavior);
      setBehavior(newBehavior);
    } catch (error) {
      setError('更改行为模式失败: ' + (error as Error).message);
    }
  };

  // 更改位置
  const changePosition = async (newPosition: NavigationBar.NavigationBarPosition) => {
    try {
      await NavigationBar.setPositionAsync(newPosition);
      setPosition(newPosition);
    } catch (error) {
      setError('更改位置失败: ' + (error as Error).message);
    }
  };

  // 更改按钮样式
  const changeButtonStyle = async (newStyle: NavigationBar.NavigationBarButtonStyle) => {
    try {
      await NavigationBar.setButtonStyleAsync(newStyle);
      setButtonStyle(newStyle);
    } catch (error) {
      setError('更改按钮样式失败: ' + (error as Error).message);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">导航栏</Text>
        <Text className="text-secondary-foreground">自定义和控制设备的导航栏样式和行为</Text>
      </View>

      {/* 导航栏可见性控制 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-2">可见性控制</Text>
        <Button onPress={toggleVisibility} className="flex-row">
          <Ionicons name={visibility === 'visible' ? 'eye-off' : 'eye'} size={20} color="white" />
          <Text className="text-white ml-2">{visibility === 'visible' ? '隐藏导航栏' : '显示导航栏'}</Text>
        </Button>
      </View>

      {/* 背景颜色控制 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-2">背景颜色</Text>
        <View className="flex-row justify-between">
          {['#ffffff', '#000000', '#ef4444', '#22c55e', '#3b82f6'].map((color) => (
            <TouchableOpacity
              key={color}
              className="size-14 rounded-full border justify-center items-center"
              style={{ backgroundColor: color }}
              onPress={() => changeBackgroundColor(color)}
            >
              {backgroundColor === color ? <Check /> : null}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 行为模式控制 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-2">行为模式</Text>
        <View className="flex-row justify-between gap-2">
          {(['overlay-swipe', 'inset-swipe', 'inset-touch'] as const).map((mode) => (
            <Button
              className="flex-1"
              key={mode}
              variant={behavior === mode ? 'default' : 'outline'}
              onPress={() => changeBehavior(mode)}
            >
              <Text>{mode === 'overlay-swipe' ? '覆盖滑动' : mode === 'inset-swipe' ? '嵌入滑动' : '嵌入触摸'}</Text>
            </Button>
          ))}
        </View>
      </View>

      {/* 位置控制 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-2">位置</Text>
        <View className="flex-row justify-between gap-2">
          {(['relative', 'absolute'] as const).map((pos) => (
            <Button
              key={pos}
              className="flex-1"
              variant={position === pos ? 'default' : 'outline'}
              onPress={() => changePosition(pos)}
            >
              <Text className={position === pos ? 'text-white' : 'text-secondary-foreground'}>
                {pos === 'absolute' ? '绝对定位' : '相对定位'}
              </Text>
            </Button>
          ))}
        </View>
      </View>

      {/* 按钮样式控制 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-2">按钮样式</Text>
        <View className="flex-row justify-between">
          {(['light', 'dark'] as const).map((style) => (
            <Button
              key={style}
              className="flex-1"
              variant={buttonStyle === style ? 'default' : 'outline'}
              onPress={() => changeButtonStyle(style)}
            >
              <Text className={buttonStyle === style ? 'text-white' : 'text-secondary-foreground'}>
                {style === 'light' ? '浅色' : '深色'}
              </Text>
            </Button>
          ))}
        </View>
      </View>

      {/* 错误提示 */}
      {error ? (
        <View>
          <Text className="text-base font-medium mb-2">错误提示</Text>
          <Text className="text-destructive">{error || '-'}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
