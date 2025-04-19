import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

// Expo 更新
// https://docs.expo.dev/eas-update/getting-started/
// https://docs.expo.dev/eas-update/preview/
// https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckautomatically
//
// 通过 expo-updates 加载应用时的原生代码调试
// https://docs.expo.dev/eas-update/debug/#debugging-of-native-code-while-loading-the-app-through-expo-updates
//
// 自定义 Expo 更新服务器和客户端
// https://github.com/expo/custom-expo-updates-server
// https://docs.expo.dev/technical-specs/expo-updates-1/
export default function UpdatesDemo() {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  return (
    <View className="p-5">
      <Text className="mb-4">
        {currentlyRunning.isEmbeddedLaunch ? 'This app is running from built-in code' : 'This app is running an update'}
      </Text>

      <Button
        onPress={async () => {
          try {
            await Updates.checkForUpdateAsync();
          } catch (e) {
            alert((e as Error)?.message);
          }
        }}
      >
        <Text>Check manually for updates</Text>
      </Button>

      {isUpdateAvailable ? (
        <Button
          onPress={async () => {
            try {
              await Updates.fetchUpdateAsync();
            } catch (e) {
              alert((e as Error)?.message);
            }
          }}
        >
          <Text>Download and run update</Text>
        </Button>
      ) : null}
    </View>
  );
}
