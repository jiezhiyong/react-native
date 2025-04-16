import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

/**
 * 销毁账号页面
 * 展示应用的销毁账号内容
 */
export default function DestroyAccountScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: '销毁账号',
        }}
      />

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold mb-6">销毁账号</Text>
      </ScrollView>
    </View>
  );
}
