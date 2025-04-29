import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoWebBrowserScreen() {
  const [url, setUrl] = useState('https://expo.dev');
  const [browserResult, setBrowserResult] = useState('');
  const [error, setError] = useState('');

  // 打开内置浏览器
  const openBrowser = async () => {
    try {
      setError('');
      const result = await WebBrowser.openBrowserAsync(url, {
        toolbarColor: '#2196F3',
        controlsColor: '#FFFFFF',
        dismissButtonStyle: 'close',
        enableBarCollapsing: true,
        showTitle: true,
      });
      setBrowserResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setError('打开浏览器失败');
    }
  };

  // 打开认证页面
  const openAuthSession = async () => {
    try {
      setError('');
      const result = await WebBrowser.openAuthSessionAsync('https://expo.dev', 'expo://');
      setBrowserResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setError('打开认证页面失败');
    }
  };

  // 打开自定义浏览器
  const openCustomBrowser = async () => {
    try {
      setError('');
      const result = await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: '#4CAF50',
        controlsColor: '#FFFFFF',
        dismissButtonStyle: 'done',
        enableBarCollapsing: false,
        showTitle: false,
      });
      setBrowserResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setError('打开自定义浏览器失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">网页浏览器</Text>
        <Text className="text-secondary-foreground">在应用内集成网页浏览功能。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">内置浏览器</Text>
        <Text className="text-secondary-foreground">使用内置浏览器打开网页。</Text>
      </View>

      {/* URL 输入 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">URL 输入</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          value={url}
          onChangeText={setUrl}
          placeholder="输入 URL"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* 打开浏览器 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">打开浏览器</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
          onPress={openBrowser}
        >
          <Ionicons name="globe" size={20} color="white" />
          <Text className="text-white ml-2">打开内置浏览器</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
          onPress={openAuthSession}
        >
          <Ionicons name="lock-closed" size={20} color="white" />
          <Text className="text-white ml-2">打开认证页面</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-purple-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={openCustomBrowser}
        >
          <Ionicons name="options" size={20} color="white" />
          <Text className="text-white ml-2">打开自定义浏览器</Text>
        </TouchableOpacity>
      </View>

      {/* 浏览器结果 */}
      {browserResult ? (
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">浏览器结果</Text>
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-secondary-foreground">{browserResult}</Text>
          </View>
        </View>
      ) : null}

      {/* 错误提示 */}
      {error ? (
        <View className="bg-red-100 rounded-lg p-4 mb-8">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-secondary-foreground">
          1. 支持打开内置浏览器
          {'\n'}2. 支持打开认证页面
          {'\n'}3. 支持自定义浏览器样式
          {'\n'}4. 支持处理浏览器事件
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-web-browser
          {'\n'}2. 支持自定义浏览器样式
          {'\n'}3. 支持处理浏览器事件
          {'\n'}4. 建议使用 HTTPS URL
        </Text>
      </View>
    </ScrollView>
  );
}
