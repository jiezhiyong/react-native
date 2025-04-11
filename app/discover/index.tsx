import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function DiscoverIndex() {
  const router = useRouter();
  return (
    <View className="flex-1 gap-3">
      <Text>DiscoverIndex</Text>

      <Button onPress={() => router.navigate('/discover/one')}>
        <Text>Go to Discover One</Text>
      </Button>

      <Button onPress={() => router.navigate('/discover/notifications')}>
        <Text>Go to Discover Notifications</Text>
      </Button>

      <Button onPress={() => router.navigate('/discover/localization')}>
        <Text>Go to Discover Localization</Text>
      </Button>
    </View>
  );
}
