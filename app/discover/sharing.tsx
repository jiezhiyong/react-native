import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoSharingScreen() {
  const [shareText, setShareText] = useState('分享这段文本');
  const [shareResult, setShareResult] = useState('');

  const shareTextContent = async () => {
    try {
      await Sharing.shareAsync(shareText);
      setShareResult(`分享结果: Success`);
    } catch (error: any) {
      setShareResult(`分享失败: ${error.message}`);
    }
  };

  const shareImage = async () => {
    try {
      // 创建一个临时图片文件
      const imageUrl = 'https://picsum.photos/200/300';
      const fileUri = `${FileSystem.cacheDirectory}temp-image.jpg`;

      // 下载图片
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

      // 分享图片
      await Sharing.shareAsync(uri);
      setShareResult(`分享结果: Success`);
    } catch (error: any) {
      setShareResult(`分享失败: ${error.message}`);
    }
  };

  const shareFile = async () => {
    try {
      // 创建一个临时文本文件
      const fileUri = `${FileSystem.cacheDirectory}temp-file.txt`;
      await FileSystem.writeAsStringAsync(fileUri, '这是一个测试文件内容');

      // 分享文件
      await Sharing.shareAsync(fileUri);
      setShareResult(`分享结果: Success`);
    } catch (error: any) {
      setShareResult(`分享失败: ${error.message}`);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">内容分享</Text>
        <Text className="text-secondary-foreground">实现应用内容的分享功能。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">分享功能</Text>
        <Text className="text-secondary-foreground">使用 Expo 的分享功能。</Text>
      </View>

      {/* 分享文本 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">分享文本</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="输入要分享的文本"
          value={shareText}
          onChangeText={setShareText}
        />
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={shareTextContent}
        >
          <Ionicons name="share-social" size={20} color="white" />
          <Text className="text-white ml-2">分享文本</Text>
        </TouchableOpacity>
      </View>

      {/* 分享图片 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">分享图片</Text>
        <Image source={{ uri: 'https://picsum.photos/200/300' }} className="w-full h-48 rounded-lg mb-4" />
        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={shareImage}
        >
          <Ionicons name="image" size={20} color="white" />
          <Text className="text-white ml-2">分享图片</Text>
        </TouchableOpacity>
      </View>

      {/* 分享文件 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">分享文件</Text>
        <TouchableOpacity
          className="bg-purple-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={shareFile}
        >
          <Ionicons name="document" size={20} color="white" />
          <Text className="text-white ml-2">分享文件</Text>
        </TouchableOpacity>
      </View>

      {/* 分享结果 */}
      {shareResult ? (
        <View className="bg-muted rounded-lg p-4 mb-8">
          <Text className="text-base font-medium mb-2">分享结果</Text>
          <Text className="text-secondary-foreground">{shareResult}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-muted rounded-lg p-4">
        <Text className="text-base font-medium mb-2">使用说明</Text>
        <Text className="text-secondary-foreground">
          1. 支持文本分享
          {'\n'}2. 支持图片分享
          {'\n'}3. 支持文件分享
          {'\n'}4. 支持分享结果反馈
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-sharing 和 expo-file-system
          {'\n'}2. 分享功能依赖于系统分享菜单
          {'\n'}3. 不同平台支持的文件类型可能不同
          {'\n'}4. 分享大文件时注意性能
        </Text>
      </View>
    </ScrollView>
  );
}
