import { ResizeMode, Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { ArrowLeft, Download, Share2, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MediaViewerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ url: string; type: string }>();
  const { url, type } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setMediaStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [hasPermission, setHasPermission] = useState(false);

  // 检查权限
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      }
    })();
  }, []);

  // 关闭查看器
  const handleClose = () => {
    router.back();
  };

  // 处理媒体加载完成
  const handleMediaLoad = () => {
    setIsLoading(false);
  };

  // 处理媒体加载错误
  const handleMediaError = (error: any) => {
    console.error('媒体加载失败:', error);
    setError('无法加载媒体内容');
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
        if (status !== 'granted') {
          setError('需要存储权限才能保存媒体');
          return;
        }
        setHasPermission(true);
      }

      setIsLoading(true);

      // 创建临时文件
      const fileExtension = url.split('.').pop() || (type === 'image' ? 'jpg' : 'mp4');
      const fileUri = `${FileSystem.cacheDirectory}temp_media.${fileExtension}`;

      // 下载文件
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

      if (downloadResult.status !== 200) {
        setError('下载媒体失败');
        setIsLoading(false);
        return;
      }

      // 保存到媒体库
      const asset = await MediaLibrary.saveToLibraryAsync(fileUri);
      console.log('媒体已保存到设备:', asset);

      // 清理临时文件
      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      setIsLoading(false);
      alert('媒体已成功保存到设备');
    } catch (err) {
      console.error('保存媒体失败:', err);
      setError('保存媒体时出错');
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

      // 创建临时文件
      const fileExtension = url.split('.').pop() || (type === 'image' ? 'jpg' : 'mp4');
      const fileUri = `${FileSystem.cacheDirectory}temp_share.${fileExtension}`;

      // 下载文件
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

      if (downloadResult.status !== 200) {
        setError('下载媒体失败');
        setIsLoading(false);
        return;
      }

      // 分享文件
      await Sharing.shareAsync(fileUri);

      // 清理临时文件
      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      setIsLoading(false);
    } catch (err) {
      console.error('分享媒体失败:', err);
      setError('分享媒体时出错');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* 顶部导航栏 */}
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center p-4">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-black bg-opacity-50 items-center justify-center"
          onPress={handleClose}
        >
          {Platform.OS === 'ios' ? <X size={24} color="#fff" /> : <ArrowLeft size={24} color="#fff" />}
        </TouchableOpacity>

        <View className="flex-row">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-black bg-opacity-50 items-center justify-center mr-2"
            onPress={handleDownload}
          >
            <Download size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-black bg-opacity-50 items-center justify-center"
            onPress={handleShare}
          >
            <Share2 size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 媒体内容 */}
      <View className="flex-1 justify-center items-center">
        {isLoading && <ActivityIndicator size="large" color="#fff" />}

        {error && (
          <View className="p-4 bg-red-500 bg-opacity-70 rounded-lg">
            <Text className="text-white text-center">{error}</Text>
          </View>
        )}

        {url && type === 'image' && !error && (
          <Image
            source={{ uri: url }}
            className="w-full h-full"
            resizeMode="contain"
            onLoad={handleMediaLoad}
            onError={() => handleMediaError('图片加载失败')}
          />
        )}

        {url && type === 'video' && !error && (
          <Video
            source={{ uri: url }}
            className="w-full h-full"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            isLooping
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                if (status.isPlaying) {
                  setMediaStatus('playing');
                } else {
                  setMediaStatus('paused');
                }
                if (isLoading) {
                  setIsLoading(false);
                }
              }
            }}
            onError={() => handleMediaError('视频加载失败')}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
