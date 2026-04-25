import { Stack, useRouter } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function NotFoundScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 items-center p-8">
        {/* 错误图标 */}
        <View className="items-center justify-center w-32 h-32 rounded-full mb-8 bg-destructive/5">
          <AlertCircle size={64} color="#b53333" />
        </View>

        {/* 错误信息 */}
        <Text className="text-3xl font-medium text-center mb-2">找不到页面</Text>

        <Text className="text-muted-foreground text-center mb-2">抱歉，您访问的页面不存在</Text>

        {/* 错误代码 */}
        <View className="py-2 px-6 bg-muted rounded-full mb-8">
          <Text className="text-secondary-foreground text-sm">错误代码: 404</Text>
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
