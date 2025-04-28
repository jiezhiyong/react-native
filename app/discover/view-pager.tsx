import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

export default function ExpoViewPagerScreen() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <View className="flex-1">
      {/* 顶部标题 */}
      <View className="p-6">
        <Text className="text-lg font-bold mb-2">视图分页器</Text>
        <Text className="text-gray-600">
          此功能展示了如何使用视图分页器组件。
        </Text>
      </View>

      {/* 分页器 */}
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {colors.map((color, index) => (
          <View key={index} style={[styles.page, { backgroundColor: color }]}>
            <Text className="text-white text-2xl font-bold">页面 {index + 1}</Text>
          </View>
        ))}
      </PagerView>

      {/* 页面指示器 */}
      <View className="flex-row justify-center items-center p-4">
        {colors.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>

      {/* 控制按钮 */}
      <View className="flex-row justify-around p-4">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center"
          onPress={() => {
            if (currentPage > 0) {
              setCurrentPage(currentPage - 1);
            }
          }}
          disabled={currentPage === 0}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text className="text-white ml-2">上一页</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center"
          onPress={() => {
            if (currentPage < colors.length - 1) {
              setCurrentPage(currentPage + 1);
            }
          }}
          disabled={currentPage === colors.length - 1}
        >
          <Text className="text-white mr-2">下一页</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* 说明区域 */}
      <View className="p-6">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 支持左右滑动切换页面
          {'\n'}2. 支持自定义页面指示器
          {'\n'}3. 支持按钮控制页面切换
          {'\n'}4. 支持页面切换动画
        </Text>
      </View>

      <View className="p-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 react-native-pager-view
          {'\n'}2. 支持自定义页面内容
          {'\n'}3. 支持自定义切换动画
          {'\n'}4. 建议在真机上测试
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
