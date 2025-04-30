import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoAuthSessionScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">认证会话</Text>
        <Text className="text-muted-foreground">实现安全的用户认证和会话管理。</Text>
      </View>

      <Button onPress={() => router.push('/login')}>
        <Text>前往登录 - 使用 Github 登录</Text>
      </Button>
    </View>
  );
}
