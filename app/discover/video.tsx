import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// demo, TODO: 切换为国内可用的视频
const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function ExpoVideoScreen() {
  // 初始化视频播放器
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = false;
    player.play();
  });

  // 监听播放状态变化
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">视频播放</Text>
        <Text className="text-muted-foreground">在应用中播放和控制视频内容。</Text>
      </View>

      {/* 视频播放器 */}
      <View className="mb-6">
        <View style={styles.videoContainer}>
          <VideoView style={styles.video} player={player} />
        </View>

        {/* 控制按钮 */}
        <View className="mt-6 gap-4 gap-3">
          <Button
            variant={isPlaying ? 'destructive' : 'default'}
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          >
            <Text>{isPlaying ? '暂停' : '播放'}</Text>
          </Button>

          <Button variant="secondary" className="border" onPress={() => player.replay()}>
            <Text>重播</Text>
          </Button>
        </View>
      </View>
    </View>
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
