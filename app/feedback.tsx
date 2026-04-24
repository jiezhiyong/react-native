import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';

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
      <SafeAreaView className="flex-1 bg-muted">
        <ScrollView className="flex-1">
          {/* 问题标签 */}
          <View className="p-5 bg-background">
            <Text className="text-lg font-bold">请选择问题标签</Text>
            <Text className="text-sm text-secondary-foreground mb-4">精准分类，处理更快</Text>

            <View className="flex-row flex-wrap gap-3">
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
          <View className="mt-3 p-5 bg-background">
            <View className="flex-row items-center mb-4">
              <Text className="text-red-500 mr-1">*</Text>
              <Text className="text-lg font-bold">反馈标题与内容</Text>
            </View>

            <Input
              className="mb-3"
              placeholder="标题（最多30个字）"
              maxLength={30}
              value={title}
              onChangeText={setTitle}
            />

            <Textarea
              className="mb-3 min-h-[100px]"
              placeholder="您的建议是我们改进的动力"
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              maxLength={300}
            />
            <Text className="text-right text-secondary-foreground">{content.length}/300</Text>
          </View>

          {/* 上传照片 */}
          <View className="mt-3 p-5 bg-background">
            <Text className="text-lg font-bold">上传照片</Text>
            <Text className="text-sm text-secondary-foreground mb-4">
              上传操作入口，报错提示截图、手机系统版本截图等信息，最多可上传10张，图像尺寸小于1M
            </Text>

            <TouchableOpacity className="w-20 h-20 bg-muted items-center justify-center rounded-md">
              <Plus size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* 提交按钮 */}
          <View className="p-5">
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
      className={`py-1.5 px-3 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted'}`}
      onPress={onPress}
    >
      <Text className={`text-sm ${isSelected ? 'text-white' : 'text-gray-700'}`}>{title}</Text>
    </TouchableOpacity>
  );
};
