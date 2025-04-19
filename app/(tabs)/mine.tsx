import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  Headphones,
  Heart,
  HelpCircle,
  Info,
  MapPin,
  MessageSquare,
  QrCode,
  Settings,
  ShoppingCart,
  Star,
  Ticket,
  User,
  Users,
  Wallet,
} from 'lucide-react-native';
import React from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '~/store/auth';

interface ItemEntry {
  title: string;
  icon: string;
  iconColor: string;
  route?: string;
}

// 快捷入口数据
const quickLinks: ItemEntry[][] = [
  [
    { title: '订单管理', icon: 'ClipboardList', iconColor: '#4f46e5' },
    { title: '收货地址', icon: 'MapPin', iconColor: '#0891b2' },
    { title: '我的收藏', icon: 'Heart', iconColor: '#e11d48' },
    { title: '优惠券', icon: 'Ticket', iconColor: '#f59e0b' },
    { title: '我的积分', icon: 'Star', iconColor: '#f97316' },
  ],
  [
    { title: '邀请好友', icon: 'Users', iconColor: '#8b5cf6' },
    { title: '我的钱包', icon: 'Wallet', iconColor: '#10b981' },
    { title: '购物车', icon: 'ShoppingCart', iconColor: '#6366f1' },
    { title: '历史浏览', icon: 'Clock', iconColor: '#0ea5e9' },
    { title: '消息通知', icon: 'Bell', iconColor: '#ec4899' },
  ],
];

// 其他入口数据
const otherEntries: ItemEntry[] = [
  { title: '银行卡管理', icon: 'CreditCard', iconColor: '#6366f1' },
  { title: '帮助中心', icon: 'HelpCircle', iconColor: '#10b981', route: '/help' },
  { title: '意见反馈', icon: 'MessageSquare', iconColor: '#f59e0b', route: '/feedback' },
  { title: '关于我们', icon: 'Info', iconColor: '#0ea5e9', route: '/about' },
];

// 图标组件
const IconComponent = ({ name, size = 24, color = '#555' }: { name: string; size?: number; color?: string }) => {
  const props = { size, color, strokeWidth: 2 };

  switch (name) {
    case 'ClipboardList':
      return <ClipboardList {...props} />;
    case 'MapPin':
      return <MapPin {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'Ticket':
      return <Ticket {...props} />;
    case 'Star':
      return <Star {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'ShoppingCart':
      return <ShoppingCart {...props} />;
    case 'Clock':
      return <Clock {...props} />;
    case 'Bell':
      return <Bell {...props} />;
    case 'CreditCard':
      return <CreditCard {...props} />;
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
    case 'User':
      return <User {...props} />;
    default:
      return <Info {...props} />;
  }
};

// 头部组件：用户信息或登录注册按钮
const UserHeader = () => {
  const router = useRouter();
  const { session, avatar, name, mobile, signOut } = useAuth();

  if (session) {
    return (
      <View className="flex-row items-center p-4">
        <Image source={{ uri: avatar || '' }} className="w-12 h-12 rounded-full bg-gray-100" />
        <View className="ml-4">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-gray-500">{mobile || '未绑定手机号'}</Text>
        </View>
        <View className="ml-auto">
          <TouchableOpacity onPress={signOut}>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between p-4">
      <TouchableOpacity className="flex-row items-center" onPress={() => router.push('/login')}>
        <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center">
          <User size={24} color="#999" strokeWidth={1.5} />
        </View>
        <Text className="ml-4 text-lg font-bold">登录/注册</Text>
      </TouchableOpacity>
      <ChevronRight size={20} color="#999" />
    </View>
  );
};

// 快捷入口组件
const QuickLinksSection = () => {
  const handleQuickLinkPress = (item: ItemEntry) => {
    Alert.alert('功能开发中', `您点击了：${item.title}`);
  };

  return (
    <View className="bg-white rounded-lg mx-4 mb-4 p-4">
      <View className="flex-row justify-between mb-5">
        {quickLinks[0].map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center"
            style={{ width: '18%' }}
            onPress={() => handleQuickLinkPress(item)}
          >
            <View
              className="w-9 h-9 rounded-full items-center justify-center mb-1"
              style={{ backgroundColor: `${item.iconColor}15` }}
            >
              <IconComponent name={item.icon} size={20} color={item.iconColor} />
            </View>
            <Text className="text-xs text-center">{item.title}</Text>
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
              className="w-9 h-9 rounded-full items-center justify-center mb-1"
              style={{ backgroundColor: `${item.iconColor}15` }}
            >
              <IconComponent name={item.icon} size={20} color={item.iconColor} />
            </View>
            <Text className="text-xs text-center">{item.title}</Text>
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
    } else {
      Alert.alert('功能开发中', `您点击了：${item.title}`);
    }
  };

  return (
    <View className="bg-white rounded-lg px-4 mb-4 mx-4">
      {otherEntries.map((item, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity className="flex-row items-center py-3" onPress={() => handleEntryPress(item)}>
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${item.iconColor}15` }}
            >
              <IconComponent name={item.icon} size={18} color={item.iconColor} />
            </View>
            <Text className="flex-1">{item.title}</Text>
            <ChevronRight size={20} color="#999" />
          </TouchableOpacity>
          {index < otherEntries.length - 1 && <View className="border-b border-gray-100" />}
        </React.Fragment>
      ))}
    </View>
  );
};

export default function MinePage() {
  // 处理图标点击
  const handleTopIconPress = (action: string) => {
    switch (action) {
      case 'scan':
        Alert.alert('扫一扫', '功能开发中...');
        break;
      case 'settings':
        Alert.alert('设置', '功能开发中...');
        break;
      case 'service':
        Alert.alert('客服', '功能开发中...');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* 顶部图标栏 - 放置在导航栏上方 */}
      <View className="flex-row justify-end px-4 py-2 bg-white">
        <TouchableOpacity className="p-2" onPress={() => handleTopIconPress('scan')}>
          <QrCode size={20} color="#333" strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity className="p-2" onPress={() => handleTopIconPress('settings')}>
          <Settings size={20} color="#333" strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity className="p-2" onPress={() => handleTopIconPress('service')}>
          <Headphones size={20} color="#333" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* 顶部用户信息区域 */}
        <View className="bg-white m-4 rounded-lg">
          <UserHeader />
        </View>

        {/* 中间快捷入口区域 */}
        <QuickLinksSection />

        {/* 底部其他入口区域 */}
        <OtherEntriesSection />
      </ScrollView>
    </SafeAreaView>
  );
}
