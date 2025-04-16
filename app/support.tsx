import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

/**
 * 支持页面
 * 展示应用的支持内容
 */
export default function SupportScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: '服务支持',
        }}
      />

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold mb-6">服务支持</Text>
      </ScrollView>
    </View>
  );
}
