import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { Album, Asset, AssetField, MediaType, Query, usePermissions } from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

type AssetItem = {
  id: string;
  uri: string;
};

export default function ExpoMediaLibraryScreen() {
  const [permissionResponse, requestPermission] = usePermissions();
  const [selectedAlbumTitle, setSelectedAlbumTitle] = useState<string | null>(null);
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<ImagePickerAsset | null>(null);

  useEffect(() => {
    if (permissionResponse?.granted) {
      void loadAlbums();
    } else if (permissionResponse) {
      void requestPermission();
    }
  }, [permissionResponse?.granted]);

  const loadAlbums = async () => {
    try {
      const fetchedAlbums = await Album.getAll();
      if (fetchedAlbums.length > 0) {
        const firstAlbum = fetchedAlbums[0];
        setSelectedAlbumTitle(await firstAlbum.getTitle());
        await loadAssets(firstAlbum);
      }
    } catch (error) {
      console.error('加载相册失败:', error);
      Alert.alert('错误', '加载相册失败');
    }
  };

  const loadAssets = async (album: Album) => {
    try {
      const fetchedAssets = await new Query().album(album).eq(AssetField.MEDIA_TYPE, MediaType.IMAGE).limit(20).exe();

      const assetsWithUri = await Promise.all(
        fetchedAssets.map(async (asset) => ({
          id: asset.id,
          uri: await asset.getUri(),
        }))
      );

      setAssets(assetsWithUri);
    } catch (error) {
      console.error('加载媒体文件失败:', error);
      Alert.alert('错误', '加载媒体文件失败');
    }
  };

  const createAlbum = async () => {
    try {
      const albumName = `相册_${Date.now()}`;
      const album = await Album.create(albumName, []);
      Alert.alert('成功', `已创建相册: ${await album.getTitle()}`);
      await loadAlbums();
    } catch (error) {
      console.error('创建相册失败:', error);
      Alert.alert('错误', '创建相册失败');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedAsset(result.assets[0]);
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      Alert.alert('错误', '选择图片失败');
    }
  };

  if (!permissionResponse?.granted) {
    return (
      <View className="flex-1 p-5 justify-center items-center bg-muted m-6">
        <Text className="text-lg mb-4">需要媒体库访问权限</Text>
        <Button onPress={requestPermission}>
          <Text>请求权限</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">媒体库访问</Text>
        <Text className="text-muted-foreground">访问设备媒体库，可以查看相册、图片，并创建新的相册。</Text>
      </View>

      <View className="flex gap-3 mb-6">
        <Button onPress={createAlbum}>
          <Text>创建新相册</Text>
        </Button>

        <Button onPress={pickImage}>
          <Text>选择图片</Text>
        </Button>
      </View>

      {selectedAlbumTitle && (
        <>
          <Text className="text-lg font-medium mb-2">选择的相册: {selectedAlbumTitle}</Text>
          <FlatList
            data={assets}
            numColumns={3}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Image source={{ uri: item.uri }} className="flex-1 h-32 m-1 p-1 border rounded-lg" contentFit="cover" />
            )}
          />
        </>
      )}

      {selectedAsset && (
        <>
          <Text className="text-lg font-medium mb-2">选择的图片: {selectedAsset.fileName}</Text>
          <Image source={{ uri: selectedAsset.uri }} className="h-32 p-1 border rounded-lg" contentFit="cover" />
        </>
      )}
    </View>
  );
}
