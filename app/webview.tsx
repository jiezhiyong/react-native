import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';

export default function App() {
  const { url } = useLocalSearchParams();

  const webViewRef = useRef<WebView>(null);

  const [title, setTitle] = useState('');

  // 处理导航状态变化
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setTitle(navState.title);
  };

  // 处理加载错误
  const handleError = (syntheticEvent: { nativeEvent: { description: string } }) => {
    const { nativeEvent } = syntheticEvent;
    alert(nativeEvent.description);
  };

  // 处理加载完成
  const handleLoadEnd = () => {
    console.log('加载完成');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: title,
        }}
      />

      <WebView
        ref={webViewRef}
        source={{ uri: url as string }}
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
    </>
  );
}
