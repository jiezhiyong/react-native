import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function DiscoverTwo() {
  const router = useRouter();
  return (
    <View>
      <Text>DiscoverTwo</Text>

      <Button onPress={() => router.navigate('/discover/three')}>
        <Text>Go to Discover Three: navigate</Text>
      </Button>

      <Button onPress={() => router.dismissTo('/discover/three')}>
        <Text>Go to Discover Three: dismissTo</Text>
      </Button>
    </View>
  );
}
