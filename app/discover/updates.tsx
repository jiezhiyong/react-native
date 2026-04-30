// TODO: 待完成 updates
import * as Updates from 'expo-updates';
import { useState } from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ExpoUpdatesScreen() {
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<Updates.UpdateCheckResult | null>(null);
  const [error, setError] = useState('');

  // 检查更新
  const checkForUpdate = async () => {
    try {
      setError('');
      setIsChecking(true);
      const update = await Updates.checkForUpdateAsync();
      setUpdateInfo(update);
    } catch (error: any) {
      setError(error.message);
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
      setIsDownloaded(true);
    } catch (error: any) {
      setError(error.message);
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
      setError(error.message);
      setIsApplying(false);
    }
  };

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">应用更新</Text>
        <Text className="text-muted-foreground">实现应用内更新和版本管理</Text>
      </View>

      <View className="flex-1">
        {/* 当前版本信息 */}
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">当前版本信息</Text>
          <View className="bg-muted rounded-lg p-4 gap-3">
            <Text>更新渠道: {Updates.channel || '-'}</Text>
            <Text>运行时版本: {Updates.runtimeVersion}</Text>
          </View>
        </View>

        {/* 更新信息 */}
        {updateInfo && (
          <View className="mb-6">
            <Text className="text-lg font-medium mb-2">更新信息</Text>
            <View className="bg-muted rounded-lg p-4 gap-3">
              <Text>有新版本: {updateInfo.isAvailable ? '是' : '否'}</Text>
              <Text>已下载: {isDownloaded ? '是' : '否'}</Text>
            </View>
          </View>
        )}

        {/* 下载更新 */}
        {updateInfo?.isAvailable && !isDownloaded && (
          <View className="mb-6">
            <Text className="text-lg font-medium mb-2">下载更新</Text>
            <Button onPress={downloadUpdate} disabled={isDownloading}>
              {isDownloading ? <ActivityIndicator /> : <Text>下载更新</Text>}
            </Button>
          </View>
        )}

        {/* 应用更新 */}
        {isDownloaded && (
          <View className="mb-6">
            <Text className="text-lg font-medium mb-2">应用更新</Text>
            <Button onPress={applyUpdate} disabled={isApplying}>
              {isApplying ? <ActivityIndicator /> : <Text>应用更新</Text>}
            </Button>
          </View>
        )}

        {/* 错误提示 */}
        {error ? (
          <>
            <Text className="text-lg font-medium mb-2">错误提示</Text>
            <View className="bg-destructive/10 rounded-lg p-4">
              <Text className="text-destructive">{error}</Text>
            </View>
          </>
        ) : null}
      </View>

      <Button onPress={checkForUpdate} disabled={isChecking}>
        {isChecking ? <ActivityIndicator /> : <Text>检查更新</Text>}
      </Button>
    </View>
  );
}
