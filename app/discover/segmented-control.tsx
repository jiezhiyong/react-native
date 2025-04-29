import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ExpoSegmentedControlScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('blue');

  const segments = ['全部', '进行中', '已完成'];
  const colors = ['blue', 'green', 'purple', 'orange'];

  const renderContent = () => {
    switch (selectedIndex) {
      case 0:
        return (
          <View className="bg-blue-50 p-4 rounded-lg">
            <View className="mb-6">
              <Text className="text-2xl font-bold mb-2">Segmented Control</Text>
              <Text className="text-secondary-foreground">使用和配置 Segmented Control 相关功能。</Text>
            </View>

            <Text className="text-blue-800">显示全部内容</Text>
            <Text className="text-blue-600 mt-2">这里可以显示所有项目的列表</Text>
          </View>
        );
      case 1:
        return (
          <View className="bg-green-50 p-4 rounded-lg">
            <Text className="text-green-800">显示进行中的内容</Text>
            <Text className="text-green-600 mt-2">这里可以显示进行中项目的列表</Text>
          </View>
        );
      case 2:
        return (
          <View className="bg-purple-50 p-4 rounded-lg">
            <Text className="text-purple-800">显示已完成的内容</Text>
            <Text className="text-purple-600 mt-2">这里可以显示已完成项目的列表</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">分段控制器</Text>
        <Text className="text-secondary-foreground">使用分段控制器来切换不同的视图或选项。</Text>
      </View>

      {/* 基本分段控制器 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">基本分段控制器</Text>
        <View className="flex-row border border-gray-200 rounded-lg overflow-hidden">
          {segments.map((segment, index) => (
            <TouchableOpacity
              key={segment}
              className={`flex-1 p-3 items-center ${selectedIndex === index ? 'bg-blue-500' : 'bg-white'}`}
              onPress={() => setSelectedIndex(index)}
            >
              <Text className={`${selectedIndex === index ? 'text-white' : 'text-secondary-foreground'}`}>
                {segment}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="mt-4">{renderContent()}</View>
      </View>

      {/* 自定义颜色分段控制器 */}
      <View className="mb-8">
        <Text className="text-base font-medium mb-4">自定义颜色</Text>
        <View className="flex-row border border-gray-200 rounded-lg overflow-hidden">
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              className={`flex-1 p-3 items-center ${selectedColor === color ? getColorClass(color) : 'bg-white'}`}
              onPress={() => setSelectedColor(color)}
            >
              <Text className={`${selectedColor === color ? 'text-white' : 'text-secondary-foreground'}`}>{color}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className={`mt-4 p-4 rounded-lg ${getColorClass(selectedColor)}`}>
          <Text className="text-white">当前选择的颜色: {selectedColor}</Text>
        </View>
      </View>

      {/* 带图标的分段控制器 */}
      <View>
        <Text className="text-base font-medium mb-4">带图标的分段控制器</Text>
        <View className="flex-row border border-gray-200 rounded-lg overflow-hidden">
          {['home', 'heart', 'settings'].map((icon, index) => (
            <TouchableOpacity
              key={icon}
              className={`flex-1 p-3 items-center ${selectedIndex === index ? 'bg-blue-500' : 'bg-white'}`}
              onPress={() => setSelectedIndex(index)}
            >
              <Ionicons name={icon as any} size={24} color={selectedIndex === index ? 'white' : 'gray'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 分段控制器用于在多个选项之间切换
          {'\n'}2. 可以自定义颜色、图标和样式
          {'\n'}3. 支持触摸反馈和状态管理
          {'\n'}4. 可以与其他组件配合使用
        </Text>
      </View>
    </ScrollView>
  );
}
