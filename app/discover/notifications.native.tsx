import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { PermissionStatus } from 'expo-modules-core';
import * as Notifications from 'expo-notifications';
import { useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useEffectAsync } from '~/hooks/use-effect-async';

/**
 * 推送通知
 * Expo 工具: https://expo.dev/notifications
 */

// 发送推送通知
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: '新年优惠',
    body: '新年期间, 所有商品8折优惠 ~',
    data: { abc: '123' },
    androidChannelId: 'default',
    priority: 'high',
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

// 处理注册错误
function handleRegistrationError(errorMessage: string) {
  Alert.alert('错误', errorMessage);
  throw new Error(errorMessage);
}

// 注册推送通知
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      enableLights: true,
      enableVibrate: true,
      showBadge: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      sound: 'default',
      description: '应用的默认通知渠道',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== PermissionStatus.GRANTED) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== PermissionStatus.GRANTED) {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notificationListener = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseListener = useRef<any>(null);

  useEffectAsync(async () => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationHandler({
        handleNotification: async (notification) => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }

    try {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token ?? '');
    } catch (error) {
      setExpoPushToken(`${error}`);
    }

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">通知系统</Text>
        <Text className="text-muted-foreground">创建和管理本地和推送通知</Text>
      </View>

      <View className="flex-1">
        <Text className="text-lg font-medium mb-2">Push token</Text>
        <Text className="mb-6 text-muted-foreground">{expoPushToken}</Text>

        <Text className="text-lg font-medium mb-2">收到消息</Text>
        <View className="mb-6 bg-muted p-4 rounded-lg gap-3">
          <Text>{JSON.stringify(notification?.request.content, null, 2) || '-'}</Text>
        </View>
      </View>

      <Button
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      >
        <Text>发送通知</Text>
      </Button>
    </View>
  );
}
