import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoNetworkScreen() {
  const [getResponse, setGetResponse] = useState<string>('');
  const [postResponse, setPostResponse] = useState<string>('');
  const [postData, setPostData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const makeGetRequest = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const data = await response.json();
      setGetResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('GET 请求失败:', error);
      Alert.alert('错误', 'GET 请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  const makePostRequest = async () => {
    if (!postData.trim()) {
      Alert.alert('提示', '请输入要发送的数据');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: '测试标题',
          body: postData,
          userId: 1,
        }),
      });
      const data = await response.json();
      setPostResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('POST 请求失败:', error);
      Alert.alert('错误', 'POST 请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">网络请求</Text>
        <Text className="text-gray-600 mb-4">
          此功能展示了如何进行网络请求和处理响应。
        </Text>
      </View>

      {/* GET 请求示例 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">GET 请求示例</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
          onPress={makeGetRequest}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? 'hourglass' : 'download'}
            size={20}
            color="white"
          />
          <Text className="text-white ml-2">
            {isLoading ? '请求中...' : '发送 GET 请求'}
          </Text>
        </TouchableOpacity>

        {getResponse ? (
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-base font-semibold mb-2">响应数据</Text>
            <Text className="text-gray-600">{getResponse}</Text>
          </View>
        ) : null}
      </View>

      {/* POST 请求示例 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">POST 请求示例</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4"
          placeholder="输入要发送的数据"
          value={postData}
          onChangeText={setPostData}
          multiline
        />
        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center mb-4"
          onPress={makePostRequest}
          disabled={isLoading}
        >
          <Ionicons
            name={isLoading ? 'hourglass' : 'send'}
            size={20}
            color="white"
          />
          <Text className="text-white ml-2">
            {isLoading ? '发送中...' : '发送 POST 请求'}
          </Text>
        </TouchableOpacity>

        {postResponse ? (
          <View className="bg-gray-100 rounded-lg p-4">
            <Text className="text-base font-semibold mb-2">响应数据</Text>
            <Text className="text-gray-600">{postResponse}</Text>
          </View>
        ) : null}
      </View>

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. GET 请求：获取数据
          {'\n'}2. POST 请求：发送数据
          {'\n'}3. 支持 JSON 数据格式
          {'\n'}4. 包含错误处理
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 使用 fetch API 进行网络请求
          {'\n'}2. 支持异步操作
          {'\n'}3. 包含加载状态
          {'\n'}4. 需要网络连接
        </Text>
      </View>
    </ScrollView>
  );
}
