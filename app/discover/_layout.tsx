import { Slot, Stack, usePathname } from 'expo-router';
import { SafeAreaView, View } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index', // Ensure any route can link back to `/`
};

export default function DiscoverLayout() {
  const pathname = usePathname();
  const isSafeAreaContext = pathname === '/discover/safe-area-context';

  const inner = (
    <>
      <Stack.Screen
        options={{
          title: pathname.split('/').pop(),
          headerShadowVisible: false,
          headerShown: !isSafeAreaContext,
        }}
      />

      <View className="flex-1">
        <Slot />
      </View>
    </>
  );

  if (isSafeAreaContext) {
    return inner;
  }

  return <SafeAreaView className="flex-1">{inner}</SafeAreaView>;
}
