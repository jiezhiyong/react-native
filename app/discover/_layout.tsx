import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { SafeAreaView, Text, View } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index', // Ensure any route can link back to `/`
};

export default function DiscoverLayout() {
  const [isLoaded] = useFonts({
    spaceMono: require('~/assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!isLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 gap-3 p-5">
      <View>
        <Text style={{ fontFamily: 'spaceMono' }}>...</Text>
      </View>

      <Slot />

      <View>
        <Text style={{ fontFamily: 'spaceMono' }}>...</Text>
      </View>
    </SafeAreaView>
  );
}
