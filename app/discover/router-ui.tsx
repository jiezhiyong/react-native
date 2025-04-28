import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// 导航栏组件
function CustomHeader() {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between p-4 bg-white">
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text className="text-lg font-bold">自定义导航栏</Text>
      <TouchableOpacity>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

// 标签页组件
function TabContent({ title }: { title: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">{title}</Text>
    </View>
  );
}

// 模态框组件
function CustomModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-4/5">
          <Text className="text-lg font-bold mb-4">自定义模态框</Text>
          <Text className="text-gray-600 mb-4">这是一个使用路由UI组件的模态框示例。</Text>
          <TouchableOpacity className="bg-blue-500 rounded-lg p-3 items-center" onPress={onClose}>
            <Text className="text-white">关闭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function RouteUIScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <View className="flex-1">
      {/* 路由配置 */}
      <Stack.Screen
        options={{
          header: () => <CustomHeader />,
        }}
      />

      <ScrollView className="flex-1 p-6">
        <View className="mb-6">
          <Text className="text-lg font-bold mb-2">路由UI组件</Text>
          <Text className="text-gray-600 mb-4">此功能展示了路由UI组件的使用方法，包括导航栏、标签栏和模态框。</Text>
        </View>

        <View className="space-y-6">
          {/* 标签栏示例 */}
          <View className="space-y-4">
            <Text className="text-base font-semibold">标签栏</Text>
            <View className="flex-row bg-gray-100 rounded-lg p-1">
              {['home', 'search', 'profile'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  className={`flex-1 p-3 rounded-lg ${activeTab === tab ? 'bg-white' : ''}`}
                  onPress={() => setActiveTab(tab)}
                >
                  <View className="items-center">
                    <Ionicons
                      name={tab === 'home' ? 'home' : tab === 'search' ? 'search' : 'person'}
                      size={20}
                      color={activeTab === tab ? 'blue' : 'gray'}
                    />
                    <Text className={`mt-1 ${activeTab === tab ? 'text-blue-500' : 'text-gray-500'}`}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View className="h-40 bg-gray-100 rounded-lg items-center justify-center">
              <TabContent title={`${activeTab} 标签页内容`} />
            </View>
          </View>

          {/* 模态框示例 */}
          <View className="space-y-4">
            <Text className="text-base font-semibold">模态框</Text>
            <TouchableOpacity
              className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="open" size={20} color="white" />
              <Text className="text-white ml-2">打开模态框</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6">
          <Text className="text-sm text-gray-500">
            注意：
            {'\n'}1. 导航栏支持自定义样式和操作
            {'\n'}2. 标签栏支持图标和文字组合
            {'\n'}3. 模态框支持自定义内容和动画
          </Text>
        </View>
      </ScrollView>

      <CustomModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}
