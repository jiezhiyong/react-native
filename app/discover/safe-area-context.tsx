import { SafeAreaView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SafeAreaContextScreen() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView className="flex-1">
        <View className="flex-1 p-5">
          <View className="mb-6">
            <Text className="text-2xl font-bold mb-2">Safe Area Context</Text>
            <Text className="text-muted-foreground">使用和配置 Safe Area Context 相关功能。</Text>
          </View>

          <View className="bg-muted rounded-lg p-4">
            <Text className="text-sm">{JSON.stringify(insets, null, 2)}</Text>
          </View>
        </View>
      </SafeAreaView>

      <View className="absolute top-0 left-0 right-0 h-1 bg-green-200" style={{ height: insets.top }} />
      <View className="absolute bottom-0 left-0 right-0 h-1 bg-green-200" style={{ height: insets.bottom }} />
      <View className="absolute top-0 bottom-0 left-0 w-1 bg-green-200" style={{ width: insets.left }} />
      <View className="absolute top-0 bottom-0 right-0 w-1 bg-green-200" style={{ width: insets.right }} />
    </>
  );
}
