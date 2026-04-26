import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import * as React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useI18nContext } from '@/i18n/i18n-react';
import { NAV_THEME } from '@/lib/theme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { LL } = useI18nContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? NAV_THEME.dark.colors.primary : NAV_THEME.light.colors.primary,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#87867f' : '#5e5d59',
        tabBarHideOnKeyboard: true,
        headerTitleAllowFontScaling: true,
        tabBarButton: HapticTab as any,
        headerShown: false,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: '',
        },
        animation: 'none',
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: LL.tabs.home(),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'disc' : 'disc-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: LL.tabs.mine(),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: LL.tabs.discover(),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'planet' : 'planet-outline'} color={color} size={24} />
          ),
          tabBarBadge: 2,
        }}
      />
    </Tabs>
  );
}
