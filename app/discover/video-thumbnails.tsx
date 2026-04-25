import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { Image, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ExpoVideoThumbnailsScreen() {
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState('');
  const [error, setError] = useState('');

  // 从相册选择视频
  const pickVideo = async () => {
    try {
      setError('');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        setThumbnailUri(''); // 清除之前的缩略图
      }
    } catch (error) {
      setError(`选择视频失败: ${(error as Error).message}`);
    }
  };

  // 生成缩略图
  const generateThumbnail = async () => {
    try {
      setError('');
      if (!videoUri) {
        setError('请先选择视频');
        return;
      }

      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 3000, // 从视频第 3s 处获取缩略图
        quality: 0.8, // 缩略图质量
      });

      setThumbnailUri(uri);
    } catch (error) {
      setError(`生成缩略图失败: ${(error as Error).message}`);
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">视频缩略图</Text>
        <Text className="text-muted-foreground">从视频中提取缩略图</Text>
      </View>

      {/* 视频选择 */}
      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">视频选择</Text>
        <Button onPress={pickVideo}>
          <Text>从相册选择视频</Text>
        </Button>
        {videoUri ? (
          <Text className="text-sm text-muted-foreground mt-2">
            {videoUri.substring(videoUri.lastIndexOf('/') + 1)}
          </Text>
        ) : null}
      </View>

      {/* 生成缩略图 */}
      {videoUri && (
        <View className="mb-3">
          <Text className="text-lg font-medium mb-2">生成缩略图</Text>
          <Button onPress={generateThumbnail}>
            <Text>生成缩略图</Text>
          </Button>
        </View>
      )}

      {/* 缩略图预览 */}
      {thumbnailUri ? (
        <View className="mb-6">
          <Image
            source={{ uri: thumbnailUri }}
            style={{ width: '100%', height: 150 }}
            resizeMode="cover"
            className="border p-1 rounded-lg"
          />
        </View>
      ) : null}

      {/* 错误提示 */}
      {error ? (
        <View className="bg-destructive/10 rounded-lg p-4">
          <Text className="text-destructive">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
