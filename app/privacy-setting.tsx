import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PrivacyItemProps {
  title: string;
  description?: string;
  hasSwitch?: boolean;
  hasChevron?: boolean;
  defaultValue?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
}

const PrivacyItem = ({
  title,
  description,
  hasSwitch = false,
  hasChevron = false,
  defaultValue = false,
  onValueChange,
  onPress,
}: PrivacyItemProps) => {
  const [isEnabled, setIsEnabled] = React.useState(defaultValue);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    onValueChange && onValueChange(newValue);
  };

  return (
    <TouchableOpacity
      className="px-5 py-4"
      activeOpacity={hasSwitch ? 1 : 0.7}
      onPress={hasSwitch ? undefined : onPress}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text className="font-medium text-lg text-foreground">{title}</Text>
          {description && <Text className="text-sm text-muted-foreground mt-1">{description}</Text>}
        </View>

        {hasSwitch && (
          <Switch
            trackColor={{ false: '#e8e6dc', true: '#c96442' }}
            thumbColor={'#faf9f5'}
            ios_backgroundColor="#e8e6dc"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        )}

        {hasChevron && <ChevronRight size={20} color="#87867f" />}
      </View>
    </TouchableOpacity>
  );
};

const PrivacyGroup = ({ children }: { children: React.ReactNode }) => {
  return <View className="bg-card rounded-xl overflow-hidden mb-4 border border-border">{children}</View>;
};

export default function PrivacySettingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 px-5 py-5">
        {/* 个性化推荐组 */}
        <PrivacyGroup>
          <PrivacyItem
            title="个性化内容推荐"
            description="展示个性化内容，提升预订体验"
            hasSwitch
            defaultValue={true}
          />
          <View className="h-px bg-border mx-4" />

          <PrivacyItem
            title="个性化广告推荐"
            description="及时获取周边的优惠、促销信息"
            hasSwitch
            defaultValue={true}
          />
        </PrivacyGroup>

        {/* 系统权限管理 */}
        <PrivacyGroup>
          <PrivacyItem
            title="系统权限管理"
            description="管理您已授权在APP使用的系统权限"
            hasChevron
            onPress={() => router.push('/system-permissions')}
          />
        </PrivacyGroup>

        {/* 隐私协议组 */}
        <PrivacyGroup>
          <PrivacyItem title="隐私协议授权" description="授权后可享受会员相关服务" hasSwitch defaultValue={true} />
          <View className="h-px bg-border mx-4" />

          <PrivacyItem title="隐私政策条款" hasChevron onPress={() => router.push('/privacy-policy')} />
        </PrivacyGroup>
      </ScrollView>
    </SafeAreaView>
  );
}
