import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { Button, Divider, Heading, RefreshIcon, Row, Spacer, Text, View, XIcon } from 'expo-dev-client-components';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Updates from 'expo-updates';
import { ChevronLeft, Database, Eraser, Globe, House, LockKeyhole, RefreshCcw } from 'lucide-react-native';
import * as React from 'react';
import { Alert, DevSettings, ScrollView as NativeScrollView, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDebugSettingsStore } from '@/lib/debug-settings';
import { secureStorage } from '@/lib/secure-storage';
import { useAuthStore } from '@/store/auth';
import { DEFAULT_LOCALE, useLocaleStore } from '@/store/locale';
import { useScanHistoryStore } from '@/store/scan-history';

import { DEBUG_STORAGE_SCOPES, isDebugSettingsKey } from '../config/storageScopes';
import { useDebugPanelStore } from '../hooks/useDebugPanel';

import { AppInfoRow } from './AppInfoRow';
import { SettingsRowButton } from './SettingsRowButton';
import { SettingsRowSwitch } from './SettingsRowSwitch';

const ENV_NAME = ['inte', 'rc', 'prod'] as const;
const ENV_API: Record<(typeof ENV_NAME)[number], string | undefined> = {
  [ENV_NAME[0]]: process.env.EXPO_PUBLIC_API_URL_INTE,
  [ENV_NAME[1]]: process.env.EXPO_PUBLIC_API_URL_RC,
  [ENV_NAME[2]]: process.env.EXPO_PUBLIC_API_URL_PROD,
};

const MAX_STORAGE_VALUE_LINES = 80;
const MAX_STORAGE_VALUE_LENGTH = 6000;

type DebugPanelScreen = 'main' | 'asyncStorage';

type FormattedStorageValue = {
  text: string;
  isTruncated: boolean;
};

function limitStorageValue(value: string): FormattedStorageValue {
  let text = value;
  let isTruncated = false;

  if (text.length > MAX_STORAGE_VALUE_LENGTH) {
    text = text.slice(0, MAX_STORAGE_VALUE_LENGTH);
    isTruncated = true;
  }

  const lines = text.split('\n');

  if (lines.length > MAX_STORAGE_VALUE_LINES) {
    text = lines.slice(0, MAX_STORAGE_VALUE_LINES).join('\n');
    isTruncated = true;
  }

  return { text, isTruncated };
}

function getFormattedStorageValue(value: string | null): FormattedStorageValue {
  if (!value) {
    return { text: '', isTruncated: false };
  }

  const trimmedValue = value.trim();

  if (trimmedValue.startsWith('{') || trimmedValue.startsWith('[')) {
    try {
      return limitStorageValue(JSON.stringify(JSON.parse(trimmedValue), null, 2));
    } catch {
      return limitStorageValue(value);
    }
  }

  return limitStorageValue(value);
}

async function clearPersistedZustandStores(scopeId: (typeof DEBUG_STORAGE_SCOPES)[number]['id']) {
  if (scopeId === 'business-cache' || scopeId === 'all') {
    useScanHistoryStore.setState({ history: [] });
    useLocaleStore.setState({ locale: DEFAULT_LOCALE });
    await Promise.all([useScanHistoryStore.persist.clearStorage(), useLocaleStore.persist.clearStorage()]);
  }

  if (scopeId === 'auth' || scopeId === 'all') {
    useAuthStore.setState({
      session: null,
      id: null,
      name: null,
      avatar: null,
      mobile: null,
      isLoading: false,
    });
    await useAuthStore.persist.clearStorage();
  }
}

