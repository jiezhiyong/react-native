import { Image, ImageBackground } from 'expo-image';
import React, { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// 不同的图片填充模式
const CONTENT_FITS = [
  { label: '包含', value: 'contain' },
  { label: '覆盖', value: 'cover' },
  { label: '填充', value: 'fill' },
  { label: '缩放自适应', value: 'scale-down' },
];

// https://docs.expo.dev/versions/latest/sdk/image/
export default function ExpoImageScreen() {
  const [currentFit, setCurrentFit] = useState('cover');

  // 切换图片填充模式
  const cycleFitMode = () => {
    const currentIndex = CONTENT_FITS.findIndex((fit) => fit.value === currentFit);
    const nextIndex = (currentIndex + 1) % CONTENT_FITS.length;
    setCurrentFit(CONTENT_FITS[nextIndex].value);
  };

  // 获取当前填充模式的中文描述
  const getCurrentFitLabel = () => {
    return CONTENT_FITS.find((fit) => fit.value === currentFit)?.label || '';
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">图像显示</Text>
        <Text className="text-muted-foreground">加载和显示各种来源的图像内容。</Text>
      </View>

      <Text className="text-lg font-medium mb-2">基本图像（当前模式: {getCurrentFitLabel()}）</Text>
      <View className="mb-6 flex-col gap-3">
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ minHeight: 150, borderRadius: 6, backgroundColor: '#eaeaea' }}
          contentFit={currentFit as any}
          transition={500}
        />
        <Button onPress={cycleFitMode}>
          <Text>切换填充模式</Text>
        </Button>
      </View>

      <Text className="text-lg font-medium mb-2">图像背景 (ImageBackground)</Text>
      <View className="flex-col gap-3">
        <ImageBackground
          source={require('@/assets/images/avatar.jpg')}
          contentFit="cover"
          style={{ borderRadius: 6, overflow: 'hidden' }}
        >
          <View className="bg-black/50 justify-center items-center h-[150px]">
            <Text className="text-white">为子组件提供背景图片</Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
