import { Stack, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useI18nContext } from '@/i18n/i18n-react';

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
  const { LL } = useI18nContext();
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: LL.routes.settings(),
        }}
      />
      <ScrollView className="flex-1 px-5 py-5" showsVerticalScrollIndicator={false}>
        <SettingGroup>
          <SettingItem title={LL.settings.businessLicense()} onPress={() => Alert.alert(LL.common.notImplemented())} />
          <SettingItem title={LL.settings.privacySettings()} onPress={() => router.push('/privacy-setting')} />
        </SettingGroup>

        <SettingGroup>
          <SettingItem
            title={LL.settings.clearCache()}
            desc={LL.settings.cacheSize()}
            onPress={() => Alert.alert(LL.common.notImplemented())}
          />
          <SettingItem
            title={LL.settings.networkDiagnostics()}
            onPress={() => Alert.alert(LL.common.notImplemented())}
          />
        </SettingGroup>

        <SettingGroup>
          <SettingItem
            title={LL.settings.personalInfoCollectionUse()}
            onPress={() => {
              router.push({
                pathname: '/pdf-viewer',
                params: {
                  url: '',
                },
              });
            }}
          />
          <SettingItem
            title={LL.settings.personalInfoThirdPartySharing()}
            onPress={() => {
              router.push('/pdf-viewer?url=');
            }}
          />
          <SettingItem
            title={LL.settings.systemPermissionUsage()}
            onPress={() => {
              router.push('/pdf-viewer?url=');
            }}
          />
          <SettingItem
            title={LL.settings.algorithmFiling()}
            onPress={() => {
              router.push('/pdf-viewer?url=');
            }}
          />
        </SettingGroup>

        <SettingGroup>
          <SettingItem title={LL.settings.deleteAccount()} onPress={() => router.push('/destroy-account')} />
        </SettingGroup>
      </ScrollView>
    </View>
  );
}
