import { downloadAsync, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Image, View } from 'react-native';
import { ActivityIndicator } from '@/components/ActivityIndicator';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const imageUrl = 'https://qachat.expo.app/assets/assets/images/background-image.503001f14bb7b8fe48a4e318ad07e910.png';

export default function ExpoSharingScreen() {
  const [loading, setLoading] = useState(false);
  const [shareResult, setShareResult] = useState('');

  const shareImage = async () => {
    try {
      setLoading(true);
      const cacheDir = Paths.cache;
      const tempFile = new File(cacheDir, 'temp-image.jpg');

      await downloadAsync(imageUrl, tempFile.uri);
      await Sharing.shareAsync(tempFile.uri);
    } catch (error: unknown) {
      setShareResult(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const shareFile = async () => {
    try {
      setLoading(true);
      const cacheDir = Paths.cache;
      const tempFile = new File(cacheDir, 'temp-file.txt');
      await tempFile.create();
      await tempFile.write('这是一个测试文件内容');

      await Sharing.shareAsync(tempFile.uri);
    } catch (error: unknown) {
      setShareResult(JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">分享</Text>
        <Text className="text-muted-foreground">实现应用内容的分享功能。</Text>
      </View>

      {/* 分享图片 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">分享图片</Text>
        <Image source={{ uri: imageUrl }} className="w-full h-40 rounded-lg mb-3" />
        <Button onPress={shareImage} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text>分享图片</Text>}
        </Button>
      </View>

      {/* 分享文件 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">分享文件</Text>
        <Button onPress={shareFile} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text>分享文件</Text>}
        </Button>
      </View>

      {shareResult && (
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">分享结果</Text>
          <View className="bg-muted rounded-lg p-4">
            <Text className="text-muted-foreground">{shareResult}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
