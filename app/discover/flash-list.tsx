import { FlashList } from '@shopify/flash-list';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { create } from 'zustand';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { sleep } from '~/lib/utils';

// 定义列表项类型
interface ListItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'news' | 'article' | 'video';
}

// 使用 zustand 创建状态管理
interface ListState {
  items: ListItem[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  page: number;
  loadItems: () => Promise<void>;
  loadMoreItems: () => Promise<void>;
  refreshItems: () => Promise<void>;
}

// 生成随机数据函数
const generateItems = (page: number, perPage: number = 10): ListItem[] => {
  const categories: ('news' | 'article' | 'video')[] = ['news', 'article', 'video'];
  return Array.from({ length: perPage }, (_, i) => {
    const id = `${page}-${i}`;
    const categoryIndex = Math.floor(Math.random() * 3);
    return {
      id,
      title: `标题 ${id}`,
      description: `这是第 ${page} 页的第 ${i + 1} 个项目的详细描述内容。`,
      timestamp: new Date(Date.now() - i * 60000 - page * 600000).toLocaleString(),
      category: categories[categoryIndex],
    };
  });
};

// 创建 zustand store
const useListStore = create<ListState>((set, get) => ({
  items: [],
  isLoading: false,
  hasMore: true,
  error: null,
  page: 1,
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      await sleep(800); // 模拟网络延迟
      const newItems = generateItems(1);
      set({ items: newItems, isLoading: false, page: 1, hasMore: true });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  loadMoreItems: async () => {
    const { isLoading, page, hasMore, items } = get();

    if (isLoading || !hasMore) return;

    set({ isLoading: true, error: null });
    try {
      await sleep(800); // 模拟网络延迟
      const nextPage = page + 1;

      // 模拟只有5页数据
      if (nextPage > 5) {
        set({ hasMore: false, isLoading: false });
        return;
      }

      const newItems = generateItems(nextPage);
      set({
        items: [...items, ...newItems],
        page: nextPage,
        isLoading: false,
        hasMore: nextPage < 5,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  refreshItems: async () => {
    set({ isLoading: true, error: null });
    try {
      await sleep(800); // 模拟网络延迟
      const newItems = generateItems(1);
      set({ items: newItems, isLoading: false, page: 1, hasMore: true });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

// 列表项渲染组件
const ListItemCard: React.FC<{ item: ListItem }> = ({ item }) => {
  const categoryColors = useMemo(
    () => ({
      news: 'bg-blue-100 text-blue-800',
      article: 'bg-green-100 text-green-800',
      video: 'bg-purple-100 text-purple-800',
    }),
    []
  );

  return (
    <Card className="mb-2">
      <CardHeader className="px-4 py-2 pb-0">
        <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <Text className="text-sm text-secondary-foreground">{item.description}</Text>
        <View className="flex-row justify-between mt-2 items-center">
          <Text className="text-xs text-gray-500">{item.timestamp}</Text>
          <View className={`px-2 py-1 rounded-full ${categoryColors[item.category]}`}>
            <Text className="text-xs">{item.category}</Text>
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

// 底部加载更多组件
const ListFooter: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;

  return (
    <View className="py-4 flex items-center justify-center">
      <ActivityIndicator size="small" color="#0284c7" />
      <Text className="text-sm text-secondary-foreground mt-2">加载更多...</Text>
    </View>
  );
};

// 主要组件
export default function FlashListScreen() {
  const { items, isLoading, hasMore, error, loadItems, loadMoreItems, refreshItems } = useListStore();
  const [refreshing, setRefreshing] = useState(false);

  // 首次加载数据
  React.useEffect(() => {
    loadItems();
  }, [loadItems]);

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshItems();
    setRefreshing(false);
  };

  // 上拉加载更多
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      loadMoreItems();
    }
  };

  return (
    <View className="flex-1 px-6 pt-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">高性能列表</Text>
        <Text className="text-secondary-foreground">使用 FlashList 实现高性能的长列表渲染。</Text>
      </View>

      <Button onPress={handleRefresh} disabled={isLoading} className="mb-4">
        {refreshing ? <ActivityIndicator color="white" /> : <Text>刷新数据</Text>}
      </Button>

      {error ? (
        <View className="bg-red-100 p-3 rounded-md mb-4">
          <Text className="text-destructive">{error}</Text>
        </View>
      ) : null}

      <FlashList
        data={items}
        renderItem={({ item }) => <ListItemCard item={item} />}
        estimatedItemSize={160}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<ListFooter loading={isLoading} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 justify-center items-center py-20">
              <ActivityIndicator size="large" color="#0284c7" />
              <Text className="mt-2">加载中...</Text>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center py-20">
              <Text>暂无数据</Text>
            </View>
          )
        }
      />
    </View>
  );
}
