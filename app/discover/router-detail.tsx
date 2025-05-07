import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function RouteDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">路由示例 - 详情</Text>
        <Text className="text-muted-foreground">使用和配置 Router 相关功能。</Text>
      </View>

      <Text className="font-medium mb-2 text-lg">接收到的参数</Text>
      <View className="bg-muted rounded-lg p-4 min-h-24">
        <Text>{JSON.stringify(params)}</Text>
      </View>
      <Button className="mt-4" onPress={() => router.back()}>
        <Text>返回</Text>
      </Button>
    </View>
  );
}
