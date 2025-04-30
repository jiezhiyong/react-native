import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Image, Linking, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

interface AboutItemProps {
  title: string;
  desc?: string;
  onPress?: () => void;
}

const AboutItem = ({ title, desc, onPress }: AboutItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-4 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-base text-gray-800 flex-1">{title}</Text>
        {desc && <Text className="text-xs text-muted-foreground">{desc}</Text>}
      </View>
      <ChevronRight size={20} color="#ccc" />
    </TouchableOpacity>
  );
};

// Expo 更新
// https://docs.expo.dev/eas-update/getting-started/
// https://docs.expo.dev/eas-update/preview/
// https://docs.expo.dev/versions/latest/sdk/updates/#updatescheckautomatically
//
// 通过 expo-updates 加载应用时的原生代码调试
// https://docs.expo.dev/eas-update/debug/#debugging-of-native-code-while-loading-the-app-through-expo-updates
//
// 自定义 Expo 更新服务器和客户端
// https://github.com/expo/custom-expo-updates-server
// https://docs.expo.dev/technical-specs/expo-updates-1/
export default function AboutScreen() {
  const appVersion = Constants.expoConfig?.version || '?';
  const appName = Constants.expoConfig?.name || '?';

  const { isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      alert('更新已下载，点击确认应用更新');
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  return (
    <SafeAreaView className="flex-1 bg-muted p-4">
      {/* 应用信息 */}
      <View className="items-center justify-center py-10 bg-white rounded-xl">
        <View className="w-20 h-20 rounded-xl overflow-hidden mb-4 bg-muted items-center justify-center">
          <Image source={require('../assets/images/icon.png')} className="flex-1" resizeMode="contain" />
        </View>
        <Text className="text-xl font-bold mb-1">{appName}</Text>
        <Text className="text-muted-foreground">Version {appVersion}</Text>
      </View>

      {/* 功能列表 */}
      <View className="bg-white mt-4 rounded-xl">
        <AboutItem
          title="检查更新"
          desc={isUpdateAvailable ? '有新版本' : '已是最新版本'}
          onPress={async () => {
            try {
              if (isUpdateAvailable) {
                await Updates.fetchUpdateAsync();
              } else {
                await Updates.checkForUpdateAsync();
              }
            } catch (e) {
              alert((e as Error)?.message);
            }
          }}
        />
        <AboutItem title="去评分" onPress={() => Linking.openURL('https://apps.apple.com/cn/app/id414478124')} />
        <AboutItem title="联系电话" desc="400 123 4567" onPress={() => Linking.openURL('tel://4001234567')} />
      </View>

      {/* 底部信息 */}
      <View className="items-center px-6 py-8">
        <Text className="text-xs text-gray-400 mb-1">ICP备案信息：沪ICP备 12344324241621A</Text>
        <Text className="text-xs text-gray-400 mb-4">网络科技有限公司 版权所有</Text>
      </View>
    </SafeAreaView>
  );
}
