import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useI18nContext } from '@/i18n/i18n-react';

const feedbackTypeIds = ['bug', 'complaint', 'feedback', 'credit', 'loan', 'repayment', 'other'] as const;
type FeedbackType = (typeof feedbackTypeIds)[number];

export default function FeedbackScreen() {
  const router = useRouter();
  const { LL } = useI18nContext();
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(feedbackTypeIds[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTypeSelect = (type: FeedbackType) => {
    setSelectedType(type);
  };

  const handleSubmit = () => {
    console.log('提交反馈', { selectedType, title, content });
    alert(LL.feedback.submitted());
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1 px-5 py-5">
          {/* 问题标签 */}
          <View className="p-5 bg-card rounded-xl border border-border">
            <Text className="text-lg font-medium">{LL.feedback.selectTag()}</Text>
            <Text className="text-sm text-secondary-foreground mb-4">{LL.feedback.selectTagDescription()}</Text>

            <View className="flex-row flex-wrap gap-3">
              {feedbackTypeIds.map((type) => (
                <TypeButton
                  key={type}
                  title={LL.feedback.types[type]()}
                  isSelected={selectedType === type}
                  onPress={() => handleTypeSelect(type)}
                />
              ))}
            </View>
          </View>

          {/* 反馈内容 */}
          <View className="mt-4 p-5 bg-card rounded-xl border border-border">
            <View className="flex-row items-center mb-4">
              <Text className="text-destructive mr-1">*</Text>
              <Text className="text-lg font-medium">{LL.feedback.titleAndContent()}</Text>
            </View>

            <Input
              className="mb-3"
              placeholder={LL.feedback.titlePlaceholder()}
              maxLength={30}
              value={title}
              onChangeText={setTitle}
            />

            <Textarea
              className="mb-3 min-h-[100px]"
              placeholder={LL.feedback.contentPlaceholder()}
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
              maxLength={300}
            />
            <Text className="text-right text-secondary-foreground">{content.length}/300</Text>
          </View>

          {/* 上传照片 */}
          <View className="mt-4 p-5 bg-card rounded-xl border border-border">
            <Text className="text-lg font-medium">{LL.feedback.uploadPhotos()}</Text>
            <Text className="text-sm text-secondary-foreground mb-4">
              {LL.feedback.uploadPhotosDescription()}
            </Text>

            <TouchableOpacity className="w-20 h-20 bg-muted items-center justify-center rounded-xl border border-border">
              <Plus size={24} color="#87867f" />
            </TouchableOpacity>
          </View>

          {/* 提交按钮 */}
          <View className="py-5">
            <Button className="py-4 rounded-xl" onPress={handleSubmit}>
              <Text>{LL.feedback.submit()}</Text>
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
      className={`py-1.5 px-3 rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-border bg-muted'}`}
      onPress={onPress}
    >
      <Text className={`text-sm ${isSelected ? 'text-primary-foreground' : 'text-secondary-foreground'}`}>{title}</Text>
    </TouchableOpacity>
  );
};