export function Main() {
  const sheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['63.6%', '100%'], []);

  const { top, bottom } = useSafeAreaInsets();
  const { isVisible, setVisible } = useDebugPanelStore();
  const settings = useDebugSettingsStore((state) => state.settings);
  const hydrateDebugSettings = useDebugSettingsStore((state) => state.hydrate);
  const updateDebugSettings = useDebugSettingsStore((state) => state.updateSettings);

  const [screen, setScreen] = React.useState<DebugPanelScreen>('main');
  const [storageItems, setStorageItems] = React.useState<string[][]>([]);
  const env = settings.apiEnv;
  const api = ENV_API[env];
  const bottomSafeDistance = Math.max(bottom, 16);
  const scrollContentStyle = React.useMemo(
    () => ({ paddingBottom: bottomSafeDistance + (Platform.OS === 'android' ? 50 : 24) }),
    [bottomSafeDistance]
  );

  const getAllStorageItems = React.useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const results = await AsyncStorage.multiGet(keys);
      setStorageItems([...results] as string[][]);
    } catch (e) {
      console.error('获取AsyncStorage内容失败', e);
      setStorageItems([]);
    }
  }, []);

  const updateDebugSettingsAndRefreshStorageItems = React.useCallback(
    async (updater: Parameters<typeof updateDebugSettings>[0]) => {
      await updateDebugSettings(updater);
      await getAllStorageItems();
    },
    [getAllStorageItems, updateDebugSettings]
  );

  React.useEffect(() => {
    hydrateDebugSettings();
  }, [hydrateDebugSettings]);

  React.useEffect(() => {
    if (isVisible) {
      sheetRef.current?.expand();
    }
  }, [isVisible]);

  const handleClosePress = React.useCallback(() => {
    sheetRef.current?.close();
    setTimeout(() => {
      setVisible(false);
      setScreen('main');
    }, 300);
  }, [setVisible]);

  const showMessage = React.useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      const webGlobal = globalThis as typeof globalThis & { alert?: (message?: string) => void };
      webGlobal.alert?.(`${title}\n\n${message}`);
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      Alert.alert(title, message, [{ text: '确定', onPress: () => resolve() }]);
    });
  }, []);

  const confirmAction = React.useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      const webGlobal = globalThis as typeof globalThis & { confirm?: (message?: string) => boolean };
      return Promise.resolve(webGlobal.confirm?.(`${title}\n\n${message}`) ?? false);
    }

    return new Promise<boolean>((resolve) => {
      Alert.alert(title, message, [
        { text: '取消', style: 'cancel', onPress: () => resolve(false) },
        { text: '清除', style: 'destructive', onPress: () => resolve(true) },
      ]);
    });
  }, []);

  const handleReloadPress = React.useCallback(async () => {
    try {
      if (__DEV__ && DevSettings) {
        DevSettings.reload();
        return;
      }

      await Updates.reloadAsync();
    } catch (error) {
      console.error('重启APP失败:', error);
    }
  }, []);

  const handleStorageScopePress = React.useCallback(
    async (scopeId: (typeof DEBUG_STORAGE_SCOPES)[number]['id']) => {
      const scope = DEBUG_STORAGE_SCOPES.find((item) => item.id === scopeId);

      if (!scope) {
        return;
      }

      try {
        const keys = await AsyncStorage.getAllKeys();
        const matchedKeys = keys.filter(
          (key) => scope.matchKey(key) && (scope.id === 'all' || !isDebugSettingsKey(key))
        );
        const secureStorageKeys = scope.secureStorageKeys ?? [];

        if (scope.requiresConfirm) {
          const shouldClear = await confirmAction(scope.label, `${scope.description}\n\n此操作不可撤销。`);

          if (!shouldClear) {
            return;
          }
        }

        if (matchedKeys.length > 0) {
          await AsyncStorage.multiRemove(matchedKeys);
        }

        await Promise.all(secureStorageKeys.map((key) => secureStorage.removeItem(key)));
        await clearPersistedZustandStores(scope.id);

        if (scope.id === 'all') {
          await hydrateDebugSettings();
        }

        await getAllStorageItems();
        await showMessage(
          '清理完成',
          `已删除 ${matchedKeys.length} 个 AsyncStorage key` +
            (secureStorageKeys.length > 0 ? `，并清除 ${secureStorageKeys.length} 个 SecureStore key。` : '。')
        );
      } catch (error) {
        console.error('AsyncStorage 清理失败', error);
      }
    },
    [confirmAction, getAllStorageItems, hydrateDebugSettings, showMessage]
  );

  const handleOpenAsyncStorageManager = React.useCallback(() => {
    setScreen('asyncStorage');
    getAllStorageItems();
  }, [getAllStorageItems]);

  const handleBackToMain = React.useCallback(() => {
    setScreen('main');
  }, []);

  const handleApiEnvPress = React.useCallback(() => {
    const index = ENV_NAME.indexOf(env);
    const nextIndex = (index + 1) % ENV_NAME.length;
    const nextEnv = ENV_NAME[nextIndex];

    updateDebugSettingsAndRefreshStorageItems((currentSettings) => ({
      ...currentSettings,
      apiEnv: nextEnv,
    }));
  }, [env, updateDebugSettingsAndRefreshStorageItems]);

  const handleRequestEncryptionChange = React.useCallback(
    (isEnabled: boolean) => {
      updateDebugSettingsAndRefreshStorageItems((currentSettings) => ({
        ...currentSettings,
        requestEncryptionEnabled: isEnabled,
      }));
    },
    [updateDebugSettingsAndRefreshStorageItems]
  );

  const handleHomePress = React.useCallback(() => {
    try {
      router.replace('/');
      setVisible(false);
    } catch (error) {
      console.error('导航到首页失败:', error);
    }
  }, [setVisible]);

  return (
    <>
      {isVisible && (
        <GestureHandlerRootView style={styles.container}>
          <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            enablePanDownToClose
            handleComponent={null}
            topInset={top}
            backdropComponent={(props) => (
              <BottomSheetBackdrop {...props} enableTouchThrough appearsOnIndex={0} disappearsOnIndex={-1} />
            )}
            onClose={handleClosePress}
          >
            <View flex="1" bg="secondary" rounded="large" overflow="hidden">
              {screen === 'main' ? (
                <DebugPanelMainScreen
                  api={api}
                  env={env}
                  isRequestEncryptionEnabled={settings.requestEncryptionEnabled}
                  scrollContentStyle={scrollContentStyle}
                  onApiEnvPress={handleApiEnvPress}
                  onAsyncStoragePress={handleOpenAsyncStorageManager}
                  onClose={handleClosePress}
                  onHomePress={handleHomePress}
                  onReloadPress={handleReloadPress}
                  onRequestEncryptionChange={handleRequestEncryptionChange}
                />
              ) : (
                <AsyncStorageManagerScreen
                  storageItems={storageItems}
                  onBack={handleBackToMain}
                  onRefresh={getAllStorageItems}
                  onStorageScopePress={handleStorageScopePress}
                />
              )}
            </View>
          </BottomSheet>
        </GestureHandlerRootView>
      )}
    </>
  );
}

function DebugPanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <View py="medium" bg="default">
      <Row align="start">
        {Platform.OS === 'web' ? <View style={{ width: 16 }} /> : <Spacer.Horizontal size="medium" />}
        <Row align="center" grow="1" shrink="1">
          <View height="xl" width="xl" overflow="hidden" bg="secondary" rounded="medium">
            <Image source={require('@/assets/images/icon.png')} resizeMode="contain" style={styles.appIcon} />
          </View>

          {Platform.OS === 'web' ? <View style={{ width: 12 }} /> : <Spacer.Horizontal size="small" />}

          <View grow="1" shrink="1">
            <Heading weight="bold" numberOfLines={1}>
              {Constants.expoConfig?.name} - Test Tools
            </Heading>
            <Text size="small" color="secondary" style={{ marginTop: -4 }}>
              version: {Application.nativeApplicationVersion || Constants.expoConfig?.version || '-'} (
              {Application.nativeBuildVersion})
            </Text>
          </View>

          {Platform.OS === 'web' ? <View style={{ width: 12 }} /> : <Spacer.Horizontal />}

          <View width="large" style={{ alignSelf: 'flex-start' }}>
            <Button.FadeOnPressContainer onPress={onClose} bg="ghost" rounded="full">
              <View padding="micro">
                <XIcon />
              </View>
            </Button.FadeOnPressContainer>
          </View>

          {Platform.OS === 'web' ? <View style={{ width: 12 }} /> : <Spacer.Horizontal size="small" />}
        </Row>
      </Row>
    </View>
  );
}

type DebugPanelMainScreenProps = {
  api?: string;
  env: (typeof ENV_NAME)[number];
  isRequestEncryptionEnabled: boolean;
  onApiEnvPress: () => void;
  onAsyncStoragePress: () => void;
  onClose: () => void;
  onHomePress: () => void;
  onReloadPress: () => void;
  onRequestEncryptionChange: (isEnabled: boolean) => void;
  scrollContentStyle: { paddingBottom: number };
};

function DebugPanelMainScreen({
  api,
  env,
  isRequestEncryptionEnabled,
  onApiEnvPress,
  onAsyncStoragePress,
  onClose,
  onHomePress,
  onReloadPress,
  onRequestEncryptionChange,
  scrollContentStyle,
}: DebugPanelMainScreenProps) {
  return (
    <>
      <DebugPanelHeader onClose={onClose} />
      <Divider />
      <View style={styles.screen}>
        <BottomSheetScrollView contentContainerStyle={scrollContentStyle}>
          <View margin="small">
            <View bg="default" roundedTop="large">
              <SettingsRowButton
                label={`切换接口环境 (${env.charAt(0).toUpperCase() + env.slice(1)})`}
                description={api}
                icon={<Globe size={20} color="#444" />}
                onPress={onApiEnvPress}
              />
            </View>
            <Divider />
            <View bg="default" roundedBottom="large">
              <SettingsRowSwitch
                testID="request-encryption"
                label="切换请求加密"
                icon={<LockKeyhole size={20} color="#444" />}
                setIsEnabled={onRequestEncryptionChange}
                isEnabled={isRequestEncryptionEnabled}
              />
            </View>
          </View>

          <View mx="small" mb="small" rounded="large" overflow="hidden">
            <View bg="default">
              <SettingsRowButton
                label="AsyncStorage 管理"
                icon={<Database size={20} color="#444" />}
                onPress={onAsyncStoragePress}
              />
            </View>
            <Divider />
            <View bg="default" roundedTop="large">
              <SettingsRowButton
                label="重新加载"
                icon={<RefreshCcw size={20} color="#444" strokeWidth={1.66667} />}
                onPress={onReloadPress}
              />
            </View>
            <Divider />
            <View bg="default" roundedBottom="large">
              <SettingsRowButton label="返回首页" icon={<House size={20} color="#444" />} onPress={onHomePress} />
            </View>
          </View>

          <View mx="small" rounded="large" overflow="hidden">
            <AppInfoRow title="Bundle ID" value={Application.applicationId || '-'} />
            <Divider />
            <AppInfoRow title="OS" value={`${Platform.OS}, ${Platform.Version?.toString() || '-'}`} />
          </View>
        </BottomSheetScrollView>
      </View>
    </>
  );
}

