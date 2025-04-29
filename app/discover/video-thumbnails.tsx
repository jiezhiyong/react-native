import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoVideoThumbnailsScreen() {
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState('');
  const [error, setError] = useState('');

  // 从相册选择视频
  const pickVideo = async () => {
    try {
      setError('');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        setThumbnailUri(''); // 清除之前的缩略图
      }
    } catch (error) {
      setError('选择视频失败');
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
        time: 0, // 从视频开始处获取缩略图
        quality: 0.8, // 缩略图质量
      });

      setThumbnailUri(uri);
    } catch (error) {
      setError('生成缩略图失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Video Thumbnails</Text>
        <Text className="text-secondary-foreground">使用和配置 Video Thumbnails 相关功能。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">视频缩略图</Text>
        <Text className="text-secondary-foreground">从视频中提取缩略图。</Text>
      </View>

      {/* 视频选择 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">视频选择</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={pickVideo}
        >
          <Ionicons name="folder" size={20} color="white" />
          <Text className="text-white ml-2">从相册选择视频</Text>
        </TouchableOpacity>
        {videoUri ? (
          <Text className="text-secondary-foreground mt-2">
            已选择视频: {videoUri.substring(videoUri.lastIndexOf('/') + 1)}
          </Text>
        ) : null}
      </View>

      {/* 生成缩略图 */}
      {videoUri && (
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">生成缩略图</Text>
          <TouchableOpacity
            className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={generateThumbnail}
          >
            <Ionicons name="image" size={20} color="white" />
            <Text className="text-white ml-2">生成缩略图</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 缩略图预览 */}
      {thumbnailUri ? (
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">缩略图预览</Text>
          <Image source={{ uri: thumbnailUri }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
        </View>
      ) : null}

      {/* 错误提示 */}
      {error ? (
        <View className="bg-red-100 rounded-lg p-4 mb-8">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-secondary-foreground">
          1. 支持从相册选择视频
          {'\n'}2. 支持生成视频缩略图
          {'\n'}3. 支持预览缩略图
          {'\n'}4. 支持错误处理
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-video-thumbnails, expo-image-picker
          {'\n'}2. 需要相册权限
          {'\n'}3. 缩略图质量可配置
          {'\n'}4. 建议在真机上测试
        </Text>
      </View>
    </ScrollView>
  );
}
