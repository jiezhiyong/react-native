import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function ExpoMaskedViewScreen() {
  const [selectedMask, setSelectedMask] = useState<'circle' | 'gradient' | 'text'>('circle');

  const renderMaskedContent = () => {
    switch (selectedMask) {
      case 'circle':
        return (
          <View className="items-center justify-center">
            <MaskedView
              style={{ width: 200, height: 200 }}
              maskElement={<View className="w-full h-full rounded-full bg-black" />}
            >
              <Image
                source={{ uri: 'https://picsum.photos/200' }}
                style={{ width: 200, height: 200 }}
                resizeMode="cover"
              />
            </MaskedView>
          </View>
        );
      case 'gradient':
        return (
          <View className="items-center justify-center">
            <MaskedView
              style={{ width: 200, height: 200 }}
              maskElement={
                <LinearGradient
                  colors={['transparent', 'black', 'transparent']}
                  style={{ width: 200, height: 200 }}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              }
            >
              <Image
                source={{ uri: 'https://picsum.photos/200' }}
                style={{ width: 200, height: 200 }}
                resizeMode="cover"
              />
            </MaskedView>
          </View>
        );
      case 'text':
        return (
          <View className="items-center justify-center">
            <MaskedView
              style={{ width: width - 48, height: 100 }}
              maskElement={
                <View className="w-full h-full items-center justify-center">
                  <Text className="text-4xl font-bold text-black">MASKED VIEW</Text>
                </View>
              }
            >
              <LinearGradient
                colors={['#FF6B6B', '#4ECDC4']}
                style={{ width: width - 48, height: 100 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </MaskedView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">遮罩视图</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何使用遮罩视图来创建特殊的视觉效果。</Text>
      </View>

      {/* 遮罩类型选择 */}
      <View className="flex-row justify-between mb-6">
        <TouchableOpacity
          className={`flex-1 p-3 items-center rounded-lg mr-2 ${
            selectedMask === 'circle' ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          onPress={() => setSelectedMask('circle')}
        >
          <Ionicons name="ellipse" size={24} color={selectedMask === 'circle' ? 'white' : 'gray'} />
          <Text className={`mt-2 ${selectedMask === 'circle' ? 'text-white' : 'text-gray-600'}`}>圆形遮罩</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-3 items-center rounded-lg mr-2 ${
            selectedMask === 'gradient' ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          onPress={() => setSelectedMask('gradient')}
        >
          <Ionicons name="color-palette" size={24} color={selectedMask === 'gradient' ? 'white' : 'gray'} />
          <Text className={`mt-2 ${selectedMask === 'gradient' ? 'text-white' : 'text-gray-600'}`}>渐变遮罩</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 p-3 items-center rounded-lg ${selectedMask === 'text' ? 'bg-blue-500' : 'bg-gray-200'}`}
          onPress={() => setSelectedMask('text')}
        >
          <Ionicons name="text" size={24} color={selectedMask === 'text' ? 'white' : 'gray'} />
          <Text className={`mt-2 ${selectedMask === 'text' ? 'text-white' : 'text-gray-600'}`}>文字遮罩</Text>
        </TouchableOpacity>
      </View>

      {/* 遮罩效果展示 */}
      <View className="items-center justify-center mb-6">{renderMaskedContent()}</View>

      {/* 说明区域 */}
      <View className="bg-gray-100 p-4 rounded-lg">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 圆形遮罩：使用圆形遮罩显示图片
          {'\n'}2. 渐变遮罩：使用渐变效果作为遮罩
          {'\n'}3. 文字遮罩：使用文字作为遮罩，显示渐变背景
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 遮罩视图可以创建各种视觉效果
          {'\n'}2. 支持自定义遮罩形状和样式
          {'\n'}3. 可以与其他组件配合使用
          {'\n'}4. 性能优化很重要，避免过度使用
        </Text>
      </View>
    </ScrollView>
  );
}
