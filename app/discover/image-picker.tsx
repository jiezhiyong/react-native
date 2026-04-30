import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// https://docs.expo.dev/versions/latest/sdk/imagepicker/
export default function ExpoImagePickerScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<ImagePicker.PermissionStatus | null>(null);
  const [galleryPermissionStatus, setGalleryPermissionStatus] = useState<ImagePicker.PermissionStatus | null>(null);

  // 请求相机权限
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermissionStatus(status);
    return status;
  };

  // 请求图库权限
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermissionStatus(status);
    return status;
  };

  // 打开相机拍摄照片
  const takePicture = async () => {
    const status = cameraPermissionStatus || (await requestCameraPermission());

    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      alert('需要相机权限才能拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ['images'],
    });

    if (!result.canceled) {
      setImages([result.assets[0].uri]);
    }
  };

  // 从图库选择照片
  const pickImage = async () => {
    const status = galleryPermissionStatus || (await requestGalleryPermission());

    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      alert('需要图库权限才能选择照片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      mediaTypes: ['images'],
      selectionLimit: 2,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages(newImages);
    }
  };

  // 清除所有图片
  const clearImages = () => {
    setImages([]);
  };

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">图像选择器</Text>
        <Text className="text-muted-foreground">从设备相册选择图片或直接拍摄新照片。</Text>
      </View>

      <View className="flex-1">
        {images.length > 0 ? (
          <>
            <View className="flex-col gap-3 mb-6">
              {images.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={{ height: 150, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)' }}
                  contentFit="cover"
                />
              ))}
            </View>

            <Button onPress={clearImages} variant="destructive">
              <Text>清除图片</Text>
            </Button>
          </>
        ) : (
          <View className="items-center justify-center bg-muted rounded-lg p-4">
            <Text className="text-muted-foreground">尚未选择任何图片</Text>
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap gap-3">
        <Button className="flex-1" onPress={takePicture}>
          <Text>拍摄照片</Text>
        </Button>
        <Button className="flex-1" onPress={pickImage}>
          <Text>选择图片</Text>
        </Button>
      </View>
    </View>
  );
}
