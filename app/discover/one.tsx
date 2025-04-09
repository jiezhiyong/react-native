import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function DiscoverOne() {
  const router = useRouter();
  return (
    <View>
      <Text>DiscoverOne</Text>

      <Button onPress={() => router.navigate('/discover/two')}>
        <Text>Go to Discover Two</Text>
      </Button>
    </View>
  );
}
