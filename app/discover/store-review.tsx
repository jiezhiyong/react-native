import { Ionicons } from '@expo/vector-icons';
import * as StoreReview from 'expo-store-review';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoStoreReviewScreen() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [result, setResult] = useState('');

  const checkAvailability = async () => {
    try {
      const available = await StoreReview.isAvailableAsync();
      setIsAvailable(available);
      setResult(`评分功能${available ? '可用' : '不可用'}`);
    } catch (error) {
      setResult('检查可用性失败');
    }
  };

  const requestReview = async () => {
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
        setResult('已请求评分');
      } else {
        setResult('无法请求评分');
      }
    } catch (error) {
      setResult('请求评分失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">应用评分</Text>
        <Text className="text-secondary-foreground">提示用户在应用商店对应用进行评分和评价。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">应用商店评分</Text>
        <Text className="text-secondary-foreground">使用 Expo 的应用商店评分功能。</Text>
      </View>

      {/* 检查可用性 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">检查可用性</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={checkAvailability}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text className="text-white ml-2">检查评分功能是否可用</Text>
        </TouchableOpacity>
      </View>

      {/* 请求评分 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">请求评分</Text>
        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={requestReview}
          disabled={!isAvailable}
        >
          <Ionicons name="star" size={20} color="white" />
          <Text className="text-white ml-2">请求评分</Text>
        </TouchableOpacity>
      </View>

      {/* 结果显示 */}
      {result ? (
        <View className="bg-gray-100 rounded-lg p-4 mb-8">
          <Text className="text-base font-semibold mb-2">操作结果</Text>
          <Text className="text-secondary-foreground">{result}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-secondary-foreground">
          1. 支持检查评分功能是否可用
          {'\n'}2. 支持请求用户评分
          {'\n'}3. 支持错误处理
          {'\n'}4. 支持状态反馈
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-store-review
          {'\n'}2. 不同平台可能有不同限制
          {'\n'}3. 评分请求有频率限制
          {'\n'}4. 测试时可能无法触发实际评分
        </Text>
      </View>
    </ScrollView>
  );
}