type AsyncStorageManagerScreenProps = {
  onBack: () => void;
  onRefresh: () => void;
  onStorageScopePress: (scopeId: (typeof DEBUG_STORAGE_SCOPES)[number]['id']) => void;
  storageItems: string[][];
};

function AsyncStorageManagerScreen({
  onBack,
  onRefresh,
  onStorageScopePress,
  storageItems,
}: AsyncStorageManagerScreenProps) {
  return (
    <>
      <View py="small" bg="default">
        <Row align="center">
          <Spacer.Horizontal size="small" />
          <Button.FadeOnPressContainer onPress={onBack} bg="ghost" rounded="full">
            <View padding="micro">
              <ChevronLeft size={28} color="#444" />
            </View>
          </Button.FadeOnPressContainer>
          <Spacer.Horizontal size="small" />
          <Heading weight="bold">AsyncStorage 管理</Heading>
          <Spacer.Horizontal style={{ flex: 1 }} />
          <Button.FadeOnPressContainer onPress={onRefresh} bg="ghost" rounded="full">
            <View padding="micro">
              <RefreshIcon size="small" />
            </View>
          </Button.FadeOnPressContainer>
          <Spacer.Horizontal size="small" />
        </Row>
      </View>
      <Divider />
      <View style={styles.asyncStorageScreen}>
        <View mx="small" mb="small" rounded="large" overflow="hidden">
          {DEBUG_STORAGE_SCOPES.map((scope, index) => (
            <React.Fragment key={scope.id}>
              {index > 0 ? <Divider /> : null}
              <View bg="default">
                <SettingsRowButton
                  label={scope.label}
                  description={scope.description}
                  icon={<Eraser size={20} color="#444" />}
                  onPress={() => {
                    onStorageScopePress(scope.id);
                  }}
                />
              </View>
            </React.Fragment>
          ))}
        </View>

        <View bg="warning" padding="medium" rounded="medium" border="warning" style={styles.storageCard}>
          <NativeScrollView horizontal nestedScrollEnabled showsHorizontalScrollIndicator>
            <NativeScrollView nestedScrollEnabled showsVerticalScrollIndicator>
              <View style={styles.storageScrollContent}>
                {storageItems.length > 0 ? (
                  storageItems.map(([key, value], index) => {
                    const storageValue = getFormattedStorageValue(value);

                    return (
                      <View key={index} style={styles.storageItem}>
                        <Text size="small" color="warning" style={styles.storageKeyText}>
                          {index + 1}. {key}:
                        </Text>
                        <Text size="small" color="warning" style={styles.storageValueText}>
                          {storageValue.text}
                        </Text>
                        {storageValue.isTruncated ? (
                          <Text size="small" color="warning" style={styles.storageTruncatedText}>
                            ... 内容已截断
                          </Text>
                        ) : null}
                      </View>
                    );
                  })
                ) : (
                  <Text size="small" color="warning" style={styles.storageValueText}>
                    ...
                  </Text>
                )}
              </View>
            </NativeScrollView>
          </NativeScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appIcon: {
    flex: 1,
    width: '100%',
  },
  asyncStorageScreen: {
    flex: 1,
    paddingTop: 12,
  },
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  screen: {
    flex: 1,
  },
  storageCard: {
    height: 'auto',
    marginHorizontal: 12,
  },
  storageItem: {
    marginBottom: 8,
  },
  storageKeyText: {
    fontWeight: 'bold',
  },
  storageScrollContent: {
    alignItems: 'flex-start',
    paddingBottom: 8,
    paddingRight: 16,
  },
  storageTruncatedText: {
    marginTop: 2,
  },
  storageValueText: {
    color: '#7A4E00',
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
    marginTop: 4,
  },
});
