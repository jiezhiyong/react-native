import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoAuthSessionScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 p-6">
      <Button onPress={() => router.push('/login')}>
        <Text>前往登录 - 使用 Github 登录</Text>
      </Button>
    </View>
  );
}
