import '~/global.css';

import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import * as Sentry from '@sentry/react-native';
import { focusManager, onlineManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isRunningInExpoGo } from 'expo';
import Constants from 'expo-constants';
import * as Network from 'expo-network';
import { Stack, useNavigationContainerRef } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import * as React from 'react';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { ThemeToggle } from '~/components/ThemeToggle';
import { DebugPanel } from '~/debug-panel';
import { useColorScheme } from '~/hooks/useColorScheme';
import { useIsomorphicLayoutEffect } from '~/hooks/useIsomorphicLayoutEffect';
import TypesafeI18n from '~/i18n/i18n-react';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { NAV_THEME } from '~/lib/constants';

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

// Sentry.init({
//   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
//   debug: process.env.NODE_ENV === 'development',
//   sendDefaultPii: true,
//   tracesSampleRate: 1.0,
//   profilesSampleRate: 1.0,
//   integrations: [navigationIntegration],
//   enableNativeFramesTracking: !isRunningInExpoGo(),
// });

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

function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  useReactQueryDevTools(queryClient);

  const hasMounted = React.useRef(false);

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const { isUpdatePending } = Updates.useUpdates();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  // Capture the NavigationContainer ref and register it with the integration.
  useEffect(() => {
    if (navigationRef?.current) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

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

  // async function onFetchUpdateAsync() {
  //   try {
  //     const update = await Updates.checkForUpdateAsync();

  //     if (update.isAvailable) {
  //       await Updates.fetchUpdateAsync();
  //       await Updates.reloadAsync();
  //     }
  //   } catch (error) {
  //     alert(`Error fetching latest Expo update: ${error}`);
  //   }
  // }

  useEffect(() => {
    // onFetchUpdateAsync();
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  // TODO:
  // useEffect(() => {
  //   if (isUpdatePending) {
  //     const isConfirm = confirm('A new update is available. Reload app?');
  //     if (isConfirm) {
  //       Updates.reloadAsync();
  //     }
  //   }
  // }, [isUpdatePending]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  // 使用环境变量或自定义配置控制DebugPanel的显示
  const showDebugPanel = __DEV__ || Constants.expoConfig?.extra?.enableDebugPanel;

  return (
    <>
      {showDebugPanel ? <DebugPanel /> : null}
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            {/* TODO: TypeError: Cannot read property 'prototype' of undefined */}
            {/* <TypesafeI18n locale={'zh'}> */}
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
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
              <Stack.Screen name="+not-found" />
            </Stack>
            <PortalHost />
            {/* </TypesafeI18n> */}
          </ThemeProvider>
        </QueryClientProvider>
      </KeyboardProvider>

      {/* 苹果接力 https://docs.expo.dev/router/advanced/apple-handoff/ */}
      <Head>
        <meta property="expo:handoff" content="true" />
      </Head>
    </>
  );
}

export default Sentry.wrap(RootLayout);
