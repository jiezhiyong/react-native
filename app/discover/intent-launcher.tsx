import * as IntentLauncher from 'expo-intent-launcher';
import { Platform, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

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
  const isAndroid = Platform.OS === 'android';

  // 打开设置页面
  const openSettings = async (settingOption: (typeof SETTINGS_PAGES)[0]) => {
    try {
      if (isAndroid) {
        await settingOption.action();
      }
    } catch (error) {
      console.error('打开设置失败:', error);
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">意图启动器(仅限 Android)</Text>
        <Text className="text-muted-foreground">IntentLauncher 允许你在 Android 上打开系统设置页面</Text>
      </View>

      <View className="flex-col gap-3">
        {SETTINGS_PAGES.map((setting, index) => (
          <Button key={index} onPress={() => openSettings(setting)} disabled={!isAndroid}>
            <Text>{setting.label}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
}
