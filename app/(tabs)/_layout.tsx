import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import * as React from 'react';

import { HapticTab } from '~/components/HapticTab';
import { DiscoverHeader, HomeHeader, MineHeader } from '~/components/ui/custom-header';
import TabBarBackground from '~/components/ui/TabBarBackground';
import { useColorScheme } from '~/hooks/useColorScheme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

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
        headerShadowVisible: true,
        headerTintColor: '',
        tabBarStyle: {
          backgroundColor: '',
        },
        animation: 'none',
        tabBarBackground: TabBarBackground,
        headerTransparent: false,
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
