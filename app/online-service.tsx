import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function OnlineServiceScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: '在线客服',
        }}
      />

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold mb-6">在线客服</Text>
      </ScrollView>
    </View>
  );
}
