import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { ActivityIndicator } from '@/components/ActivityIndicator';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

/**
 * Expo Asset 示例屏幕
 * 使用 expo-asset 加载和管理资源
 */
export default function ExpoAssetScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedAssets, setLoadedAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 资源下载状态
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedAsset, setDownloadedAsset] = useState<Asset | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // 加载资源函数
    async function loadAssets() {
      try {
        setIsLoading(true);

        // 使用 Asset.loadAsync 预加载图片资源
        // 可以传入一个或多个资源
        const assets = await Asset.loadAsync([
          require('../../assets/images/icon.png'),
          require('../../assets/images/react-logo.png'),
        ]);

        setLoadedAssets(assets);
        setIsLoading(false);
      } catch (err) {
        setError('加载资源失败: ' + (err instanceof Error ? err.message : String(err)));
        setIsLoading(false);
      }
    }

    loadAssets();
  }, []);

  // 渲染资源信息项
  const renderAssetInfo = (asset: Asset, index: number) => (
    <View key={index} className="mb-4 p-4 bg-muted rounded-lg flex-col gap-3 text-muted-foreground">
      <Text>
        {asset.name}.{asset.type} ({asset.width || '?'} x {asset.height || '?'})
      </Text>
      {asset.localUri && (
        <Image source={{ uri: asset.localUri }} className="w-20 h-20 rounded bg-muted" resizeMode="contain" />
      )}
    </View>
  );

  // 下载资源
  const downloadAsset = async () => {
    try {
      setIsDownloading(true);

      // 创建一个资源对象
      const remoteAsset = Asset.fromModule(require('../../assets/images/icon-demo.png'));

      // 下载资源
      remoteAsset
        .downloadAsync()
        .then((asset) => {
          setDownloadedAsset(asset);
          setIsDownloading(false);
        })
        .catch((err) => {
          console.error('下载失败:', err);
          setIsDownloading(false);
        });

      // 模拟下载进度更新
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        if (progress >= 1) {
          clearInterval(interval);
          progress = 1;
        }
        setDownloadProgress(progress);
      }, 200);
    } catch (err) {
      console.error('下载失败:', err);
      setIsDownloading(false);
    }
  };

  // 渲染资源下载演示
  const renderAssetDownloadDemo = () => (
    <>
      {isDownloading ? (
        <View className="items-center">
          <ActivityIndicator />
          <Text className="mt-2">下载中: {Math.round(downloadProgress * 100)}%</Text>
        </View>
      ) : downloadedAsset ? (
        <View className="p-4 bg-muted rounded-lg gap-3">
          <Text>
            {downloadedAsset.name}.{downloadedAsset.type} ({downloadedAsset.width || '?'} x{' '}
            {downloadedAsset.height || '?'})
          </Text>
          {downloadedAsset.localUri && (
            <Image source={{ uri: downloadedAsset.localUri }} className="w-20 h-20 rounded" resizeMode="contain" />
          )}
        </View>
      ) : (
        <Button onPress={downloadAsset}>
          <Text>下载图标</Text>
        </Button>
      )}
    </>
  );

  if (isLoading) {
    return (
      <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
        <ActivityIndicator />
        <Text className="mt-2">加载资源中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 p-5 m-6 items-center justify-center bg-muted rounded-lg">
        <Text className="text-center text-destructive">{error || '-'}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">资源管理</Text>
        <Text className="text-muted-foreground">在应用中加载和管理各类静态资源文件。</Text>
      </View>

      <Text className="text-lg font-bold mb-2">预加载的资源:</Text>
      {loadedAssets.map(renderAssetInfo)}

      <Text className="text-lg font-bold mb-2">资源下载演示: {downloadedAsset ? '已下载' : '未下载'}</Text>
      {renderAssetDownloadDemo()}
    </ScrollView>
  );
}
