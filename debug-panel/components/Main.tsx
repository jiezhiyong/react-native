import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import {
  Button,
  Divider,
  Heading,
  Image,
  RefreshIcon,
  Row,
  Spacer,
  Text,
  View,
  XIcon,
} from 'expo-dev-client-components';
import { router } from 'expo-router';
import { Globe, House, LockKeyhole } from 'lucide-react-native';
import * as React from 'react';
import { DevSettings, Platform, Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDebugPanelStore } from '../hooks/useDebugPanel';

import { AppInfoRow } from './AppInfoRow';
import { SettingsRowButton } from './SettingsRowButton';
import { SettingsRowSwitch } from './SettingsRowSwitch';

// 环境变量映射 - ENV_NAME、ENV_API
const ENV_NAME = ['inte', 'rc', 'prod'];
const ENV_API = {
  [ENV_NAME[0]]: process.env.EXPO_PUBLIC_API_URL_INTE,
  [ENV_NAME[1]]: process.env.EXPO_PUBLIC_API_URL_RC,
  [ENV_NAME[2]]: process.env.EXPO_PUBLIC_API_URL_PROD,
};

export function Main() {
  const sheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['63.6%', '100%'], []);

  const { top } = useSafeAreaInsets();
  const { isVisible, setVisible } = useDebugPanelStore();

  const [env, setEnv] = React.useState(ENV_NAME[2]);
  const [api, setApi] = React.useState(ENV_API[env]);
  const [isRequestEncryptionEnabled, setRequestEncryptionEnabled] = React.useState(false);
  const [storageItems, setStorageItems] = React.useState<string[][]>([]);

  // 获取所有AsyncStorage键值对
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

  // 组件挂载时从 AsyncStorage 获取 env、requestEncryption 初始值
  React.useEffect(() => {
    const getEnv = async () => {
      try {
        const value = await AsyncStorage.getItem('env');
        if (value !== null) {
          setEnv(value);
        }
      } catch (e) {
        console.error('从 AsyncStorage 获取 env 状态失败', e);
      }
    };

    const getRequestEncryptionState = async () => {
      try {
        const value = await AsyncStorage.getItem('requestEncryption');
        if (value !== null) {
          setRequestEncryptionEnabled(value === 'enabled');
        }
      } catch (e) {
        console.error('从 AsyncStorage 获取 requestEncryption 状态失败', e);
      }
    };

    getEnv();
    getRequestEncryptionState();
    getAllStorageItems();
  }, [getAllStorageItems]);

  React.useEffect(() => {
    if (isVisible) {
      sheetRef.current?.expand();
    }
  }, [isVisible]);

  React.useEffect(() => {
    try {
      AsyncStorage.setItem('requestEncryption', isRequestEncryptionEnabled ? 'enabled' : 'disabled');
    } catch (e) {
      console.error('Failed to save requestEncryption to AsyncStorage', e);
    }
  }, [isRequestEncryptionEnabled]);

  const handleClosePress = React.useCallback(() => {
    sheetRef.current?.close();
    setTimeout(() => {
      setVisible(false);
    }, 300);
  }, [setVisible]);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          right: 5,
          bottom: 5,
          zIndex: 9998,
          opacity: 0.8,
        }}
      >
        <Image
          style={{ width: 40, height: 40, transform: 'rotate(-30deg)' }}
          source={require('~/assets/images/debug.png')}
        />
      </Pressable>

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
            <View flex="1" bg="secondary">
              <View py="medium" bg="default">
                <Row align="start">
                  {Platform.OS === 'web' ? <View style={{ width: 16 }} /> : <Spacer.Horizontal size="medium" />}
                  <Row align="center" grow="1" shrink="1">
                    <View>
                      <View height="xl" width="xl" overflow="hidden" bg="secondary" rounded="medium">
                        <Image
                          source={require('~/assets/images/icon.png')}
                          style={{ flex: 1, width: '100%', resizeMode: 'contain' }}
                        />
                      </View>
                    </View>

                    {Platform.OS === 'web' ? <View style={{ width: 12 }} /> : <Spacer.Horizontal size="small" />}

                    <View grow="1" shrink="1">
                      <Row style={{ flexWrap: 'wrap' }}>
                        <Heading weight="bold" numberOfLines={1}>
                          {Constants.expoConfig?.name} - Test Tools
                        </Heading>
                      </Row>

                      <Text size="small" color="secondary">
                        version: {Application.nativeApplicationVersion || Constants.expoConfig?.version || '-'} (
                        {Application.nativeBuildVersion})
                      </Text>
                    </View>

                    {Platform.OS === 'web' ? <View style={{ width: 12 }} /> : <Spacer.Horizontal />}

                    <View width="large" style={{ alignSelf: 'flex-start' }}>
                      <Button.FadeOnPressContainer onPress={handleClosePress} bg="ghost" rounded="full">
                        <View padding="micro">
                          <XIcon />
                        </View>
                      </Button.FadeOnPressContainer>
                    </View>

                    {Platform.OS === 'web' ? <View style={{ width: 12 }} /> : <Spacer.Horizontal size="small" />}
                  </Row>
                </Row>
              </View>

              <Divider />
              <View style={{ flex: 1 }}>
                <BottomSheetScrollView>
                  <View margin="small">
                    <View bg="default" roundedTop="large">
                      <SettingsRowButton
                        label={`切换接口环境 (${env.charAt(0).toUpperCase() + env.slice(1)})`}
                        description={api}
                        icon={<Globe size={20} color="#444" />}
                        onPress={() => {
                          // 按顺序依次、循环切换inte、rc、prod，切换后将 env 写入 AsyncStorage
                          const index = ENV_NAME.indexOf(env);
                          const nextIndex = (index + 1) % ENV_NAME.length;
                          const nextEnv = ENV_NAME[nextIndex];
                          setEnv(nextEnv);
                          setApi(ENV_API[nextEnv]);
                          AsyncStorage.setItem('env', nextEnv);
                        }}
                      />
                    </View>
                    <Divider />
                    <View bg="default" roundedBottom="large">
                      <SettingsRowSwitch
                        testID="request-encryption"
                        label="切换请求加密"
                        icon={<LockKeyhole size={20} color="#444" />}
                        setIsEnabled={setRequestEncryptionEnabled}
                        isEnabled={isRequestEncryptionEnabled}
                      />
                    </View>
                  </View>

                  <View mx="small" mb="small" rounded="large" overflow="hidden">
                    <View bg="default" roundedTop="large">
                      <SettingsRowButton
                        label="重新加载"
                        icon={<RefreshIcon />}
                        onPress={() => {
                          try {
                            if (__DEV__ && DevSettings) {
                              DevSettings.reload();
                            } else {
                              console.warn('重启功能仅在开发环境可用');
                            }
                          } catch (error) {
                            console.error('重启APP失败:', error);
                          }
                        }}
                      />
                    </View>
                    <Divider />
                    <View bg="default" roundedTop="large">
                      <SettingsRowButton
                        label="返回首页"
                        icon={<House size={20} color="#444" />}
                        onPress={() => {
                          try {
                            router.replace('/');
                            setVisible(false);
                          } catch (error) {
                            console.error('导航到首页失败:', error);
                          }
                        }}
                      />
                    </View>
                  </View>

                  <View mx="small" rounded="large" overflow="hidden">
                    <AppInfoRow title="Bundle ID" value={Application.applicationId || '-'} />
                    <Divider />
                    <AppInfoRow title="OS" value={`${Platform.OS}, ${Platform.Version?.toString() || '-'}`} />
                  </View>

                  <View margin="small">
                    <View bg="warning" padding="medium" rounded="medium" border="warning">
                      <Row align="center">
                        <Heading color="warning" size="small" style={{ top: 1 }}>
                          AsyncStorage
                        </Heading>
                        <Spacer.Horizontal style={{ flex: 1 }} />
                        <Button.FadeOnPressContainer onPress={getAllStorageItems} bg="ghost" rounded="full">
                          <View padding="micro">
                            <RefreshIcon size="small" />
                          </View>
                        </Button.FadeOnPressContainer>
                      </Row>
                      <Spacer.Vertical size="tiny" />
                      <View>
                        {storageItems.length > 0 ? (
                          storageItems.map(([key, value], index) => (
                            <Text key={index} size="small" color="warning">
                              {index + 1}. {key}: {value}
                            </Text>
                          ))
                        ) : (
                          <Text size="small" color="warning">
                            ...
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {Platform.OS === 'android' && <View style={{ height: 50 }} />}
                  <Spacer.Vertical size="large" />
                </BottomSheetScrollView>
              </View>
            </View>
          </BottomSheet>
        </GestureHandlerRootView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },
});
