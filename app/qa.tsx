import { Stack } from 'expo-router';
import { ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Input } from '~/components/ui/input';

// 定义问题类型
interface Question {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// 分类类型
interface Category {
  id: string;
  name: string;
}

// 模拟数据 - 常见问题分类
const categories: Category[] = [
  { id: 'account', name: '账户问题' },
  { id: 'payment', name: '支付问题' },
  { id: 'order', name: '订单问题' },
  { id: 'delivery', name: '配送问题' },
  { id: 'refund', name: '退款问题' },
  { id: 'other', name: '其他问题' },
];

// 模拟数据 - 常见问题
const faqData: Question[] = [
  {
    id: 'q1',
    question: '如何修改账户密码？',
    answer: '您可以在"我的-设置-账户安全"中修改密码。点击"修改密码"，输入旧密码和新密码后确认即可。',
    category: 'account',
  },
  {
    id: 'q2',
    question: '忘记密码怎么办？',
    answer: '您可以通过"登录页-忘记密码"，使用注册时的手机号接收验证码，然后重置密码。',
    category: 'account',
  },
  {
    id: 'q3',
    question: '如何修改绑定的手机号？',
    answer: '请前往"我的-设置-账户安全-手机号"，先验证当前手机号，然后输入新手机号并验证即可更换。',
    category: 'account',
  },
  {
    id: 'q4',
    question: '支持哪些支付方式？',
    answer: '目前支持微信支付、支付宝、银联卡支付和Apple Pay等多种支付方式。',
    category: 'payment',
  },
  {
    id: 'q5',
    question: '支付失败怎么办？',
    answer: '请检查网络连接和支付账户余额，确认无误后重试。如果仍然失败，请联系客服处理。',
    category: 'payment',
  },
  {
    id: 'q6',
    question: '如何查询订单状态？',
    answer: '您可以在"我的-订单"中查看所有订单，点击具体订单可以查看详细状态和物流信息。',
    category: 'order',
  },
  {
    id: 'q7',
    question: '如何取消订单？',
    answer: '在订单未发货前，您可以在订单详情页点击"取消订单"。发货后需要申请退货退款。',
    category: 'order',
  },
  {
    id: 'q8',
    question: '配送范围是多少？',
    answer: '我们覆盖全国大部分地区，具体配送范围和时间可在下单时查看。偏远地区可能需要额外的配送时间。',
    category: 'delivery',
  },
  {
    id: 'q9',
    question: '商品如何申请退款？',
    answer: '请在"我的-订单"中找到相应订单，点击"申请退款"，填写退款原因并上传相关凭证，等待审核。',
    category: 'refund',
  },
  {
    id: 'q10',
    question: '退款多久能到账？',
    answer: '审核通过后，退款将在1-7个工作日内原路返回您的支付账户，具体时间取决于支付平台。',
    category: 'refund',
  },
  {
    id: 'q11',
    question: '如何联系客服？',
    answer: '您可以通过"我的-在线客服"功能与客服人员联系，或拨打客服热线400-123-4567（工作时间：9:00-18:00）。',
    category: 'other',
  },
];

// 问题项组件
const QuestionItem = ({
  item,
  isExpanded,
  onToggle,
}: {
  item: Question;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <View className="mb-2 border border-gray-100 rounded-lg overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center justify-between p-4 bg-background"
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text className="flex-1 font-medium text-gray-800">{item.question}</Text>
        <View className="ml-2">
          {isExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View className="p-4 bg-gray-50 border-t border-gray-100">
          <Text className="text-muted-foreground leading-6">{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

// 分类标签组件
const CategoryTag = ({
  category,
  isSelected,
  onPress,
}: {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className={`py-1.5 px-3 mr-2 rounded-full ${isSelected ? 'bg-primary' : 'bg-muted'}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text className={`font-medium ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>{category.name}</Text>
    </TouchableOpacity>
  );
};

export default function QaScreen() {
  // 状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  // 切换问题展开/折叠状态
  const toggleQuestion = useCallback((questionId: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  }, []);

  // 切换分类
  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    // 重置展开状态
    setExpandedQuestions([]);
  }, []);

  // 根据搜索和分类过滤问题
  const filteredQuestions = useMemo(() => {
    let filtered = faqData;

    // 应用分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }

    // 应用搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (q) => q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: '常见问题',
          headerShadowVisible: false,
        }}
      />

      <View className="px-4 pt-4 pb-2">
        {/* 搜索框 */}
        <View className="flex-row items-center bg-muted rounded-full px-4 mb-4">
          <Search size={20} color="#9ca3af" />
          <Input
            className="flex-1 py-2 px-3 border-0 bg-transparent"
            placeholder="搜索问题"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* 分类标签 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <CategoryTag
            category={{ id: 'all', name: '全部' }}
            isSelected={selectedCategory === 'all'}
            onPress={() => handleCategoryPress('all')}
          />
          {categories.map((category) => (
            <CategoryTag
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* 问题列表 */}
      {filteredQuestions.length > 0 ? (
        <FlatList
          data={filteredQuestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <QuestionItem
              item={item}
              isExpanded={expandedQuestions.includes(item.id)}
              onToggle={() => toggleQuestion(item.id)}
            />
          )}
          contentContainerClassName="px-4 py-2"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-400 text-lg">未找到相关问题，请尝试其他关键词</Text>
        </View>
      )}
    </View>
  );
}
