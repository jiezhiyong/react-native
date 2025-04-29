import { useFonts } from 'expo-font';
import React from 'react';
import { View } from 'react-native';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

// 字体示例文本
const sampleText = '人生若只如初见，何事秋风悲画扇。等闲变却故人心，却道故人心易变。';
const sampleTextLatin = 'The quick brown fox jumps over the lazy dog.';

// 字体示例组件
const FontSample: React.FC<{ name: string }> = ({ name }) => {
  return (
    <Card className="mb-4 border-border">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-base flex-row items-center">
          <Text className="font-medium">{name}</Text>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <Text style={{ fontFamily: name }} className="text-base mb-2">
          {sampleText}
        </Text>
        <Text style={{ fontFamily: name }} className="text-base">
          {sampleTextLatin}
        </Text>
      </CardContent>
    </Card>
  );
};

export default function ExpoFontScreen() {
  const [fontsLoaded, fontError] = useFonts({
    spaceMono: require('~/assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 如果字体未加载完成，返回 null 不渲染内容
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 px-6 pt-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">字体管理</Text>
        <Text className="text-secondary-foreground">在应用中加载和使用自定义字体。</Text>
      </View>

      {fontError && (
        <View className="bg-destructive/10 p-3 rounded-md mb-4">
          <Text className="text-destructive">字体加载失败: {fontError?.message}</Text>
        </View>
      )}

      <FontSample name="default" />

      <FontSample name="spaceMono" />
    </View>
  );
}
