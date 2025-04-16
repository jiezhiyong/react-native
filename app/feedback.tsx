import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

/**
 * 反馈页面
 * 展示应用的反馈内容
 */
export default function FeedbackScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: '意见反馈',
        }}
      />

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold mb-6">意见反馈</Text>
      </ScrollView>
    </View>
  );
}
