import { File } from 'expo-file-system';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import { PermissionStatus } from 'expo-modules-core';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Download, Share2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from '@/components/ActivityIndicator';

export default function MediaViewerScreen() {
  const params = useLocalSearchParams<{ url: string; type: string }>();
  const { url, type } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // 初始化视频播放器
  const player = useVideoPlayer(url, (player) => {
    player.loop = false;
    player.play();
  });

  // 检查权限
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setHasPermission(status === PermissionStatus.GRANTED);
      }
    })();
  }, []);

  // 处理媒体加载完成
  const handleMediaLoad = () => {
    setIsLoading(false);
  };

  // 处理媒体加载错误
  const handleMediaError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  // 下载媒体到设备
  const handleDownload = async () => {
    try {
      if (!url) {
        setError('无效的媒体URL');
        return;
      }

      if (!hasPermission) {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== PermissionStatus.GRANTED) {
          setError('需要存储权限才能保存媒体');
          return;
        }
        setHasPermission(true);
      }

      setIsLoading(true);

      // 保存到媒体库
      const file = new File(url);
      await MediaLibrary.saveToLibraryAsync(file.uri);
      setIsLoading(false);
      alert('媒体已成功保存到设备');
    } catch (err) {
      setError((err as Error)?.message);
      setIsLoading(false);
    }
  };

  // 分享媒体
  const handleShare = async () => {
    try {
      if (!url) {
        setError('无效的媒体URL');
        return;
      }

      setIsLoading(true);

      // 检查是否可以分享
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        setError('此设备不支持分享功能');
        setIsLoading(false);
        return;
      }

      // 分享文件
      const file = new File(url);
      await Sharing.shareAsync(file.uri);

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Stack.Screen
        options={{
          title: '媒体预览',
          headerRight: () => (
            <View className="flex-row">
              <TouchableOpacity className="items-center justify-center mr-4" onPress={handleDownload}>
                <Download size={20} />
              </TouchableOpacity>

              <TouchableOpacity className="items-center justify-center" onPress={handleShare}>
                <Share2 size={20} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* 媒体内容 */}
      <View className="flex-1 justify-center items-center">
        {isLoading && (
          <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-black/70 p-4 rounded-lg">
            <ActivityIndicator color="#faf9f5" />
          </View>
        )}

        {error && (
          <View className="p-4 rounded-lg bg-destructive/70">
            <Text className="text-center text-white">{error}</Text>
          </View>
        )}

        {url && type === 'image' && !error && (
          <Image
            source={{ uri: url }}
            className="w-full h-full"
            contentFit="contain"
            onLoad={handleMediaLoad}
            onError={() => handleMediaError('图片加载失败')}
          />
        )}

        {url && type === 'video' && !error && (
          <View style={styles.videoContainer}>
            <VideoView style={styles.video} player={player} allowsPictureInPicture />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
