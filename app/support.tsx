import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface HelpOptionProps {
  title: string;
  onPress: () => void;
  isExternal?: boolean;
}

const HelpOption = ({ title, onPress, isExternal = false }: HelpOptionProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-5 border-b border-border"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <Text className="text-base text-foreground">{title}</Text>
      </View>
      <ChevronRight size={20} color="#87867f" />
    </TouchableOpacity>
  );
};

export default function HelpScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 gap-4 px-5 py-5 bg-background">
      <View className="">
        <Text className="text-2xl text-muted-foreground">您好 👋</Text>
        <Text className="text-3xl font-medium mt-1 text-foreground">我们能提供什么帮助?</Text>
      </View>

      <View className="bg-card rounded-xl overflow-hidden border border-border">
        <HelpOption title="消息中心" onPress={() => router.push('/notice')} />
      </View>

      <View className="bg-card rounded-xl overflow-hidden border border-border">
        <HelpOption title="常见问题" onPress={() => router.push('/qa')} />
        <HelpOption title="投诉 / 反馈 / 建议" onPress={() => router.push('/feedback')} />
      </View>
    </View>
  );
}
