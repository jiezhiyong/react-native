import Slider from '@react-native-community/slider';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pause, Play, Volume1, Volume2 } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

/**
 * Expo Audio 示例组件
 * 使用 expo-audio 进行音频播放
 */
export default function ExpoAudioScreen() {
  // 音频源示例
  const audioSources = [
    { name: 'Sample 1', uri: require('~/assets/audios/sample-3s.mp3') },
    { name: 'Sample 2', uri: require('~/assets/audios/sample-9s.mp3') },
    { name: 'Sample 3 (404)', uri: 'https://abc.com/mp3/example.mp3' },
  ];
  const [selectedSource, setSelectedSource] = useState(audioSources[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1.0);

  // 使用ref来存储需要设置的音量信息，避免直接修改player对象
  const pendingVolumeRef = useRef<number>(volume);

  // 使用ref跟踪播放器状态，避免在组件卸载后调用方法
  const playerMountedRef = useRef(true);

  // 使用 expo-audio 的 hooks 创建音频播放器
  const player = useAudioPlayer(selectedSource.uri);
  const status = useAudioPlayerStatus(player);

  // 当音量变化时存储到ref中，不直接修改player
  useEffect(() => {
    pendingVolumeRef.current = volume;
    // 在新的播放器实例上或加载新音频时应用音量
  }, [volume]);

  // 加载音频
  const loadAudio = useCallback(
    async (source = selectedSource) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('加载音频:', source.uri);

        // 先暂停当前播放
        if (player?.playing) {
          try {
            await player.pause();
          } catch (pauseError) {
            console.warn('暂停当前音频失败:', pauseError);
            // 继续执行，尝试加载新音频
          }
        }

        // 替换当前音频
        try {
          await player?.replace(source.uri);
        } catch (replaceError) {
          throw new Error(
            `无法加载音频: ${source.name}. ${replaceError instanceof Error ? replaceError.message : String(replaceError)}`
          );
        }

        // 在播放之前创建一个新的音频实例和配置
        // 由于React的特性，我们无法直接修改player的属性，所以可能的处理是让新URI和音量一起变更时触发React重新加载player

        setSelectedSource(source);
        setIsLoading(false);
      } catch (error) {
        console.error('加载音频失败:', error);

        // 提供更详细的错误信息
        const errorMsg =
          error instanceof Error
            ? error.message
            : `加载音频"${source.name}"失败，请检查音频文件是否存在或网络连接是否正常`;

        setError(errorMsg);
        setIsLoading(false);
      }
    },
    [player, selectedSource]
  );

  // 控制播放/暂停
  const togglePlayPause = async () => {
    try {
      if (!player) {
        setError('播放器未初始化');
        return;
      }

      if (status?.playing) {
        console.log('暂停音频');
        await player.pause();
      } else {
        console.log('播放音频');
        await player.play();
      }
    } catch (error) {
      console.error('控制播放/暂停失败:', error);
      setError(`控制播放/暂停失败: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // 调整音量
  const adjustVolume = useCallback((value: number) => {
    try {
      console.log('设置音量:', value);
      // 保存音量值到本地状态
      setVolume(value);
      // 新的音量值将通过useEffect更新到pendingVolumeRef
    } catch (error) {
      console.error('调整音量失败:', error);
    }
  }, []);

  // 调整进度
  const seekAudio = async (value: number) => {
    try {
      if (!player || !status?.duration) return;

      const positionSeconds = value * status.duration; // 秒为单位
      console.log('调整进度:', positionSeconds);
      // 使用 seekTo 方法设置播放位置
      await player.seekTo(positionSeconds);
    } catch (error) {
      console.error('调整进度失败:', error);
    }
  };

  // 格式化时间
  const formatTime = (seconds: number | undefined): string => {
    if (!seconds) return '00:00';

    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算播放进度比例
  const getProgress = (): number => {
    if (!status?.duration || status.duration <= 0) return 0;
    return status.currentTime / status.duration;
  };

  // 安全释放播放器资源
  const safeReleasePlayer = useCallback(() => {
    if (!player) return;

    try {
      console.log('释放音频资源');
      player.remove();
    } catch (error) {
      console.warn('释放音频资源时出错:', error);
    }
  }, [player]);

  // 组件卸载时释放资源
  useEffect(() => {
    return () => {
      playerMountedRef.current = false;
      console.log('卸载组件 - 释放音频资源');
      safeReleasePlayer();
    };
  }, [safeReleasePlayer]);

  // 组件首次加载时加载默认音频
  useEffect(() => {
    playerMountedRef.current = true;
    loadAudio();
  }, [loadAudio]);

  // 播放器 UI
  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">音频播放</Text>
        <Text className="text-secondary-foreground">在应用中播放、暂停和控制音频内容。</Text>
      </View>

      <View className="p-4 bg-gray-50 rounded-lg mb-4">
        <Text className="font-bold mb-2">音频源选择</Text>
        <View className="flex-row flex-wrap gap-2">
          {audioSources.map((source, index) => (
            <Button
              key={index}
              variant={selectedSource.uri === source.uri ? 'default' : 'outline'}
              onPress={() => loadAudio(source)}
              className="mb-2"
              size="sm"
            >
              <Text>{source.name}</Text>
            </Button>
          ))}
        </View>
      </View>

      <View className="p-4 bg-gray-50 rounded-lg">
        {/* 播放进度 */}
        <Text className="font-bold mb-4">
          播放进度, {status?.playing ? '播放中' : '已暂停'} {status?.isBuffering ? ' (缓冲中)' : ''}
        </Text>
        <View className="mb-4">
          <Slider
            value={getProgress()}
            onValueChange={(value) => seekAudio(value)}
            step={0.01}
            minimumValue={0}
            maximumValue={1}
            style={{ width: '100%', height: 40 }}
            minimumTrackTintColor="#0891b2"
            maximumTrackTintColor="#cccccc"
            thumbTintColor="#0891b2"
          />
          <View className="flex-row justify-between mt-1">
            <Text className="text-gray-500 text-xs">{formatTime(status?.currentTime)}</Text>
            <Text className="text-gray-500 text-xs">{formatTime(status?.duration)}</Text>
          </View>
        </View>

        {/* 音量控制 */}
        <Text className="font-bold mb-4">音量控制, {Math.round(volume * 100)}%</Text>
        <View className="mb-4">
          <View className="flex-row items-center mb-2">
            <Volume1 size={16} color="gray" />
            <View className="flex-1 mx-2">
              <Slider
                value={volume}
                onValueChange={adjustVolume}
                step={0.01}
                minimumValue={0}
                maximumValue={1}
                style={{ width: '100%', height: 40 }}
                minimumTrackTintColor="#0891b2"
                maximumTrackTintColor="#cccccc"
                thumbTintColor="#0891b2"
              />
            </View>
            <Volume2 size={16} color="gray" />
          </View>
        </View>

        {/* 播放控制 */}
        <View className="flex-row justify-center items-center space-x-4 my-4">
          <Button
            onPress={togglePlayPause}
            className="w-14 h-14 rounded-full justify-center items-center"
            size="icon"
            disabled={isLoading || status?.isBuffering}
          >
            {status?.playing ? <Pause size={24} color="#fff" /> : <Play size={24} color="#fff" />}
          </Button>
        </View>
      </View>

      {error && (
        <View className="p-4 bg-red-50 rounded-lg items-center">
          <Text className="text-red-500">{error || '加载音频失败'}</Text>
          <Button onPress={() => setError(null)} className="mt-4 self-center" variant="outline" size="sm">
            <Text>清除错误</Text>
          </Button>
        </View>
      )}

      {isLoading && (
        <View className="items-center justify-center p-8">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="mt-2">加载音频中...</Text>
        </View>
      )}
    </View>
  );
}
