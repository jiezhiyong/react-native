import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import * as React from 'react';

import { HapticTab } from '~/components/HapticTab';
import { BREAK_POINT, DiscoverHeader, HomeHeader, MineHeader } from '~/components/ui/custom-header';
import TabBarBackground from '~/components/ui/TabBarBackground';
import { useColorScheme } from '~/hooks/useColorScheme';
import { useTabsScrollStore } from '~/store/scroll';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { setActiveTab, homeScrollValue, mineScrollValue, discoverScrollValue, setStatusBarStyle } =
    useTabsScrollStore();

  // 根据当前tab的滚动值设置状态栏样式
  const handleTabPress = (tab: 'home' | 'mine' | 'discover') => {
    setActiveTab(tab);

    setTimeout(() => {
      if (tab === 'home') {
        setStatusBarStyle(homeScrollValue > BREAK_POINT ? 'dark' : 'light');
      } else if (tab === 'mine') {
        setStatusBarStyle(mineScrollValue > BREAK_POINT ? 'dark' : 'light');
      } else if (tab === 'discover') {
        setStatusBarStyle(discoverScrollValue > BREAK_POINT ? 'dark' : 'light');
      }
    }, 0);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
        tabBarHideOnKeyboard: true,
        headerTitleAllowFontScaling: true,
        tabBarButton: HapticTab,
        headerStyle: {
          backgroundColor: '',
        },
        headerShown: true,
        headerShadowVisible: false,
        headerTintColor: '',
        tabBarStyle: {
          backgroundColor: '',
        },
        animation: 'none',
        tabBarBackground: TabBarBackground,
        headerTransparent: false,
      }}
      screenListeners={{
        tabPress: (e) => {
          const route = e.target?.split('-')[0];
          if (route === 'index') handleTabPress('home');
          else if (route === 'mine') handleTabPress('mine');
          else if (route === 'discover') handleTabPress('discover');
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'disc' : 'disc-outline'} color={color} size={24} />
          ),
          headerShown: true,
          header: () => <HomeHeader />,
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: 'Mine',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
          headerShown: true,
          header: () => <MineHeader />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'planet' : 'planet-outline'} color={color} size={24} />
          ),
          headerShown: true,
          header: () => <DiscoverHeader />,
        }}
      />
    </Tabs>
  );
}
