import { Slot } from 'expo-router';
import { Text, View } from 'react-native';

export default function DiscoverLayout() {
  return (
    <>
      <View>
        <Text>DiscoverLayout Header</Text>
      </View>

      <Slot />

      <View>
        <Text>DiscoverLayout Footer</Text>
      </View>
    </>
  );
}
