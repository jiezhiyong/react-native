import { ChevronRight, HelpCircle } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface PermissionItemProps {
  title: string;
  status: 'enabled' | 'disabled';
  onPress: () => void;
}

const PermissionItem = ({ title, status, onPress }: PermissionItemProps) => {
  return (
    <View>
      <TouchableOpacity
        className="flex-row justify-between items-center px-4 pt-4 pb-1"
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Text className="text-base text-gray-800">{title}</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-400 mr-1">{status === 'enabled' ? '已开启' : '去设置'}</Text>
          <ChevronRight size={18} color="#ccc" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="px-4 pb-4 flex-row items-center gap-1">
        <HelpCircle size={15} color="#9ca3af" />
        <Text className="text-xs text-gray-400">权限使用说明</Text>
      </TouchableOpacity>

      <View className="h-px bg-gray-100" />
    </View>
  );
};

export default function SystemPermissionsScreen() {
  const handlePermissionPress = (permissionName: string) => {
    console.log(`处理权限设置: ${permissionName}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 m-4">
        <View className="bg-white rounded-xl">
          <PermissionItem title="允许访问位置信息" status="enabled" onPress={() => handlePermissionPress('location')} />
          <PermissionItem title="允许访问通讯录" status="disabled" onPress={() => handlePermissionPress('contacts')} />
          <PermissionItem title="允许访问相机" status="enabled" onPress={() => handlePermissionPress('camera')} />
          <PermissionItem
            title="允许访问麦克风"
            status="disabled"
            onPress={() => handlePermissionPress('microphone')}
          />
          <PermissionItem title="允许访问照片" status="disabled" onPress={() => handlePermissionPress('photos')} />
          <PermissionItem title="允许访问日历" status="disabled" onPress={() => handlePermissionPress('calendar')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
