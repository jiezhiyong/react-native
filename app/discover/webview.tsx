import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ExpoWebViewScreen() {
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const webViewRef = useRef<WebView>(null);

  // 处理导航状态变化
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  };

  // 处理加载错误
  const handleError = (syntheticEvent: { nativeEvent: { description: string } }) => {
    const { nativeEvent } = syntheticEvent;
    console.log('加载错误:', nativeEvent.description);
  };

  // 处理加载完成
  const handleLoadEnd = () => {
    console.log('加载完成');
  };

  // 返回上一页
  const goBack = () => {
    if (webViewRef.current && canGoBack) {
      webViewRef.current.goBack();
    }
  };

  // 前进到下一页
  const goForward = () => {
    if (webViewRef.current && canGoForward) {
      webViewRef.current.goForward();
    }
  };

  // 重新加载页面
  const reload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  return (
    <View className="flex-1 px-6 pt-6">
      <View className="mb-3">
        <Text className="text-2xl font-bold mb-2">WebWebView</Text>
        <Text className="text-muted-foreground">在原生视图中渲染网页内容, 当前URL: {currentUrl}</Text>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://expo.dev' }}
        originWhitelist={['*']}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />

      <View className="flex-row gap-3 pt-3">
        <Button className="flex-row gap-2 flex-1" onPress={goBack} disabled={!canGoBack} size="sm">
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text>返回</Text>
        </Button>

        <Button className="flex-row gap-2 flex-1" onPress={goForward} disabled={!canGoForward} size="sm">
          <Text>前进</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Button>

        <Button className="flex-row gap-2 flex-1" onPress={reload} size="sm">
          <Ionicons name="refresh" size={20} color="white" />
          <Text>刷新</Text>
        </Button>
      </View>
    </View>
  );
}
