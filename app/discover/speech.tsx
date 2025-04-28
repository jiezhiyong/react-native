import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoSpeechScreen() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [text, setText] = useState('');
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
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">语音功能</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何使用语音合成功能。</Text>
      </View>

      {/* 语音合成 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">语音合成</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          value={text}
          onChangeText={setText}
          placeholder="输入要合成的文本"
          multiline
        />
        <TouchableOpacity
          className="bg-purple-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={isSpeaking ? stopSpeaking : startSpeaking}
          disabled={!text}
        >
          <Ionicons name={isSpeaking ? 'stop' : 'play'} size={20} color="white" />
          <Text className="text-white ml-2">{isSpeaking ? '停止播放' : '开始播放'}</Text>
        </TouchableOpacity>
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
        <Text className="text-gray-600">
          1. 语音合成：将文本转换为语音
          {'\n'}2. 支持中文合成
          {'\n'}3. 可以控制语音的语速和音调
          {'\n'}4. 支持暂停和继续播放
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-speech
          {'\n'}2. 建议在真机上测试
          {'\n'}3. 需要网络连接
          {'\n'}4. 某些设备可能有特殊的声音输出行为
        </Text>
      </View>
    </ScrollView>
  );
}
