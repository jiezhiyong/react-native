import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoMediaLibraryScreen() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<MediaLibrary.Album | null>(null);
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        loadAlbums();
      }
    } catch (error) {
      console.error('获取权限失败:', error);
      Alert.alert('错误', '获取媒体库权限失败');
    }
  };

  const loadAlbums = async () => {
    try {
      const fetchedAlbums = await MediaLibrary.getAlbumsAsync();
      setAlbums(fetchedAlbums);
      if (fetchedAlbums.length > 0) {
        setSelectedAlbum(fetchedAlbums[0]);
        loadAssets(fetchedAlbums[0]);
      }
    } catch (error) {
      console.error('加载相册失败:', error);
      Alert.alert('错误', '加载相册失败');
    }
  };

  const loadAssets = async (album: MediaLibrary.Album) => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: ['photo'],
        first: 20,
      });
      setAssets(assets);
    } catch (error) {
      console.error('加载媒体文件失败:', error);
      Alert.alert('错误', '加载媒体文件失败');
    }
  };

  const createAlbum = async () => {
    try {
      const albumName = `相册_${Date.now()}`;
      const album = await MediaLibrary.createAlbumAsync(albumName);
      Alert.alert('成功', `已创建相册: ${albumName}`);
      loadAlbums();
    } catch (error) {
      console.error('创建相册失败:', error);
      Alert.alert('错误', '创建相册失败');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && selectedAlbum) {
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
        loadAssets(selectedAlbum);
      }
    } catch (error) {
      console.error('选择图片失败:', error);
      Alert.alert('错误', '选择图片失败');
    }
  };

  if (!hasPermission) {
    return (
      <View className="flex-1 p-6 justify-center items-center">
        <Text className="text-lg mb-4">需要媒体库访问权限</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4"
          onPress={checkPermission}
        >
          <Text className="text-white">请求权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">媒体库访问</Text>
        <Text className="text-gray-600 mb-4">
          此功能用于访问设备媒体库，可以查看相册、图片，并创建新的相册。
        </Text>
      </View>

      <View className="space-y-4 mb-6">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={createAlbum}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text className="text-white ml-2 text-lg">创建新相册</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={pickImage}
        >
          <Ionicons name="image" size={20} color="white" />
          <Text className="text-white ml-2 text-lg">选择图片</Text>
        </TouchableOpacity>
      </View>

      {selectedAlbum && (
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">当前相册: {selectedAlbum.title}</Text>
          <FlatList
            data={assets}
            numColumns={3}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.uri }}
                className="w-32 h-32 m-1"
                resizeMode="cover"
              />
            )}
          />
        </View>
      )}

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要用户授予媒体库访问权限
          {'\n'}2. 某些设备可能限制媒体库访问
          {'\n'}3. 创建相册可能需要额外权限
        </Text>
      </View>
    </ScrollView>
  );
}
