// import { PermissionStatus } from 'expo-modules-core';
// import * as TrackingTransparency from 'expo-tracking-transparency';
// import { useTrackingPermissions } from 'expo-tracking-transparency';
// import { View } from 'react-native';

// import { InfoItemCol } from '~/components/InfoItem';
// import { Button } from '~/components/ui/button';
// import { Text } from '~/components/ui/text';

// export default function ExpoTrackingTransparencyScreen() {
//   const [status, requestPermission] = useTrackingPermissions();

//   return (
//     <View className="flex-1 px-6 pt-6">
//       <View className="mb-6">
//         <Text className="text-2xl font-bold mb-2">跟踪用户权限</Text>
//         <Text className="text-muted-foreground">
//           请求跟踪用户或其设备。跟踪数据包括电子邮件地址、设备 ID、广告 ID 等
//         </Text>
//       </View>

//       <View className="flex-1">
//         <InfoItemCol label="是否可用" value={String(TrackingTransparency.isAvailable())} />
//         <InfoItemCol label="当前跟踪状态" value={String(status?.granted)} />
//         <InfoItemCol label="广告 ID" value={String(TrackingTransparency.getAdvertisingId())} />

//         <Text className="text-muted-foreground mt-6">
//           注意：未开启 `允许App请求跟踪`，不会触发请求权限；
//           系统会记住用户的选项，除非用户卸载并重新安装应用在设备上，否则不会再次提示。
//         </Text>
//       </View>

//       <Button onPress={requestPermission} disabled={status?.status === PermissionStatus.GRANTED}>
//         <Text className="capitalize">请求权限 ({status?.status})</Text>
//       </Button>
//     </View>
//   );
// }
