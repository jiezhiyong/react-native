import * as IntentLauncher from 'expo-intent-launcher';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

// 常用设置页面（仅适用于 Android）
const SETTINGS_PAGES = [
  {
    label: 'Wi-Fi 设置',
    action: () => IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.WIRELESS_SETTINGS),
  },
  {
    label: '蓝牙设置',
    action: () => IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.BLUETOOTH_SETTINGS),
  },
  {
    label: '位置设置',
    action: () => IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS),
  },
  {
    label: '应用信息',
    action: () => IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS),
  },
  {
    label: '系统设置',
    action: () => IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.SETTINGS),
  },
];

// https://docs.expo.dev/versions/latest/sdk/intent-launcher/
export default function ExpoIntentLauncherScreen() {
  const [lastLaunchedIntent, setLastLaunchedIntent] = useState<string | null>(null);
  const isAndroid = Platform.OS === 'android';

  // 打开网页
  const openWebBrowser = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://docs.expo.dev');
      setLastLaunchedIntent('打开网页浏览器: docs.expo.dev');
    } catch (error) {
      console.error('打开网页失败:', error);
    }
  };

  // 打开设置页面
  const openSettings = async (settingOption: (typeof SETTINGS_PAGES)[0]) => {
    try {
      if (isAndroid) {
        await settingOption.action();
        setLastLaunchedIntent(`打开: ${settingOption.label}`);
      }
    } catch (error) {
      console.error('打开设置失败:', error);
    }
  };

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg mb-2 font-medium">通用操作</Text>
        <Button className="mb-2" onPress={openWebBrowser}>
          <Text>打开浏览器 (所有平台)</Text>
        </Button>
      </View>

      <View className="mb-6">
        <Text className="text-lg mb-2 font-medium">Android 系统设置</Text>
        <Text className="text-sm mb-2">IntentLauncher 允许你在 Android 上打开系统设置页面</Text>

        <View className="flex-col gap-2">
          {SETTINGS_PAGES.map((setting, index) => (
            <Button key={index} onPress={() => openSettings(setting)} disabled={!isAndroid}>
              <Text>{setting.label}</Text>
            </Button>
          ))}
        </View>
      </View>

      {lastLaunchedIntent && (
        <View>
          <Text className="font-medium mb-2">上次操作:</Text>
          <Text className="text-primary">{lastLaunchedIntent}</Text>
        </View>
      )}
    </View>
  );
}
