import { useRouter } from 'expo-router';
import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Text } from '~/components/ui/text';

const demos: { name: string; desc: string; supports: string }[] = [
  { name: 'accelerometer', desc: '访问设备加速度计传感器', supports: 'Android, iOS (device only), Web' },
  { name: 'apple-authentication', desc: '为 iOS 提供 Apple 身份验证', supports: 'iOS' },
  {
    name: 'application',
    desc: '原生应用 ID、应用名称和构建版本等信息',
    supports: 'Android, iOS, Web',
  },
  { name: 'asset', desc: '资源加载和管理', supports: 'Android, iOS, Web' },
  { name: 'async-storage', desc: '异步、未加密、持久化键值存储', supports: 'Android, iOS, Web' },
  { name: 'audio', desc: '音频播放和录音', supports: 'Android, iOS, Web' },
  { name: 'auth-session', desc: '基于浏览器的身份验证', supports: 'Android, iOS, Web' },
  { name: 'background-task', desc: '运行后台任务', supports: 'Android, iOS' },
  { name: 'barometer', desc: '访问设备加速度计传感器', supports: 'Android, iOS (device only)' },
  { name: 'battery', desc: '访问物理设备电池信息，以及相应的事件监听器', supports: 'Android, iOS (device only), Web' },
  { name: 'blur', desc: '模糊视图效果', supports: 'Android, iOS, Web' },

  { name: 'calendar', desc: '访问设备气压传感器', supports: 'Android, iOS (device only)' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-800">
      <View className="flex gap-2 p-6">
        {demos.map((demo) => (
          <TouchableOpacity key={demo.name} onPress={() => router.navigate(`/discover/${demo.name}` as any)}>
            <Alert icon={Terminal}>
              <AlertTitle className="capitalize">
                <Text>{demo.name}</Text>
                <Text className="text-green-500 text-xs"> - {demo.supports}</Text>
              </AlertTitle>
              <AlertDescription className="text-gray-700 dark:text-gray-300">{demo.desc}</AlertDescription>
            </Alert>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
