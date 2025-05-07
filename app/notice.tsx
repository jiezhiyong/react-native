import { format, isThisMonth, isThisWeek, isToday, isYesterday, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Stack } from 'expo-router';
import { CalendarClock, Mail } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { create } from 'zustand';

// 定义消息类型
interface Notice {
  id: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// 分组后的消息类型
interface GroupedNotices {
  date: string;
  data: Notice[];
}

// 状态管理
interface NoticeStore {
  notices: Notice[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  currentPage: number;
  fetchNotices: (page: number, refresh?: boolean) => Promise<void>;
  markAsRead: (id: string) => void;
}

// 使用zustand创建状态管理
const useNoticeStore = create<NoticeStore>((set, get) => ({
  notices: [],
  loading: false,
  refreshing: false,
  hasMore: true,
  currentPage: 1,

  // 获取消息列表
  fetchNotices: async (page: number, refresh = false) => {
    set({ loading: true, refreshing: refresh });

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟分页数据
      const pageSize = 10;
      const mockData: Notice[] = Array.from({ length: pageSize }, (_, i) => {
        const id = (page - 1) * pageSize + i + 1;
        // 随机生成不同时间段的消息
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        return {
          id: `notice-${id}`,
          title: `Notice Title ${id}`,
          content: `这是消息内容 ${id}，包含一些重要的系统通知。`,
          isRead: Math.random() > 0.5,
          createdAt: date.toISOString(),
        };
      });

      // 检查是否还有更多数据
      const hasMore = page < 3; // 假设最多3页数据

      if (refresh) {
        set({ notices: mockData, hasMore, currentPage: 1 });
      } else {
        set((state) => ({
          notices: [...state.notices, ...mockData],
          hasMore,
          currentPage: page,
        }));
      }
    } catch (error) {
      console.error('获取消息失败:', error);
    } finally {
      set({ loading: false, refreshing: false });
    }
  },

  // 标记消息为已读
  markAsRead: (id: string) => {
    set((state) => ({
      notices: state.notices.map((notice) => (notice.id === id ? { ...notice, isRead: true } : notice)),
    }));
  },
}));

// 获取日期分组标签
const getDateGroup = (dateStr: string): string => {
  const date = parseISO(dateStr);

  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';
  if (isThisWeek(date)) return '本周';
  if (isThisMonth(date)) return '本月';

  return format(date, 'yyyy年MM月', { locale: zhCN });
};

// 消息项组件
const NoticeItem = ({ item, onPress }: { item: Notice; onPress: () => void }) => {
  return (
    <View className={`p-4 mb-3 rounded-lg ${item.isRead ? 'bg-gray-50' : 'bg-blue-50'}`} onTouchEnd={onPress}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`font-medium ${item.isRead ? 'text-gray-700' : 'text-blue-700'}`}>{item.title}</Text>
        {!item.isRead && <View className="bg-red-500 w-2 h-2 rounded-full" />}
      </View>
      <Text className="text-muted-foreground mb-2" numberOfLines={2}>
        {item.content}
      </Text>
      <Text className="text-xs text-gray-400">{format(parseISO(item.createdAt), 'yyyy-MM-dd HH:mm')}</Text>
    </View>
  );
};

// 日期分组标题组件
const DateGroupHeader = ({ title }: { title: string }) => (
  <View className="flex-row items-center py-2 mb-2">
    <CalendarClock size={16} color="#6b7280" />
    <Text className="text-sm font-medium text-muted-foreground ml-2">{title}</Text>
  </View>
);

export default function NoticeScreen() {
  const { notices, loading, refreshing, hasMore, currentPage, fetchNotices, markAsRead } = useNoticeStore();

  // 分组消息
  const [groupedNotices, setGroupedNotices] = useState<GroupedNotices[]>([]);

  // 初始加载数据
  useEffect(() => {
    fetchNotices(1);
  }, [fetchNotices]);

  // 处理消息分组
  useEffect(() => {
    if (notices.length === 0) return;

    const groups: Record<string, Notice[]> = {};

    notices.forEach((notice) => {
      const dateGroup = getDateGroup(notice.createdAt);
      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(notice);
    });

    // 转换为数组格式并按日期排序
    const sortedGroups = Object.entries(groups)
      .map(([date, data]) => ({ date, data }))
      .sort((a, b) => {
        // 根据组名按特定顺序排序
        const order = ['今天', '昨天', '本周', '本月'];
        const aIndex = order.indexOf(a.date);
        const bIndex = order.indexOf(b.date);

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        // 降序排列年月
        return b.date.localeCompare(a.date);
      });

    setGroupedNotices(sortedGroups);
  }, [notices]);

  // 刷新数据
  const onRefresh = useCallback(() => {
    fetchNotices(1, true);
  }, [fetchNotices]);

  // 加载更多数据
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchNotices(currentPage + 1);
  }, [loading, hasMore, currentPage, fetchNotices]);

  // 处理消息点击
  const handleNoticePress = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead]
  );

  // 渲染分组
  const renderSection = useCallback(
    ({ item }: { item: GroupedNotices }) => (
      <View>
        <DateGroupHeader title={item.date} />
        {item.data.map((notice) => (
          <NoticeItem key={notice.id} item={notice} onPress={() => handleNoticePress(notice.id)} />
        ))}
      </View>
    ),
    [handleNoticePress]
  );

  // 渲染加载更多的状态
  const renderFooter = useCallback(() => {
    if (!loading || refreshing) return null;

    return (
      <View className="py-4 flex-row justify-center">
        <ActivityIndicator size="small" color="#3b82f6" />
        <Text className="ml-2 text-blue-500">加载更多...</Text>
      </View>
    );
  }, [loading, refreshing]);

  // 渲染空状态
  const renderEmpty = useCallback(() => {
    if (loading && !refreshing) return null;

    return (
      <View className="flex-1 justify-center items-center py-10">
        <Mail size={48} color="#d1d5db" />
        <Text className="mt-4 text-gray-400">暂无消息通知</Text>
      </View>
    );
  }, [loading, refreshing]);

  return (
    <View className="flex-1 bg-background px-4 pb-1 pt-2">
      <Stack.Screen
        options={{
          title: '消息中心',
          headerShadowVisible: false,
        }}
      />

      <FlatList
        className="flex-1"
        data={groupedNotices}
        renderItem={renderSection}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} tintColor="#3b82f6" />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}
