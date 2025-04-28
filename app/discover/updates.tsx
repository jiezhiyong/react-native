import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoUpdatesScreen() {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<(Updates.UpdateCheckResult & { isDownloaded?: boolean }) | null>(null);
  const [error, setError] = useState('');

  // 检查更新
  const checkForUpdate = async () => {
    try {
      setError('');
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();
      setUpdateInfo(update);
    } catch (error: any) {
      setError('检查更新失败: ' + error.message);
    } finally {
      setIsChecking(false);
    }
  };

  // 下载更新
  const downloadUpdate = async () => {
    try {
      setError('');
      setIsDownloading(true);
      await Updates.fetchUpdateAsync();
      setUpdateInfo((prev) => ({ ...prev, isDownloaded: true }));
    } catch (error: any) {
      setError('下载更新失败: ' + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  // 应用更新
  const applyUpdate = async () => {
    try {
      setError('');
      setIsApplying(true);
      await Updates.reloadAsync();
    } catch (error: any) {
      setError('应用更新失败: ' + error.message);
      setIsApplying(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">应用更新</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何使用 Expo 的应用更新功能。</Text>
      </View>

      {/* 当前版本信息 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">当前版本信息</Text>
        <View className="bg-gray-100 rounded-lg p-4">
          <Text className="text-gray-600">
            更新渠道: {Updates.channel}
            {'\n'}运行时版本: {Updates.runtimeVersion}
          </Text>
        </View>
      </View>

      {/* 检查更新 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">检查更新</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={checkForUpdate}
          disabled={isChecking}
        >
          {isChecking ? (
            <ActivityIndicator color="white" />
          ) : (
            <View>
              <Ionicons name="refresh" size={20} color="white" />
              <Text className="text-white ml-2">检查更新</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 更新信息 */}
      {updateInfo && (
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">更新信息</Text>
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-gray-600">
              有新版本: {updateInfo.isAvailable ? '是' : '否'}
              {'\n'}已下载: {updateInfo.isDownloaded ? '是' : '否'}
            </Text>
          </View>
        </View>
      )}

      {/* 下载更新 */}
      {updateInfo?.isAvailable && !updateInfo.isDownloaded && (
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">下载更新</Text>
          <TouchableOpacity
            className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={downloadUpdate}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View>
                <Ionicons name="download" size={20} color="white" />
                <Text className="text-white ml-2">下载更新</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* 应用更新 */}
      {updateInfo?.isDownloaded && (
        <View className="mb-8">
          <Text className="text-base font-semibold mb-4">应用更新</Text>
          <TouchableOpacity
            className="bg-purple-500 rounded-lg p-4 flex-row items-center justify-center"
            onPress={applyUpdate}
            disabled={isApplying}
          >
            {isApplying ? (
              <ActivityIndicator color="white" />
            ) : (
              <View>
                <Ionicons name="sync" size={20} color="white" />
                <Text className="text-white ml-2">应用更新</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* 错误提示 */}
      {error ? (
        <View className="bg-red-100 rounded-lg p-4 mb-8">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 检查更新：检查是否有新版本可用
          {'\n'}2. 下载更新：下载新版本
          {'\n'}3. 应用更新：重启应用以应用更新
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-updates
          {'\n'}2. 需要配置更新服务器
          {'\n'}3. 建议在真机上测试
          {'\n'}4. 更新过程可能需要一些时间
        </Text>
      </View>
    </ScrollView>
  );
}
