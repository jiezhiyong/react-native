import * as StoreReview from 'expo-store-review';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ExpoStoreReviewScreen() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      const available = await StoreReview.isAvailableAsync();
      setIsAvailable(available);
    } catch (error) {
      Alert.alert('错误', (error as Error).message);
    }
  };

  const requestReview = async () => {
    try {
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      } else {
        Alert.alert('无法请求评分');
      }
    } catch (error) {
      Alert.alert('错误', (error as Error).message);
    }
  };

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">应用商店评分</Text>
        <Text className="text-muted-foreground">提示用户在应用商店对应用进行评分和评价。</Text>
      </View>

      <View className="flex-1 bg-muted rounded-lg mb-6"></View>

      {/* 请求评分 */}
      <Button onPress={requestReview} disabled={!isAvailable}>
        <Text>请求评分 ({isAvailable ? '可用' : '不可用'})</Text>
      </Button>
    </View>
  );
}
