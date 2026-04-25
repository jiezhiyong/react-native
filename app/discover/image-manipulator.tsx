import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import { SaveFormat, useImageManipulator } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// 默认图片
const defaultImage = Asset.fromModule(require('@/assets/images/icon.png'));

// https://docs.expo.dev/versions/latest/sdk/imagemanipulator/
export default function ExpoImageManipulatorScreen() {
  const [image, setImage] = useState<string | null>(defaultImage.uri);

  const context = useImageManipulator(image ?? '');

  // 选择图片
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 旋转图片
  const rotateImage = async () => {
    context.rotate(90);
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result.uri);
  };

  // 水平翻转图片
  const flipImage = async () => {
    context.flip(ImageManipulator.FlipType.Horizontal);
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result.uri);
  };

  // 裁剪图片
  const cropImage = async () => {
    context.crop({ originX: 0, originY: 0, width: 300, height: 300 });
    const image = await context.renderAsync();
    const result = await image.saveAsync({
      format: SaveFormat.PNG,
    });

    setImage(result.uri);
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">图像处理</Text>
        <Text className="text-muted-foreground">对图像进行裁剪、旋转和调整等编辑操作。</Text>
      </View>

      <View className="mb-3">
        <Text className="text-lg mb-2 font-medium">图片</Text>
        <Image source={{ uri: image! }} contentFit="cover" style={{ height: 200, borderRadius: 6 }} />
      </View>

      <Button className="mb-6" onPress={pickImage}>
        <Text>选择图片</Text>
      </Button>

      <Text className="text-lg mb-2 font-medium">操作</Text>
      <View className="flex-row flex-wrap gap-3 mb-6">
        <Button onPress={rotateImage} disabled={!image} className="flex-1">
          <Text>旋转90度</Text>
        </Button>
        <Button onPress={flipImage} disabled={!image} className="flex-1">
          <Text>水平翻转</Text>
        </Button>
        <Button onPress={cropImage} disabled={!image} className="flex-1">
          <Text>裁剪图片</Text>
        </Button>
      </View>
    </View>
  );
}
