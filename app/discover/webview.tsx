import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';

export default function ExpoWebViewScreen() {
  const [url, setUrl] = useState('https://expo.dev');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [error, setError] = useState('');
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
    setError(`加载错误: ${nativeEvent.description}`);
  };

  // 处理加载完成
  const handleLoadEnd = () => {
    setError('');
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
    <View className="flex-1">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Web 视图</Text>
        <Text className="text-secondary-foreground">在应用中嵌入和交互网页内容。</Text>
      </View>

      {/* 顶部标题 */}
      <View className="p-6">
        <Text className="text-lg font-bold mb-2">WebView</Text>
        <Text className="text-secondary-foreground">在应用中嵌入网页内容。</Text>
      </View>

      {/* URL 输入和控制栏 */}
      <View className="p-4 bg-white border-b border-gray-200">
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4"
          value={url}
          onChangeText={setUrl}
          placeholder="输入 URL"
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center"
            onPress={goBack}
            disabled={!canGoBack}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text className="text-white ml-2">返回</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center"
            onPress={goForward}
            disabled={!canGoForward}
          >
            <Text className="text-white mr-2">前进</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-blue-500 rounded-lg p-4 flex-row items-center" onPress={reload}>
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white ml-2">刷新</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationStateChange}
        onError={handleError}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
      />

      {/* 错误提示 */}
      {error ? (
        <View className="absolute bottom-0 left-0 right-0 bg-red-100 p-4">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : null}

      {/* 当前 URL 显示 */}
      <View className="absolute bottom-0 left-0 right-0 bg-gray-100 p-2">
        <Text className="text-secondary-foreground text-xs" numberOfLines={1}>
          {currentUrl}
        </Text>
      </View>

      {/* 说明区域 */}
      <View className="absolute top-0 right-0 bg-white p-4 rounded-lg m-4 shadow">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 react-native-webview
          {'\n'}2. 支持 JavaScript
          {'\n'}3. 支持 DOM 存储
          {'\n'}4. 支持页面缩放
        </Text>
      </View>
    </View>
  );
}
