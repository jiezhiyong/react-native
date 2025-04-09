import { Slot } from 'expo-router';
import { Modal, SafeAreaView, Text, View } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index', // Ensure any route can link back to `/`
};

export default function DiscoverLayout() {
  const isAuthenticated = false; /* check for valid auth token / session */

  return (
    <SafeAreaView>
      <Modal visible={!isAuthenticated}>
        <View>
          <Text>用户未登录</Text>
        </View>
      </Modal>

      <View>
        <Text>DiscoverLayout Header</Text>
      </View>

      <Slot />

      <View>
        <Text>DiscoverLayout Footer</Text>
      </View>
    </SafeAreaView>
  );
}
