import * as FileSystem from 'expo-file-system/legacy';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { InfoItemRow } from '@/components/InfoItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';

interface DownloadInfo {
  url: string;
  fileName: string;
  totalBytes: number;
  downloadedBytes: number;
  progress: number;
  status: 'idle' | 'downloading' | 'completed' | 'error' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  error?: string;
  localUri?: string;
  speed?: number; // KB/s
}

interface DownloadFile {
  name: string;
  url: string;
  description: string;
  estimatedSize: string;
}

const DOWNLOAD_FILES: DownloadFile[] = [
  {
    name: 'Sample Image',
    url: 'https://picsum.photos/1920/1080',
    description: '随机高清图片',
    estimatedSize: '~500KB',
  },
  {
    name: 'JSON Placeholder',
    url: 'https://jsonplaceholder.typicode.com/photos',
    description: '测试 JSON 数据',
    estimatedSize: '~500KB',
  },
  {
    name: 'Lorem Ipsum Text',
    url: 'https://loremipsum.io/api/50/long/plaintext',
    description: '长文本内容',
    estimatedSize: '~10KB',
  },
];

export default function FileDownloadScreen() {
  const [downloads, setDownloads] = useState<Record<string, DownloadInfo>>({});
  const [downloadResumables, setDownloadResumables] = useState<Record<string, any>>({});

  // 格式化文件大小
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 格式化速度
  const formatSpeed = (bytesPerSecond: number) => {
    const kbps = bytesPerSecond / 1024;
    if (kbps < 1024) {
      return `${kbps.toFixed(1)} KB/s`;
    }
    return `${(kbps / 1024).toFixed(1)} MB/s`;
  };

  // 计算预计剩余时间
  const getEstimatedTime = (downloadInfo: DownloadInfo) => {
    if (!downloadInfo.speed || downloadInfo.speed === 0) return '计算中...';

    const remainingBytes = downloadInfo.totalBytes - downloadInfo.downloadedBytes;
    const remainingSeconds = remainingBytes / (downloadInfo.speed * 1024);

    if (remainingSeconds < 60) {
      return `${Math.ceil(remainingSeconds)} 秒`;
    } else if (remainingSeconds < 3600) {
      return `${Math.ceil(remainingSeconds / 60)} 分钟`;
    } else {
      return `${Math.ceil(remainingSeconds / 3600)} 小时`;
    }
  };

  // 开始下载
  const startDownload = async (file: DownloadFile) => {
    try {
      const fileName = `${file.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // 初始化下载信息
      const downloadInfo: DownloadInfo = {
        url: file.url,
        fileName: file.name,
        totalBytes: 0,
        downloadedBytes: 0,
        progress: 0,
        status: 'downloading',
        startTime: new Date(),
        speed: 0,
      };

      setDownloads((prev) => ({
        ...prev,
        [file.name]: downloadInfo,
      }));

      // 创建下载任务
      const downloadResumable = FileSystem.createDownloadResumable(file.url, fileUri, {}, (downloadProgress) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = downloadProgress;
        const progress = totalBytesExpectedToWrite > 0 ? (totalBytesWritten / totalBytesExpectedToWrite) * 100 : 0;

        setDownloads((prev) => {
          const currentDownload = prev[file.name];
          if (!currentDownload) return prev;

          // 计算下载速度
          const now = Date.now();
          const startTime = currentDownload.startTime?.getTime() || now;
          const elapsedSeconds = (now - startTime) / 1000;
          const speed = elapsedSeconds > 0 ? totalBytesWritten / elapsedSeconds / 1024 : 0; // KB/s

          return {
            ...prev,
            [file.name]: {
              ...currentDownload,
              totalBytes: totalBytesExpectedToWrite || 0,
              downloadedBytes: totalBytesWritten,
              progress: Math.round(progress),
              speed,
            },
          };
        });
      });

      // 保存下载任务引用
      setDownloadResumables((prev) => ({
        ...prev,
        [file.name]: downloadResumable,
      }));

      // 开始下载
      const result = await downloadResumable.downloadAsync();

      if (result && result.uri) {
        // 获取文件信息
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        const fileSize = fileInfo.exists ? (fileInfo as any).size || 0 : 0;

        setDownloads((prev) => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            status: 'completed',
            endTime: new Date(),
            localUri: result.uri,
            totalBytes: fileSize,
            downloadedBytes: fileSize,
            progress: 100,
          },
        }));

        Alert.alert('下载完成', `文件 "${file.name}" 下载完成`, [
          {
            text: '查看详情',
            onPress: () => showFileInfo(file.name),
          },
          {
            text: '确定',
            style: 'default',
          },
        ]);
      }
    } catch (error: any) {
      console.error('Download error:', error);
      setDownloads((prev) => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: 'error',
          error: error.message || '下载失败',
          endTime: new Date(),
        },
      }));

      Alert.alert('下载失败', `下载 "${file.name}" 时发生错误：${error.message}`);
    } finally {
      // 清理下载任务引用
      setDownloadResumables((prev) => {
        const newState = { ...prev };
        delete newState[file.name];
        return newState;
      });
    }
  };

  // 取消下载
  const cancelDownload = async (fileName: string) => {
    const downloadResumable = downloadResumables[fileName];
    if (downloadResumable) {
      try {
        await downloadResumable.cancelAsync();
        setDownloads((prev) => ({
          ...prev,
          [fileName]: {
            ...prev[fileName],
            status: 'cancelled',
            endTime: new Date(),
          },
        }));

        // 清理下载任务引用
        setDownloadResumables((prev) => {
          const newState = { ...prev };
          delete newState[fileName];
          return newState;
        });

        Alert.alert('下载已取消', `"${fileName}" 的下载已被取消`);
      } catch (error: any) {
        console.error('Cancel download error:', error);
        Alert.alert('取消失败', '无法取消下载任务');
      }
    }
  };

  // 显示文件信息
  const showFileInfo = async (fileName: string) => {
    const downloadInfo = downloads[fileName];
    if (!downloadInfo || !downloadInfo.localUri) {
      Alert.alert('错误', '文件信息不可用');
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(downloadInfo.localUri);
      const fileSize = fileInfo.exists ? (fileInfo as any).size || 0 : 0;
      const downloadTime =
        downloadInfo.endTime && downloadInfo.startTime
          ? ((downloadInfo.endTime.getTime() - downloadInfo.startTime.getTime()) / 1000).toFixed(1)
          : '未知';

      Alert.alert(
        '文件详情',
        `文件名：${fileName}\n` +
          `大小：${formatBytes(fileSize)}\n` +
          `下载时间：${downloadTime} 秒\n` +
          `存储路径：${downloadInfo.localUri}`,
        [
          {
            text: '删除文件',
            style: 'destructive',
            onPress: () => deleteFile(fileName, downloadInfo.localUri!),
          },
          {
            text: '确定',
            style: 'default',
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '无法获取文件信息');
    }
  };

  // 删除文件
  const deleteFile = async (fileName: string, fileUri: string) => {
    try {
      await FileSystem.deleteAsync(fileUri);
      setDownloads((prev) => {
        const newState = { ...prev };
        delete newState[fileName];
        return newState;
      });
      Alert.alert('删除成功', `文件 "${fileName}" 已删除`);
    } catch (error) {
      Alert.alert('删除失败', '无法删除文件');
    }
  };

  // 清空所有记录
  const clearAllRecords = () => {
    Alert.alert('确认清空', '这将清空所有下载记录，是否继续？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: () => {
          setDownloads({});
          setDownloadResumables({});
        },
      },
    ]);
  };

  // 获取状态文本
  const getStatusText = (status: DownloadInfo['status']) => {
    const statusMap: Record<DownloadInfo['status'], string> = {
      idle: '待开始',
      downloading: '下载中',
      completed: '已完成',
      error: '失败',
      cancelled: '已取消',
    };
    return statusMap[status];
  };

  // 获取状态颜色
  const getStatusColor = (status: DownloadInfo['status']) => {
    const colorMap: Record<DownloadInfo['status'], string> = {
      idle: 'text-muted-foreground',
      downloading: 'text-primary',
      completed: 'text-green-600',
      error: 'text-red-600',
      cancelled: 'text-orange-600',
    };
    return colorMap[status];
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">文件下载进度</Text>
        <Text className="text-muted-foreground">
          演示文件下载、进度监控、取消下载等功能，支持显示下载速度和预计剩余时间
        </Text>
      </View>

      {/* 可下载文件列表 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">可下载文件</Text>
        {DOWNLOAD_FILES.map((file, index) => (
          <View key={file.name} className="border-b border-border pb-3 mb-3 last:border-b-0 last:mb-0">
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="font-medium">{file.name}</Text>
                <Text className="text-sm text-muted-foreground">{file.description}</Text>
                <Text className="text-xs text-muted-foreground">预计大小：{file.estimatedSize}</Text>
              </View>
              <Button
                size="sm"
                onPress={() => startDownload(file)}
                disabled={downloads[file.name]?.status === 'downloading'}
              >
                <Text>{downloads[file.name]?.status === 'downloading' ? '下载中' : '下载'}</Text>
              </Button>
            </View>
          </View>
        ))}
      </Card>

      {/* 下载记录 */}
      <Card className="p-4 mb-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-medium">下载记录 ({Object.keys(downloads).length})</Text>
          {Object.keys(downloads).length > 0 && (
            <Button variant="outline" size="sm" onPress={clearAllRecords}>
              <Text>清空</Text>
            </Button>
          )}
        </View>

        {Object.entries(downloads).length > 0 ? (
          <View className="gap-4">
            {Object.entries(downloads).map(([fileName, downloadInfo]) => (
              <View key={fileName} className="border border-border rounded-lg p-3">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="font-medium flex-1">{fileName}</Text>
                  <Text className={`text-sm ${getStatusColor(downloadInfo.status)}`}>
                    {getStatusText(downloadInfo.status)}
                  </Text>
                </View>

                {downloadInfo.status === 'downloading' && (
                  <>
                    <Progress value={downloadInfo.progress} className="mb-2" />
                    <View className="flex-row justify-between text-xs text-muted-foreground mb-2">
                      <Text>
                        {downloadInfo.progress.toFixed(1)}% ({formatBytes(downloadInfo.downloadedBytes)} /{' '}
                        {formatBytes(downloadInfo.totalBytes)})
                      </Text>
                      {downloadInfo.speed && downloadInfo.speed > 0 && (
                        <Text>{formatSpeed(downloadInfo.speed * 1024)}</Text>
                      )}
                    </View>
                    {downloadInfo.speed && downloadInfo.speed > 0 && (
                      <Text className="text-xs text-muted-foreground mb-2">
                        预计剩余：{getEstimatedTime(downloadInfo)}
                      </Text>
                    )}
                    <Button size="sm" variant="destructive" onPress={() => cancelDownload(fileName)}>
                      <Text>取消下载</Text>
                    </Button>
                  </>
                )}

                {downloadInfo.status === 'completed' && (
                  <View>
                    <InfoItemRow label="文件大小" value={formatBytes(downloadInfo.totalBytes)} />
                    <InfoItemRow
                      label="下载时间"
                      value={
                        downloadInfo.endTime && downloadInfo.startTime
                          ? `${((downloadInfo.endTime.getTime() - downloadInfo.startTime.getTime()) / 1000).toFixed(1)} 秒`
                          : '-'
                      }
                    />
                    <Button size="sm" variant="outline" onPress={() => showFileInfo(fileName)}>
                      <Text>查看详情</Text>
                    </Button>
                  </View>
                )}

                {downloadInfo.status === 'error' && (
                  <View>
                    <Text className="text-sm text-red-600 mb-2">错误：{downloadInfo.error}</Text>
                    <Button
                      size="sm"
                      onPress={() => {
                        const file = DOWNLOAD_FILES.find((f) => f.name === fileName);
                        if (file) startDownload(file);
                      }}
                    >
                      <Text>重试</Text>
                    </Button>
                  </View>
                )}

                {downloadInfo.status === 'cancelled' && <Text className="text-sm text-orange-600">下载已取消</Text>}
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-center text-muted-foreground py-8">暂无下载记录</Text>
        )}
      </Card>

      {/* 功能说明 */}
      <Card className="p-4 mb-6">
        <Text className="text-lg font-medium mb-3">功能说明</Text>
        <View className="gap-2">
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">进度监控</Text>：实时显示下载进度百分比
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">速度计算</Text>：显示当前下载速度
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">时间预估</Text>：计算预计剩余下载时间
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">下载控制</Text>：支持取消下载和重试
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">文件管理</Text>：查看文件详情和删除文件
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
