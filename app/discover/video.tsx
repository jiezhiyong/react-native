import { Ionicons } from '@expo/vector-icons';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function ExpoVideoScreen() {
  const [error, setError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 初始化视频播放器
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  // 监听播放状态变化
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">视频播放</Text>
        <Text className="text-secondary-foreground">在应用中播放和控制视频内容。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">视频功能</Text>
        <Text className="text-secondary-foreground">使用 expo-video 播放视频。</Text>
      </View>

      {/* 视频播放器 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">视频播放</Text>
        <View style={styles.videoContainer}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            onFullscreenEnter={() => setIsFullscreen(true)}
            onFullscreenExit={() => setIsFullscreen(false)}
          />
        </View>

        {/* 控制按钮 */}
        <View className="flex-row justify-center mt-4 space-x-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center"
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="white" />
            <Text className="text-white ml-2">{isPlaying ? '暂停' : '播放'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-purple-500 rounded-lg p-4 flex-row items-center"
            onPress={() => {
              player.replay();
            }}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white ml-2">重播</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          1. 支持视频播放和暂停
          {'\n'}2. 支持全屏播放
          {'\n'}3. 支持画中画模式
          {'\n'}4. 支持循环播放
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-video
          {'\n'}2. 建议在真机上测试
          {'\n'}3. 需要网络连接
          {'\n'}4. 支持全屏和画中画模式
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
