import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoNavigationBarScreen() {
  const [visibility, setVisibility] = useState<NavigationBar.NavigationBarVisibility>('visible');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [behavior, setBehavior] = useState<NavigationBar.NavigationBarBehavior>('inset-touch');
  const [position, setPosition] = useState<NavigationBar.NavigationBarPosition>('relative');
  const [buttonStyle, setButtonStyle] = useState<NavigationBar.NavigationBarButtonStyle>('dark');
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
        <Text className="text-lg font-bold mb-2">导航栏控制</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何控制和管理导航栏的样式和行为。</Text>
      </View>

      {/* 导航栏可见性控制 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">可见性控制</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={toggleVisibility}
        >
          <Ionicons name={visibility === 'visible' ? 'eye-off' : 'eye'} size={20} color="white" />
          <Text className="text-white ml-2">{visibility === 'visible' ? '隐藏导航栏' : '显示导航栏'}</Text>
        </TouchableOpacity>
      </View>

      {/* 背景颜色控制 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">背景颜色</Text>
        <View className="flex-row justify-between">
          {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'].map((color) => (
            <TouchableOpacity
              key={color}
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: color }}
              onPress={() => changeBackgroundColor(color)}
            />
          ))}
        </View>
      </View>

      {/* 行为模式控制 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">行为模式</Text>
        <View className="flex-row justify-between">
          {(['overlay-swipe', 'inset-swipe', 'inset-touch'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              className={`p-4 rounded-lg ${behavior === mode ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => changeBehavior(mode)}
            >
              <Text className={behavior === mode ? 'text-white' : 'text-gray-600'}>
                {mode === 'overlay-swipe' ? '覆盖滑动' : mode === 'inset-swipe' ? '嵌入滑动' : '嵌入触摸'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 位置控制 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">位置</Text>
        <View className="flex-row justify-between">
          {(['relative', 'absolute'] as const).map((pos) => (
            <TouchableOpacity
              key={pos}
              className={`p-4 rounded-lg ${position === pos ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => changePosition(pos)}
            >
              <Text className={position === pos ? 'text-white' : 'text-gray-600'}>
                {pos === 'absolute' ? '绝对定位' : '相对定位'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 按钮样式控制 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">按钮样式</Text>
        <View className="flex-row justify-between">
          {(['light', 'dark'] as const).map((style) => (
            <TouchableOpacity
              key={style}
              className={`p-4 rounded-lg ${buttonStyle === style ? 'bg-blue-500' : 'bg-gray-200'}`}
              onPress={() => changeButtonStyle(style)}
            >
              <Text className={buttonStyle === style ? 'text-white' : 'text-gray-600'}>
                {style === 'light' ? '浅色' : '深色'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 错误提示 */}
      {error ? (
        <View className="bg-red-100 rounded-lg p-4 mb-8">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 可见性控制：显示或隐藏导航栏
          {'\n'}2. 背景颜色：更改导航栏的背景颜色
          {'\n'}3. 行为模式：控制导航栏与内容的交互方式
          {'\n'}4. 位置：控制导航栏的定位方式
          {'\n'}5. 按钮样式：控制导航栏按钮的颜色
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-navigation-bar
          {'\n'}2. 此功能仅在 Android 平台上可用
          {'\n'}3. 建议在真机上测试
          {'\n'}4. 某些设备可能有特殊的行为限制
        </Text>
      </View>
    </ScrollView>
  );
}
