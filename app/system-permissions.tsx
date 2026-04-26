import * as Audio from 'expo-audio';
import * as Camera from 'expo-camera';
import * as Contacts from 'expo-contacts';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { Camera as CameraIcon, ChevronRight, Image, MapPin, Mic, UserRound } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useEffectAsync } from '@/hooks/use-effect-async';
import { cn } from '@/lib/utils';

interface PermissionItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: boolean;
  onPress: () => void;
  last?: boolean;
}

const PermissionItem = ({ title, description, icon, status, onPress, last }: PermissionItemProps) => {
  return (
    <View className={cn('px-5 pt-4 pb-0', last && 'pb-4')}>
      <TouchableOpacity className="flex gap-3" activeOpacity={0.7} onPress={onPress}>
        <View className="flex-row items-center flex-1 gap-3">
          <View className="items-center justify-center">{icon}</View>
          <Text className="text-foreground text-lg flex-1">{title}</Text>
          <View className="flex-row items-center gap-1">
            <Text className={cn('text-secondary-foreground', status ? 'text-primary' : 'text-destructive')}>
              {status ? '已开启' : '去设置'}
            </Text>
            <ChevronRight size={18} color="#87867f" />
          </View>
        </View>
        <View>
          <Text className="text-xs text-muted-foreground">{description}</Text>
        </View>
      </TouchableOpacity>
      {last ? null : <View className="h-px bg-border mt-4" />}
    </View>
  );
};

export default function SystemPermissionsScreen() {
  const [mediaLibraryPermissionResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [cameraPermissionResponse, requestCameraPermission] = Camera.useCameraPermissions();
  const [locationPermissionResponse, requestLocationPermission] = Location.useForegroundPermissions();
  const [contactsPermissionResponse, setContactsPermissionResponse] = useState<Camera.PermissionResponse | null>(null);
  const [audioPermissionResponse, setAudioPermissionResponse] = useState<Audio.PermissionResponse | null>(null);

  // 查询相关权限的状态
  useEffectAsync(async () => {
    Promise.all([Contacts.getPermissionsAsync(), Audio.getRecordingPermissionsAsync()]).then(
      ([contactsPermission, audioPermission]) => {
        setContactsPermissionResponse(contactsPermission);
        setAudioPermissionResponse(audioPermission);
      }
    );
  }, []);

  const handlePermissionPress = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('无法打开设置页面', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 py-5">
        <Text className="text-muted-foreground text-sm mb-4">
          为了向您提供更好的用户体验，我们在特定场景需要向您申请以下手机系统权限
        </Text>

        <Pressable className="bg-primary p-3 rounded-xl" onPress={requestMediaLibraryPermission}>
          <Text className="text-primary-foreground text-center font-medium">申请权限</Text>
        </Pressable>

        <View className="bg-card rounded-xl border border-border mt-4">
          <PermissionItem
            title="通讯录权限"
            description="用户调取您主动选取的通讯录内的联系人信息，以帮助您快速完成信息填写，不会保存您的通讯录内容"
            icon={<UserRound size={20} color="#c96442" />}
            status={contactsPermissionResponse?.granted}
            onPress={Contacts.requestPermissionsAsync}
          />

          <PermissionItem
            title="相册权限"
            description="读取、写入照片以使用扫码即查及反馈功能"
            icon={<Image size={20} color="#8b7358" />}
            status={mediaLibraryPermissionResponse?.granted}
            onPress={requestMediaLibraryPermission}
          />

          <PermissionItem
            title="相机权限"
            description="用于您的人脸识别、上传照片、图像识别以帮助您完成借款申请，或便于您反馈查看"
            icon={<CameraIcon size={20} color="#a66f3a" />}
            status={cameraPermissionResponse?.granted}
            onPress={requestCameraPermission}
          />

          <PermissionItem
            title="麦克风权限"
            description="主要用于活体识别时声音检测"
            icon={<Mic size={20} color="#5f6f52" />}
            status={audioPermissionResponse?.granted}
            onPress={Audio.requestRecordingPermissionsAsync}
          />

          <PermissionItem
            title="位置权限"
            description="用于进行账户安全管理及身份识别，对贷款真实性进行评估，防控账户盗用风险及电话诈骗风险"
            icon={<MapPin size={20} color="#b53333" />}
            status={locationPermissionResponse?.granted}
            onPress={requestLocationPermission}
            last
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
