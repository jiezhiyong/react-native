import { Camera, ChevronRight, Image, MapPin, Mic, UserRound } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { cn } from '~/lib/utils';

interface PermissionItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'enabled' | 'disabled';
  onPress: () => void;
  last?: boolean;
}

const PermissionItem = ({ title, description, icon, status, onPress, last }: PermissionItemProps) => {
  return (
    <View className={cn('px-4 pt-3 pb-0', last && 'pb-3')}>
      <TouchableOpacity className="flex gap-2" activeOpacity={0.7} onPress={onPress}>
        <View className="flex-row items-center flex-1 gap-3">
          <View className="items-center justify-center">{icon}</View>
          <Text className="text-base text-gray-800 flex-1">{title}</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-gray-400">{status === 'enabled' ? '已开启' : '去设置'}</Text>
            <ChevronRight size={18} color="#ccc" />
          </View>
        </View>
        <View>
          <Text className="text-xs text-gray-500">{description}</Text>
        </View>
      </TouchableOpacity>
      {last ? null : <View className="h-px bg-gray-100 mt-3" />}
    </View>
  );
};

export default function SystemPermissionsScreen() {
  const handlePermissionPress = (permissionName: string) => {
    console.log(`处理权限设置: ${permissionName}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-gray-500 text-sm">
            为了向您提供更好的用户体验，我们在特定场景需要向您申请以下手机系统权限
          </Text>
        </View>

        <View className="bg-white rounded-xl mx-4 mb-4">
          <PermissionItem
            title="通讯录权限"
            description="用户调取您主动选取的通讯录内的联系人信息，以帮助您快速完成信息填写，不会保存您的通讯录内容"
            icon={<UserRound size={20} color="#4f46e5" />}
            status="disabled"
            onPress={() => handlePermissionPress('contacts')}
          />

          <PermissionItem
            title="相册权限"
            description="读取、写入照片以使用扫码即查及反馈功能"
            icon={<Image size={20} color="#0891b2" />}
            status="disabled"
            onPress={() => handlePermissionPress('photos')}
          />

          <PermissionItem
            title="相机权限"
            description="用于您的人脸识别、上传照片、图像识别以帮助您完成借款申请，或便于您反馈查看"
            icon={<Camera size={20} color="#f59e0b" />}
            status="enabled"
            onPress={() => handlePermissionPress('camera')}
          />

          <PermissionItem
            title="麦克风权限"
            description="主要用于活体识别时声音检测"
            icon={<Mic size={20} color="#10b981" />}
            status="disabled"
            onPress={() => handlePermissionPress('microphone')}
          />

          <PermissionItem
            title="位置权限"
            description="用于进行账户安全管理及身份识别，对贷款真实性进行评估，防控账户盗用风险及电话诈骗风险"
            icon={<MapPin size={20} color="#ef4444" />}
            status="disabled"
            onPress={() => handlePermissionPress('location')}
            last
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
