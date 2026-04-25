import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ExpoWebBrowserScreen() {
  const [browserResult, setBrowserResult] = useState('');
  const [error, setError] = useState('');

  // 打开内置浏览器
  const openBrowser = async () => {
    try {
      setError('');
      const result = await WebBrowser.openBrowserAsync('https://expo.dev', {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        toolbarColor: '#2196F3',
        controlsColor: '#FFFFFF',
        dismissButtonStyle: 'close',
        enableBarCollapsing: true,
        showTitle: true,
      });
      setBrowserResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setError(`打开浏览器失败: ${(error as Error).message}`);
    }
  };

  // 打开认证页面
  const openAuthSession = async () => {
    try {
      setError('');
      const result = await WebBrowser.openAuthSessionAsync('https://expo.dev/login', 'expo://');
      setBrowserResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setError(`打开认证页面失败: ${(error as Error).message}`);
    }
  };

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">内置浏览器</Text>
        <Text className="text-muted-foreground">使用内置浏览器打开网页</Text>
      </View>

      <View className="flex-1">
        {/* 浏览器结果 */}
        {browserResult ? (
          <View className="mb-6">
            <Text className="text-lg font-medium mb-2">结果</Text>
            <View className="bg-muted rounded-lg p-4">
              <Text className="text-muted-foreground">{browserResult}</Text>
            </View>
          </View>
        ) : null}

        {/* 错误提示 */}
        {error ? (
          <>
            <Text className="text-lg font-medium mb-2">错误</Text>
            <View className="bg-destructive/10 rounded-lg p-4">
              <Text className="text-destructive">{error}</Text>
            </View>
          </>
        ) : null}

        {/* TODO: 待实现 WebBrowser.openAuthSessionAsync */}
        {/* <Button onPress={openAuthSession}>
          <Text>打开认证页面</Text>
        </Button> */}
      </View>

      <Button onPress={openBrowser}>
        <Text>打开内置浏览器</Text>
      </Button>
    </View>
  );
}
