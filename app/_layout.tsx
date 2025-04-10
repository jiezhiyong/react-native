import '~/global.css';

import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Network from 'expo-network';
import { Stack, useNavigationContainerRef } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';

import { ThemeToggle } from '~/components/ThemeToggle';
import { useColorScheme } from '~/hooks/useColorScheme';
import { useIsomorphicLayoutEffect } from '~/hooks/useIsomorphicLayoutEffect';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// 创建一个QueryClient实例，并配置默认选项
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 数据5分钟内不会被标记为过期
      gcTime: 1000 * 60 * 10, // 未使用的数据10分钟后会被垃圾回收
      retry: 1, // 失败时最多重试1次
      refetchOnWindowFocus: true, // 窗口获得焦点时自动重新获取数据
    },
  },
});

// 在线状态管理 - 自动重新连接时的自动重新获取
// TODO: npx expo export -p web 时报错 Module implementation must be a class
// try {
//   onlineManager.setEventListener((setOnline) => {
//     const eventSubscription = Network.addNetworkStateListener((state) => {
//       setOnline(!!state.isConnected);
//     });
//     return eventSubscription.remove;
//   });
// } catch (error) {
//   console.error('Failed to set online event listener:', error);
// }

// 应用程序聚焦时重新获取
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

// LogRocket
// LogRocket.init('zu1q7o/qa-chat');

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  useReactQueryDevTools(queryClient);

  const hasMounted = React.useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(colorScheme);
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                title: 'Starter Tabs',
                headerRight: () => <ThemeToggle />,
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                presentation: 'modal',
                title: '登录',
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="(protected)"
              options={{
                headerShown: true,
                title: '受保护内容',
              }}
            />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>

      {/* 苹果接力 https://docs.expo.dev/router/advanced/apple-handoff/ */}
      <Head>
        <meta property="expo:handoff" content="true" />
      </Head>
    </React.StrictMode>
  );
}
