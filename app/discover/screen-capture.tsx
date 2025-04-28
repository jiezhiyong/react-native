import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export default function ExpoScreenCaptureScreen() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);
  const viewRef = useRef<View>(null);

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要权限', '需要相册权限才能保存截图');
      return false;
    }
    return true;
  };

  const takeScreenshot = async () => {
    try {
      setIsCapturing(true);
      if (!viewRef.current) return;

      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      setScreenshotUri(uri);
    } catch (error) {
      console.error('截图失败:', error);
      Alert.alert('错误', '截图失败');
    } finally {
      setIsCapturing(false);
    }
  };

  const saveScreenshot = async () => {
    if (!screenshotUri) return;

    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await MediaLibrary.saveToLibraryAsync(screenshotUri);
      Alert.alert('成功', '截图已保存到相册');
    } catch (error) {
      console.error('保存失败:', error);
      Alert.alert('错误', '保存截图失败');
    }
  };

  const shareScreenshot = async () => {
    if (!screenshotUri) return;

    try {
      await Sharing.shareAsync(screenshotUri);
    } catch (error) {
      console.error('分享失败:', error);
      Alert.alert('错误', '分享截图失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">屏幕截图</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何捕获屏幕内容并保存或分享。</Text>
      </View>

      <View ref={viewRef} className="space-y-6">
        {/* 截图预览 */}
        {screenshotUri && (
          <View className="space-y-4">
            <Text className="text-base font-semibold">截图预览</Text>
            <Image source={{ uri: screenshotUri }} className="w-full h-64 rounded-lg" resizeMode="contain" />
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-lg p-3 flex-row items-center justify-center"
                onPress={saveScreenshot}
              >
                <Ionicons name="save" size={20} color="white" />
                <Text className="text-white ml-2">保存到相册</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-lg p-3 flex-row items-center justify-center"
                onPress={shareScreenshot}
              >
                <Ionicons name="share" size={20} color="white" />
                <Text className="text-white ml-2">分享</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 示例内容 */}
        <View className="space-y-4">
          <Text className="text-base font-semibold">示例内容</Text>
          <View className="bg-gray-100 rounded-lg p-6">
            <Text className="text-lg font-bold mb-2">这是一个示例标题</Text>
            <Text className="text-gray-600 mb-4">这是一段示例文本，用于展示截图功能。截图将包含这个区域的内容。</Text>
            <View className="flex-row space-x-4">
              <View className="w-20 h-20 bg-blue-500 rounded-lg" />
              <View className="w-20 h-20 bg-green-500 rounded-lg" />
              <View className="w-20 h-20 bg-yellow-500 rounded-lg" />
            </View>
          </View>
        </View>

        {/* 截图按钮 */}
        <TouchableOpacity
          className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={takeScreenshot}
          disabled={isCapturing}
        >
          <Ionicons name={isCapturing ? 'hourglass' : 'camera'} size={20} color="white" />
          <Text className="text-white ml-2">{isCapturing ? '正在截图...' : '截图'}</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要相册权限才能保存截图
          {'\n'}2. 截图质量可以调整
          {'\n'}3. 支持分享到其他应用
        </Text>
      </View>
    </ScrollView>
  );
}
