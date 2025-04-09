import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function DiscoverThree() {
  const router = useRouter();
  return (
    <View>
      <Text>DiscoverThree</Text>

      <Button onPress={() => router.dismissTo('/discover/one')}>
        <Text>Back to Discover One</Text>
      </Button>

      {/* 返回最近堆栈中的第一个屏幕 */}
      {/* 为什么返回到 /discover 而不是 / ? */}
      <Button onPress={() => router.dismissAll()}>
        <Text>Back to Home</Text>
      </Button>

      <Button
        onPress={() => {
          console.log(router.canDismiss());
        }}
      >
        <Text>Can dismiss</Text>
      </Button>
    </View>
  );
}
