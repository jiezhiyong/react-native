import * as Speech from 'expo-speech';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';

export default function ExpoSpeechScreen() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState('有内鬼，终止交易');
  const [error, setError] = useState('');

  // 开始语音合成
  const startSpeaking = async () => {
    try {
      setError('');
      setIsSpeaking(true);
      await Speech.speak(text, {
        language: 'zh-CN',
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          setIsSpeaking(false);
        },
        onError: (error: Error) => {
          setError('语音合成错误: ' + error.message);
          setIsSpeaking(false);
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        setError('启动语音合成失败: ' + error.message);
      } else {
        setError('启动语音合成失败: 未知错误');
      }
      setIsSpeaking(false);
    }
  };

  // 停止语音合成
  const stopSpeaking = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      if (error instanceof Error) {
        setError('停止语音合成失败: ' + error.message);
      } else {
        setError('停止语音合成失败: 未知错误');
      }
    }
  };

  return (
    <View className="flex-1 px-6 pt-6 flex">
      <View className="flex-1">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">语音识别</Text>
          <Text className="text-muted-foreground">语音转换为文本。</Text>
        </View>

        {/* 输入框 */}
        <Textarea value={text} onChangeText={setText} />

        {/* 错误提示 */}
        {error ? (
          <View className="bg-destructive/20 rounded-lg p-4 mt-6">
            <Text className="text-destructive">{error}</Text>
          </View>
        ) : null}
      </View>

      <Button
        onPress={isSpeaking ? stopSpeaking : startSpeaking}
        disabled={!text}
        variant={isSpeaking ? 'destructive' : 'default'}
      >
        <Text>{isSpeaking ? '停止播放' : '开始播放'}</Text>
      </Button>
    </View>
  );
}
