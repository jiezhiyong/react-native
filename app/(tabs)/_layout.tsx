import { NativeTabs } from 'expo-router/unstable-native-tabs';
import * as React from 'react';
import { type ColorValue, DynamicColorIOS, Platform } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useI18nContext } from '@/i18n/i18n-react';
import { NAV_THEME } from '@/lib/theme';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { LL } = useI18nContext();
  const tintColor: ColorValue =
    Platform.OS === 'ios'
      ? DynamicColorIOS({
          dark: 'white',
          light: 'black',
        })
      : colorScheme === 'dark'
        ? NAV_THEME.dark.colors.primary
        : NAV_THEME.light.colors.primary;

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor={tintColor}
      labelStyle={{
        color: tintColor,
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{LL.tabs.home()}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'record.circle', selected: 'record.circle.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="mine">
        <NativeTabs.Trigger.Label>{LL.tabs.mine()}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="discover">
        <NativeTabs.Trigger.Label>{LL.tabs.discover()}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'globe', selected: 'globe.americas.fill' }} md="travel_explore" />
        <NativeTabs.Trigger.Badge>2</NativeTabs.Trigger.Badge>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
