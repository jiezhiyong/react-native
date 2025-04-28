import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// 自定义安全区域组件
function CustomSafeArea() {
  const insets = useSafeAreaInsets();
  const [showInsets, setShowInsets] = useState(false);

  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="flex-1 bg-white p-6">
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">安全区域示例</Text>
          <Text className="text-gray-600 mb-4">此功能展示了如何适配不同设备的安全区域。</Text>
        </View>

        <View className="space-y-6">
          {/* 安全区域信息 */}
          <View className="space-y-4">
            <Text className="text-base font-semibold">安全区域信息</Text>
            <TouchableOpacity
              className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
              onPress={() => setShowInsets(!showInsets)}
            >
              <Ionicons name={showInsets ? 'eye-off' : 'eye'} size={20} color="white" />
              <Text className="text-white ml-2">{showInsets ? '隐藏安全区域' : '显示安全区域'}</Text>
            </TouchableOpacity>

            {showInsets && (
              <View className="bg-gray-100 rounded-lg p-4">
                <Text className="text-sm">
                  顶部安全区域: {insets.top}px
                  {'\n'}底部安全区域: {insets.bottom}px
                  {'\n'}左侧安全区域: {insets.left}px
                  {'\n'}右侧安全区域: {insets.right}px
                </Text>
              </View>
            )}
          </View>

          {/* 安全区域可视化 */}
          <View className="space-y-4">
            <Text className="text-base font-semibold">安全区域可视化</Text>
            <View className="h-40 bg-gray-100 rounded-lg overflow-hidden">
              <View className="absolute top-0 left-0 right-0 h-1 bg-red-500" style={{ height: insets.top }} />
              <View className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" style={{ height: insets.bottom }} />
              <View className="absolute top-0 bottom-0 left-0 w-1 bg-red-500" style={{ width: insets.left }} />
              <View className="absolute top-0 bottom-0 right-0 w-1 bg-red-500" style={{ width: insets.right }} />
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500">安全区域内的内容</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-sm text-gray-500">
            注意：
            {'\n'}1. 安全区域大小因设备而异
            {'\n'}2. 需要适配刘海屏、圆角等特殊屏幕
            {'\n'}3. 建议使用 SafeAreaView 组件
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function SafeAreaContextScreen() {
  return (
    <SafeAreaProvider>
      <CustomSafeArea />
    </SafeAreaProvider>
  );
}
