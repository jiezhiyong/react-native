import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

interface HelpOptionProps {
  title: string;
  onPress: () => void;
  isExternal?: boolean;
}

const HelpOption = ({ title, onPress, isExternal = false }: HelpOptionProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 border-b border-gray-100"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <Text className="text-base">{title}</Text>
      </View>
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-100 gap-4 pt-8">
      <View className="px-4">
        <Text className="text-2xl text-gray-500">您好 👋</Text>
        <Text className="text-3xl font-bold mt-1">我们能提供什么帮助?</Text>
      </View>

      <View className="bg-white rounded-xl mx-4 overflow-hidden">
        <HelpOption title="消息中心" onPress={() => router.push('/notice')} />
      </View>

      <View className="bg-white rounded-xl mx-4 overflow-hidden">
        <HelpOption title="常见问题" onPress={() => router.push('/qa')} />
        <HelpOption title="投诉 / 反馈 / 建议" onPress={() => router.push('/feedback')} />
      </View>
    </SafeAreaView>
  );
}
