import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';

export default function ExpoSharingScreen() {
  const [shareText, setShareText] = useState('有内鬼，终止交易');
  const [shareResult, setShareResult] = useState('');

  const shareTextContent = async () => {
    try {
      await Sharing.shareAsync(shareText);
      setShareResult(`分享结果: Success`);
    } catch (error: any) {
      setShareResult(error.message);
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
      setShareResult(error.message);
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
      setShareResult(error.message);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">分享功能</Text>
        <Text className="text-secondary-foreground">实现应用内容的分享功能。</Text>
      </View>

      {/* 分享文本 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">分享文本</Text>
        <Input placeholder="" value={shareText} onChangeText={setShareText} />
        <Button onPress={shareTextContent} className="mt-3">
          <Text>分享文本</Text>
        </Button>
      </View>

      {/* 分享图片 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">分享图片</Text>
        <Image source={require('~/assets/images/icon.png')} className="w-full h-40 rounded-lg mb-3" />
        <Button onPress={shareImage}>
          <Text>分享图片</Text>
        </Button>
      </View>

      {/* 分享文件 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">分享文件</Text>
        <Button onPress={shareFile}>
          <Text>分享文件</Text>
        </Button>
      </View>

      {/* 分享结果 */}
      {shareResult ? (
        <>
          <Text className="text-lg font-medium mb-2">分享结果</Text>
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-secondary-foreground">{shareResult}</Text>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}
