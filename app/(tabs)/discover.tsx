import { useRouter } from 'expo-router';
import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Text } from '~/components/ui/text';

const demos: { name: string; desc: string; supports: string }[] = [
  { name: 'expo-sensors', desc: '访问设备加速度计传感器', supports: 'Android, iOS (device only), Web' },
  { name: 'apple-authentication', desc: '为 iOS 提供 Apple 身份验证', supports: 'iOS' },
  {
    name: 'expo-application',
    desc: '提供有关原生应用 ID、应用名称和构建版本的详细信息',
    supports: 'Android, iOS, Web',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100 dark:bg-gray-800">
      <View className="flex gap-2">
        {demos.map((demo) => (
          <TouchableOpacity key={demo.name} onPress={() => router.navigate(`/discover/${demo.name}` as any)}>
            <Alert icon={Terminal}>
              <AlertTitle className="capitalize">{demo.name}</AlertTitle>
              <AlertDescription className="text-gray-700 dark:text-gray-300">
                <Text>{demo.desc}, </Text>
                <Text className="text-green-600">{demo.supports}</Text>
              </AlertDescription>
            </Alert>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
