import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  Headphones,
  HelpCircle,
  Info,
  MessageSquare,
  QrCode,
  Settings,
  User,
} from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ScrollHeader } from '@/components/ui/scroll-header';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { useAuth } from '@/store/auth';

interface ItemEntry {
  title: string;
  icon: string;
  iconColor: string;
  route?: string;
}

// 快捷入口数据
const quickLinks: ItemEntry[][] = [
  [
    { title: '消息通知', icon: 'Bell', iconColor: '#c96442', route: '/notice' },
    { title: '消息通知', icon: 'Bell', iconColor: '#b53333', route: '/notice' },
    { title: '消息通知', icon: 'Bell', iconColor: '#a66f3a', route: '/notice' },
    { title: '消息通知', icon: 'Bell', iconColor: '#d97757', route: '/notice' },
  ],
  [
    { title: '消息通知', icon: 'Bell', iconColor: '#7f6f46', route: '/notice' },
    { title: '消息通知', icon: 'Bell', iconColor: '#8b7358', route: '/notice' },
    { title: '消息通知', icon: 'Bell', iconColor: '#5f6f52', route: '/notice' },
    { title: '消息通知', icon: 'Bell', iconColor: '#9c5f4b', route: '/notice' },
  ],
];

// 其他入口数据
const otherEntries: ItemEntry[] = [
  { title: '帮助中心', icon: 'HelpCircle', iconColor: '#5f6f52', route: '/support' },
  { title: '意见反馈', icon: 'MessageSquare', iconColor: '#c96442', route: '/feedback' },
  { title: '关于我们', icon: 'Info', iconColor: '#8b7358', route: '/about' },
];

// 图标组件
const IconComponent = ({ name, size = 24, color = '#5e5d59' }: { name: string; size?: number; color?: string }) => {
  const props = { size, color, strokeWidth: 2 };

  switch (name) {
    case 'Bell':
      return <Bell {...props} />;
    case 'HelpCircle':
      return <HelpCircle {...props} />;
    case 'MessageSquare':
      return <MessageSquare {...props} />;
    case 'Headphones':
      return <Headphones {...props} />;
    case 'Info':
      return <Info {...props} />;
    case 'ChevronRight':
      return <ChevronRight {...props} />;
    default:
      return <Info {...props} />;
  }
};

// 头部组件：用户信息或登录注册按钮
const UserHeader = () => {
  const router = useRouter();
  const { session, name, mobile, signOut } = useAuth();

  if (session) {
    return (
      <View className="flex-row items-center px-4 py-6">
        <View className="border border-border rounded-full p-1">
          <Image source={require('@/assets/images/icon.png')} className="w-12 h-12 rounded-full bg-muted" />
        </View>
        <View className="ml-4">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-muted-foreground">{mobile || '未绑定手机号'}</Text>
        </View>
        <View className="ml-auto">
          <TouchableOpacity onPress={signOut} className="flex-row items-center">
            <Text className="text-sm">登出</Text>
            <ChevronRight size={20} color="#87867f" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between p-4">
      <TouchableOpacity className="flex-row items-center" onPress={() => router.push('/login')}>
        <View className="w-12 h-12 rounded-full bg-muted items-center justify-center">
          <User size={24} color="#87867f" strokeWidth={1.5} />
        </View>
        <Text className="ml-4 text-lg font-bold">登录/注册</Text>
      </TouchableOpacity>
      <ChevronRight size={20} color="#87867f" />
    </View>
  );
};

// 快捷入口组件
const QuickLinksSection = () => {
  const router = useRouter();
  const handleQuickLinkPress = (item: ItemEntry) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View className="bg-card rounded-xl mx-5 mb-5 px-4 py-6 border border-border">
      <View className="flex-row justify-between mb-5">
        {quickLinks[0].map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center"
            style={{ width: '18%' }}
            onPress={() => handleQuickLinkPress(item)}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-1"
              style={{ backgroundColor: `${item.iconColor}15` }}
            >
              <IconComponent name={item.icon} size={20} color={item.iconColor} />
            </View>
            <Text className="text-sm text-center">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="flex-row justify-between">
        {quickLinks[1].map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center"
            style={{ width: '18%' }}
            onPress={() => handleQuickLinkPress(item)}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mb-1"
              style={{ backgroundColor: `${item.iconColor}15` }}
            >
              <IconComponent name={item.icon} size={20} color={item.iconColor} />
            </View>
            <Text className="text-sm text-center">{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// 其他入口组件
const OtherEntriesSection = () => {
  const router = useRouter();
  const handleEntryPress = (item: ItemEntry) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View className="bg-card rounded-xl px-4 mb-5 mx-5 border border-border">
      {otherEntries.map((item, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity className="flex-row items-center py-4" onPress={() => handleEntryPress(item)}>
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${item.iconColor}15` }}
            >
              <IconComponent name={item.icon} size={18} color={item.iconColor} />
            </View>
            <Text className="flex-1">{item.title}</Text>
            <ChevronRight size={20} color="#87867f" />
          </TouchableOpacity>
          {index < otherEntries.length - 1 && <View className="border-b border-border" />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default function MinePage() {
  const router = useRouter();
  const { scrollY, scrollHandler, isDarkStyle, headerHeight } = useScrollHeader();
  const c = isDarkStyle ? '#141413' : '#faf9f5';

  const rightButtons = [
    { icon: <QrCode size={20} color={c} />, onPress: () => router.push('/scan' as any) },
    { icon: <Settings size={20} color={c} />, onPress: () => router.push('/setting' as any) },
    { icon: <Headphones size={20} color={c} />, onPress: () => router.push('/online-service' as any) },
    { icon: <Bell size={20} color={c} />, onPress: () => router.push('/notice' as any) },
  ];

  return (
    <View className="flex-1">
      <ScrollHeader
        title="我的"
        scrollY={scrollY}
        gradientColors={['#c96442', '#d9b9a5']}
        rightButtons={rightButtons}
      />
      <Animated.ScrollView
        className="flex-1 bg-background"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        <View className="mx-5 mt-5 rounded-xl bg-card border border-border mb-5">
          <UserHeader />
        </View>
        <QuickLinksSection />
        <OtherEntriesSection />
      </Animated.ScrollView>
    </View>
  );
}
