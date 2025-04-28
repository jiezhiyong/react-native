import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 详情页面组件
function DetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <TouchableOpacity className="mb-4" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">详情页面</Text>
        <Text className="text-gray-600 mt-2">接收到的参数: {JSON.stringify(params)}</Text>
      </View>
    </View>
  );
}

// 主页面组件
export default function RouteScreen() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push({
        pathname: '/discover/camera',
        params: { search: searchText },
      });
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">路由示例</Text>
        <Text className="text-gray-600 mb-4">此功能展示了路由的基本用法，包括导航、参数传递等。</Text>
      </View>

      <View className="space-y-6">
        {/* 搜索框 */}
        <View className="flex-row space-x-2">
          <TextInput
            className="flex-1 bg-gray-100 rounded-lg p-3"
            placeholder="输入搜索内容"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity className="bg-blue-500 rounded-lg p-3" onPress={handleSearch}>
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* 导航示例 */}
        <View className="space-y-4">
          <Text className="text-base font-semibold">导航方式</Text>

          <TouchableOpacity
            className="bg-blue-500 rounded-lg p-4 flex-row items-center"
            onPress={() => router.push('/discover/camera')}
          >
            <Ionicons name="arrow-forward" size={20} color="white" />
            <Text className="text-white ml-2">使用 router.push()</Text>
          </TouchableOpacity>

          <Link href="/discover/camera" className="bg-green-500 rounded-lg p-4 flex-row items-center">
            <Ionicons name="link" size={20} color="white" />
            <Text className="text-white ml-2">使用 Link 组件</Text>
          </Link>

          <TouchableOpacity
            className="bg-purple-500 rounded-lg p-4 flex-row items-center"
            onPress={() =>
              router.push({
                pathname: '/discover/camera',
                params: { id: '123', name: '测试' },
              })
            }
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text className="text-white ml-2">带参数导航</Text>
          </TouchableOpacity>
        </View>

        {/* 嵌套路由示例 */}
        <View className="space-y-4">
          <Text className="text-base font-semibold">嵌套路由</Text>

          <Link href="/discover/camera" className="bg-yellow-500 rounded-lg p-4 flex-row items-center">
            <Ionicons name="layers" size={20} color="white" />
            <Text className="text-white ml-2">嵌套路由示例</Text>
          </Link>
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 支持多种导航方式
          {'\n'}2. 可以传递参数到目标页面
          {'\n'}3. 支持嵌套路由结构
        </Text>
      </View>
    </ScrollView>
  );
}

// 导出详情页面
export { DetailScreen };
