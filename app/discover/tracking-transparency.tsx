import * as TrackingTransparency from 'expo-tracking-transparency';
import { useTrackingPermissions } from 'expo-tracking-transparency';
import { Alert, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoTrackingTransparencyScreen() {
  const [status, requestPermission] = useTrackingPermissions();

  return (
    <View className="flex-1 px-6 pt-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">跟踪用户权限</Text>
        <Text className="text-muted-foreground">
          请求跟踪用户或其设备。跟踪数据包括电子邮件地址、设备 ID、广告 ID 等
        </Text>
      </View>

      <View className="flex-1">
        <View className="mb-6 p-4 bg-muted rounded-lg gap-2">
          <Text>是否可用: {String(TrackingTransparency.isAvailable())}</Text>
          <Text>当前跟踪状态: {String(status?.granted)}</Text>
          <Text>广告 ID: {String(TrackingTransparency.getAdvertisingId())}</Text>
        </View>
        <Text className="text-muted-foreground">
          注意：未开启 `允许App请求跟踪`，不会触发请求权限；
          系统会记住用户的选项，除非用户卸载并重新安装应用在设备上，否则不会再次提示。
        </Text>
      </View>

      <Button onPress={requestPermission}>
        <Text>请求跟踪权限</Text>
      </Button>
    </View>
  );
}
