import { Stack } from 'expo-router';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

export default function NativeIntent() {
  return (
    <>
      <Stack.Screen options={{ title: 'Native Intent' }} />
      <View>
        <Text>Native Intent</Text>
      </View>
    </>
  );
}
