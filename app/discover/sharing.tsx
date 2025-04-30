import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const imageUrl = 'https://qachat.expo.app/assets/assets/images/background-image.503001f14bb7b8fe48a4e318ad07e910.png';

export default function ExpoSharingScreen() {
  const [loading, setLoading] = useState(false);
  const [shareResult, setShareResult] = useState('');

  const shareImage = async () => {
    try {
      setLoading(true);
      // 创建一个临时图片文件
      const fileUri = `${FileSystem.cacheDirectory}temp-image.jpg`;

      // 下载图片
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

      // 分享图片
      await Sharing.shareAsync(uri);
    } catch (error: any) {
      setShareResult(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const shareFile = async () => {
    try {
      setLoading(true);
      // 创建一个临时文本文件
      const fileUri = `${FileSystem.cacheDirectory}temp-file.txt`;
      await FileSystem.writeAsStringAsync(fileUri, '这是一个测试文件内容');

      // 分享文件
      await Sharing.shareAsync(fileUri);
    } catch (error: any) {
      setShareResult(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">分享功能</Text>
        <Text className="text-muted-foreground">实现应用内容的分享功能。</Text>
      </View>

      {shareResult && (
        <View className="mb-6">
          <Text className="font-medium mb-2">分享结果</Text>
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-muted-foreground">{shareResult}</Text>
          </View>
        </View>
      )}

      {/* 分享图片 */}
      <View className="mb-6">
        <Text className="font-medium mb-2">分享图片</Text>
        <Image source={{ uri: imageUrl }} className="w-full h-40 rounded-lg mb-3" />
        <Button onPress={shareImage} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text>分享图片</Text>}
        </Button>
      </View>

      {/* 分享文件 */}
      <View className="mb-6">
        <Text className="font-medium mb-2">分享文件</Text>
        <Button onPress={shareFile} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text>分享文件</Text>}
        </Button>
      </View>
    </View>
  );
}
