import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface SettingItemProps {
  title: string;
  desc?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

const SettingItem = ({ title, desc, icon, onPress }: SettingItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-4 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1 gap-2">
        {icon}
        <Text className="text-base text-gray-800 flex-1">{title}</Text>
        {desc && <Text className="text-sm text-gray-400">{desc}</Text>}
      </View>
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

interface SettingGroupProps {
  children: React.ReactNode;
}

const SettingGroup = ({ children }: SettingGroupProps) => {
  return <View className="bg-white rounded-xl mx-4 my-2 overflow-hidden">{children}</View>;
};

export default function SettingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SettingGroup>
          <SettingItem title="营业执照" />
          <SettingItem title="隐私设置" />
        </SettingGroup>

        <SettingGroup>
          <SettingItem title="清除缓存" desc="1M" />
          <SettingItem title="网络诊断" />
        </SettingGroup>

        <SettingGroup>
          <SettingItem title="个人信息收集与使用清单" />
          <SettingItem title="个人信息收集与第三方共享清单" />
          <SettingItem title="系统权限使用清单" />
          <SettingItem title="互联网信息服务算法备案" />
        </SettingGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
