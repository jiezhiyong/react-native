import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

const feedbackTypes = ['异常报错', '投诉', '意见反馈', '授信问题', '借款问题', '还款问题', '其他'];
type FeedbackType = (typeof feedbackTypes)[number];

export default function FeedbackScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(feedbackTypes[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTypeSelect = (type: FeedbackType) => {
    setSelectedType(type);
  };

  const handleSubmit = () => {
    console.log('提交反馈', { selectedType, title, content });
    alert('反馈已提交');
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView className="flex-1">
          {/* 问题标签 */}
          <View className="p-4 bg-white">
            <Text className="text-lg">请选择问题标签</Text>
            <Text className="text-xs text-gray-400 mb-4">精准分类，处理更快</Text>

            <View className="flex-row flex-wrap gap-2">
              {feedbackTypes.map((type) => (
                <TypeButton
                  key={type}
                  title={type}
                  isSelected={selectedType === type}
                  onPress={() => handleTypeSelect(type)}
                />
              ))}
            </View>
          </View>

          {/* 反馈内容 */}
          <View className="mt-4 p-4 bg-white">
            <View className="flex-row items-center mb-4">
              <Text className="text-red-500 mr-1">*</Text>
              <Text className="text-lg">反馈标题与内容</Text>
            </View>

            <TextInput
              className="bg-gray-100 p-3 rounded-md mb-3"
              placeholder="标题（最多30个字）"
              maxLength={30}
              value={title}
              onChangeText={setTitle}
            />

            <View className="bg-gray-100 rounded-md mb-1 min-h-[160px]">
              <TextInput
                className="flex-1 p-3"
                placeholder="您的建议是我们改进的动力"
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
                maxLength={300}
              />
            </View>
            <Text className="text-right text-gray-400">{content.length}/300</Text>
          </View>

          {/* 上传照片 */}
          <View className="mt-4 p-4 bg-white">
            <Text className="text-lg">上传照片</Text>
            <Text className="text-xs text-gray-400 mb-4">
              上传操作入口，报错提示截图、手机系统版本截图等信息，最多可上传10张，图像尺寸小于1M
            </Text>

            <TouchableOpacity className="w-20 h-20 bg-gray-100 items-center justify-center rounded-md">
              <Plus size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* 提交按钮 */}
          <View className="p-4">
            <Button className="py-4 rounded-full" onPress={handleSubmit}>
              <Text>提交</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

interface TypeButtonProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const TypeButton = ({ title, isSelected, onPress }: TypeButtonProps) => {
  return (
    <TouchableOpacity
      className={`py-1.5 px-3 rounded-full ${isSelected ? 'bg-primary' : 'bg-gray-100'}`}
      onPress={onPress}
    >
      <Text className={`text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}>{title}</Text>
    </TouchableOpacity>
  );
};
