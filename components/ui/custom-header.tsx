import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { Bell, Headphones, QrCode, Settings } from 'lucide-react-native';
import React from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { Text } from '~/components/ui/text';
import { useScrollStore } from '~/store/scroll';

interface CustomHeaderProps {
  title: string;
  scrollY?: Animated.Value;
  backgroundImageSource?: ImageSourcePropType;
  rightButtons?: {
    icon: React.ReactNode;
    onPress: () => void;
  }[];
}

const BREAK_POINT = 50;

export function CustomHeader({
  title,
  scrollY = new Animated.Value(0),
  backgroundImageSource,
  rightButtons = [],
}: CustomHeaderProps) {
  const statusBarHeight = Constants.statusBarHeight || 0;
  const headerHeight = (Platform.OS === 'ios' ? 44 : 56) + statusBarHeight;

  const pathname = usePathname();

  const { width } = useWindowDimensions();

  // 计算渐变背景的颜色变化
  const gradientOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // 判断当前路由，为不同页面提供不同的渐变颜色
  const getGradientColors = () => {
    if (pathname.includes('mine')) {
      return ['#ff9a9e', '#fad0c4'];
    } else if (pathname.includes('discover')) {
      return ['#10b981', '#059669'];
    }
    return ['#3b82f6', '#2563eb'];
  };

  const useDarkStyle = Number((scrollY as any)._value) >= BREAK_POINT;
  return (
    <>
      {/* <StatusBar style={useDarkStyle ? 'dark' : 'light'} /> */}

      {/* 渐变背景或图片背景 */}
      <Animated.View
        className="absolute top-0 left-0 right-0 z-0"
        style={{
          height: headerHeight,
          opacity: gradientOpacity,
        }}
      >
        {backgroundImageSource ? (
          <Image source={backgroundImageSource} className="w-full h-full" style={{ width }} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={getGradientColors() as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: headerHeight }}
          />
        )}
      </Animated.View>

      {/* 实际内容区域，包含初始标题和操作按钮 */}
      <View
        className="z-10"
        style={{
          paddingTop: statusBarHeight,
          height: headerHeight,
        }}
      >
        <View className="flex-row items-center justify-between px-5 h-full">
          <Animated.View>
            <Text className="text-xl font-bold" style={{ color: useDarkStyle ? '#000' : '#fff' }}>
              {title}
            </Text>
          </Animated.View>
          <View className="flex-row">
            {rightButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                className="gap-3 size-10 items-center justify-center"
                onPress={button.onPress}
              >
                {button.icon}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

// 首页专用的Header组件
export function HomeHeader() {
  const router = useRouter();
  const { homeScrollY } = useScrollStore();

  const useDarkStyle = Number((homeScrollY as any)._value) >= BREAK_POINT;
  const rightButtons = [
    {
      icon: <Headphones size={20} color={useDarkStyle ? '#000' : '#fff'} />,
      onPress: () => router.push('/online-service'),
    },
    {
      icon: <Bell size={20} color={useDarkStyle ? '#000' : '#fff'} />,
      onPress: () => router.push('/notice'),
    },
  ];

  return (
    <CustomHeader
      title="首页"
      scrollY={homeScrollY}
      backgroundImageSource={require('~/assets/images/home-header-bg.jpg')}
      rightButtons={rightButtons}
    />
  );
}

// 我的页面专用的Header组件
export function MineHeader() {
  const router = useRouter();
  const { mineScrollY } = useScrollStore();

  const useDarkStyle = Number((mineScrollY as any)._value) >= BREAK_POINT;
  const rightButtons = [
    {
      icon: <QrCode size={20} color={useDarkStyle ? '#000' : '#fff'} />,
      onPress: () => router.push('/scan'),
    },
    {
      icon: <Settings size={20} color={useDarkStyle ? '#000' : '#fff'} />,
      onPress: () => router.push('/setting'),
    },
    {
      icon: <Headphones size={20} color={useDarkStyle ? '#000' : '#fff'} />,
      onPress: () => router.push('/online-service'),
    },
    {
      icon: <Bell size={20} color={useDarkStyle ? '#000' : '#fff'} />,
      onPress: () => router.push('/notice'),
    },
  ];

  return <CustomHeader title="我的" scrollY={mineScrollY} rightButtons={rightButtons} />;
}

// 发现页面专用的Header组件
export function DiscoverHeader() {
  const router = useRouter();
  const { discoverScrollY } = useScrollStore();

  const useDarkStyle = Number((discoverScrollY as any)._value) >= BREAK_POINT;
  const rightButtons = [
    {
      icon: <Bell size={20} color={useDarkStyle ? '#000' : '#fff'} />,
      onPress: () => router.push('/notice'),
    },
  ];

  return <CustomHeader title="发现" scrollY={discoverScrollY} rightButtons={rightButtons} />;
}
