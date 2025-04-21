import { Stack, useRouter } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function NotFoundScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 items-center p-8">
        {/* 错误图标 */}
        <View className="items-center justify-center w-32 h-32 rounded-full mb-8 bg-destructive/5">
          <AlertCircle size={64} color="red" />
        </View>

        {/* 错误信息 */}
        <Text className="text-3xl font-bold text-center mb-2">找不到页面</Text>

        <Text className="text-base text-gray-500 text-center mb-2">抱歉，您访问的页面不存在</Text>

        {/* 错误代码 */}
        <View className="py-2 px-6 bg-gray-100 rounded-full mb-8">
          <Text className="text-gray-400 text-sm">错误代码: 404</Text>
        </View>

        {/* 按钮区域 */}
        <View className="w-full">
          <Button variant="default" className="rounded-xl" onPress={handleGoHome}>
            <Text>返回首页</Text>
          </Button>

          <TouchableOpacity className="py-5" onPress={() => router.back()}>
            <Text className="text-primary text-center font-medium text-sm">返回上一页</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
