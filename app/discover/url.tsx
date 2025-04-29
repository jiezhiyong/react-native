import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoUrlScreen() {
  const [url, setUrl] = useState('https://expo.dev');
  const [canOpen, setCanOpen] = useState(false);
  const [lastOpenedUrl, setLastOpenedUrl] = useState('');
  const [error, setError] = useState('');

  // 检查 URL 是否可以打开
  const checkUrl = async () => {
    try {
      setError('');
      const canOpenUrl = await Linking.canOpenURL(url);
      setCanOpen(canOpenUrl);
    } catch (error) {
      setError('检查 URL 失败');
    }
  };

  // 使用系统浏览器打开 URL
  const openInBrowser = async () => {
    try {
      setError('');
      await WebBrowser.openBrowserAsync(url);
      setLastOpenedUrl(url);
    } catch (error) {
      setError('打开 URL 失败');
    }
  };

  // 使用系统默认应用打开 URL
  const openInSystem = async () => {
    try {
      setError('');
      await Linking.openURL(url);
      setLastOpenedUrl(url);
    } catch (error) {
      setError('打开 URL 失败');
    }
  };

  // 监听 URL 变化
  useEffect(() => {
    checkUrl();
  }, [url]);

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Url</Text>
        <Text className="text-secondary-foreground">使用和配置 Url 相关功能。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">URL 功能</Text>
        <Text className="text-secondary-foreground">使用 URL 相关功能。</Text>
      </View>

      {/* URL 输入 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">URL 输入</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          value={url}
          onChangeText={setUrl}
          placeholder="输入 URL"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text className="text-secondary-foreground">URL 状态: {canOpen ? '可以打开' : '无法打开'}</Text>
      </View>

      {/* 打开 URL */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">打开 URL</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={openInBrowser}
            disabled={!canOpen}
          >
            <Ionicons name="globe" size={20} color="white" />
            <Text className="text-white ml-2">在浏览器中打开</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={openInSystem}
            disabled={!canOpen}
          >
            <Ionicons name="open" size={20} color="white" />
            <Text className="text-white ml-2">在系统中打开</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 最近打开的 URL */}
      {lastOpenedUrl ? (
        <View className="mb-8">
          <Text className="text-base font-medium mb-4">最近打开的 URL</Text>
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-secondary-foreground">{lastOpenedUrl}</Text>
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
      <View className="bg-muted rounded-lg p-4">
        <Text className="text-base font-medium mb-2">使用说明</Text>
        <Text className="text-secondary-foreground">
          1. 支持检查 URL 是否可以打开
          {'\n'}2. 支持在浏览器中打开 URL
          {'\n'}3. 支持在系统应用中打开 URL
          {'\n'}4. 支持错误处理
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-web-browser
          {'\n'}2. 某些 URL 可能无法打开
          {'\n'}3. 需要适当的权限
          {'\n'}4. 建议使用 HTTPS URL
        </Text>
      </View>
    </ScrollView>
  );
}
