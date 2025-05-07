import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import React, { useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

/**
 * CaptureRef 示例页面
 * 使用 react-native-view-shot 捕获视图截图
 */
export default function CaptureRefScreen() {
  // 要捕获的视图的引用
  const viewRef = useRef<View>(null);
  // 截图的URI
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  // 媒体库权限
  const [status, requestPermission] = MediaLibrary.usePermissions();

  // 请求媒体库权限
  React.useEffect(() => {
    if (status === null) {
      requestPermission();
    }
  }, [status, requestPermission]);

  /**
   * 捕获视图的截图并保存
   */
  const captureImage = async () => {
    try {
      // 检查是否有权限访问媒体库
      if (status?.granted !== true) {
        Alert.alert('需要权限', '保存图片需要访问您的媒体库');
        return;
      }

      // 确保viewRef存在
      if (!viewRef.current) {
        Alert.alert('错误', '无法捕获视图');
        return;
      }

      // 使用captureRef捕获视图引用
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      // 保存截图到媒体库
      await MediaLibrary.saveToLibraryAsync(uri);

      // 设置截图URI以在界面上显示
      setCapturedImage(uri);

      Alert.alert('成功', '截图已保存到相册');

      return uri;
    } catch (error) {
      console.error('截图失败:', error);
      Alert.alert('错误', '截图失败');
      return null;
    }
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">视图截图</Text>
        <Text className="text-muted-foreground">捕获和保存应用界面的特定区域为图片。</Text>
      </View>

      {/* 这个视图将被捕获 */}
      <View
        ref={viewRef}
        className="rounded-xl p-5 shadow-md mb-6 border border-gray-200 bg-background"
        collapsable={false} // 在Android上必须设置为false
      >
        <View className="items-center mb-4 rounded-lg overflow-hidden">
          <Image
            source={require('~/assets/images/icon.png')}
            style={{ width: '100%', height: 200 }}
            contentFit="cover"
          />
        </View>
        <Text className="font-medium mb-2">使用 captureRef 捕获视图</Text>
        <Text className="text-muted-foreground">
          这个整个卡片会被截图，包括所有的内容。您可以捕获任何React Native视图， 包括地图、图表、复杂UI等。
        </Text>
      </View>

      <Button onPress={captureImage}>
        <Text>截图并保存</Text>
      </Button>

      {/* 显示截图结果 */}
      {capturedImage && (
        <View className="mt-6">
          <Text className="font-medium mb-2 dark:text-white">截图结果</Text>
          <Image source={{ uri: capturedImage }} style={{ width: '100%', aspectRatio: 1 }} contentFit="contain" />
        </View>
      )}
    </ScrollView>
  );
}
