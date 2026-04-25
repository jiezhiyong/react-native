import Constants from 'expo-constants';
import { Image } from 'expo-image';
import * as StoreReview from 'expo-store-review';
import * as Updates from 'expo-updates';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';

interface AboutItemProps {
  title: string;
  desc?: string;
  onPress?: () => void;
  loading?: boolean;
}

const AboutItem = ({ title, desc, onPress, loading }: AboutItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className="flex-row items-center justify-between p-5 border-b border-border"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="flex-1">{title}</Text>
        {desc && <Text className="text-muted-foreground">{desc}</Text>}
      </View>
      {loading ? <ActivityIndicator /> : <ChevronRight size={20} color="#87867f" />}
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
  const [isRequestingReviewLoading, setIsRequestingReviewLoading] = useState(false);

  useEffect(() => {
    if (isUpdatePending) {
      alert('更新已下载，点击确认应用更新');
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  const requestReview = async () => {
    try {
      setIsRequestingReviewLoading(true);
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
      } else {
        alert('无法请求评分');
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsRequestingReviewLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-5">
      {/* 应用信息 */}
      <View className="items-center justify-center py-10 bg-card rounded-xl border border-border">
        <View className="w-20 h-20 rounded-xl overflow-hidden mb-4 bg-muted items-center justify-center">
          <Image source={require('../assets/images/icon.png')} className="flex-1" contentFit="contain" />
        </View>
        <Text className="text-xl font-medium mb-1 text-foreground">{appName}</Text>
        <Text className="text-muted-foreground">Version {appVersion}</Text>
      </View>

      {/* 功能列表 */}
      <View className="bg-card mt-4 rounded-xl border border-border overflow-hidden">
        {/* TODO: 检查更新 */}
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
        <AboutItem title="评分" onPress={() => requestReview()} loading={isRequestingReviewLoading} />
        <AboutItem title="联系电话" desc="400 123 4567" onPress={() => Linking.openURL('tel://4001234567')} />
      </View>

      {/* 底部信息 */}
      <View className="items-center px-6 py-8">
        <Text className="text-sm text-secondary-foreground mb-1">ICP备案信息：沪ICP备 12344324241621A</Text>
        <Text className="text-sm text-secondary-foreground mb-4">网络科技有限公司 版权所有</Text>
      </View>
    </View>
  );
}
