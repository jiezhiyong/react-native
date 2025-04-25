// import { useFonts } from 'expo-font';
import { Slot, usePathname } from 'expo-router';
import { SafeAreaView, ScrollView } from 'react-native';

import { H2 } from '~/components/ui/typography';

export const unstable_settings = {
  initialRouteName: 'index', // Ensure any route can link back to `/`
};

export default function DiscoverLayout() {
  const pathname = usePathname();
  // const [isLoaded] = useFonts({
  //   spaceMono: require('~/assets/fonts/SpaceMono-Regular.ttf'),
  // });

  // if (!isLoaded) {
  //   return null;
  // }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 p-6">
        <H2 className="border-b pb-4 mb-4 border-secondary capitalize">{pathname.split('/').pop()}</H2>

        <Slot />
      </ScrollView>
    </SafeAreaView>
  );
}
