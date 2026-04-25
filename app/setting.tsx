import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      className="flex-row items-center justify-between p-5 border-b border-border"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1 gap-3">
        {icon}
        <Text className="text-foreground flex-1">{title}</Text>
        {desc && <Text className="text-secondary-foreground">{desc}</Text>}
      </View>
      <ChevronRight size={20} color="#87867f" />
    </TouchableOpacity>
  );
};

interface SettingGroupProps {
  children: React.ReactNode;
}

const SettingGroup = ({ children }: SettingGroupProps) => {
  return <View className="bg-card rounded-xl my-2 overflow-hidden border border-border">{children}</View>;
};

export default function SettingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 py-5" showsVerticalScrollIndicator={false}>
        <SettingGroup>
          <SettingItem title="营业执照" onPress={() => Alert.alert('该功能暂未实现')} />
          <SettingItem title="隐私设置" onPress={() => router.push('/privacy-setting')} />
        </SettingGroup>

        <SettingGroup>
          <SettingItem title="清除缓存" desc="1M" onPress={() => Alert.alert('该功能暂未实现')} />
          <SettingItem title="网络诊断" onPress={() => Alert.alert('该功能暂未实现')} />
        </SettingGroup>

        <SettingGroup>
          <SettingItem title="个人信息收集与使用清单" onPress={() => Alert.alert('该功能暂未实现')} />
          <SettingItem title="个人信息收集与第三方共享清单" onPress={() => Alert.alert('该功能暂未实现')} />
          <SettingItem title="系统权限使用清单" onPress={() => Alert.alert('该功能暂未实现')} />
          <SettingItem title="互联网信息服务算法备案" onPress={() => Alert.alert('该功能暂未实现')} />
        </SettingGroup>

        <SettingGroup>
          <SettingItem title="账户注销" onPress={() => router.push('/destroy-account')} />
        </SettingGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
