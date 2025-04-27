import { Slot, Stack, usePathname } from 'expo-router';
import { SafeAreaView, View } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index', // Ensure any route can link back to `/`
};

export default function DiscoverLayout() {
  const pathname = usePathname();

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          title: pathname.split('/').pop(),
          headerShadowVisible: false,
        }}
      />

      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
