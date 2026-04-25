import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, Headphones } from 'lucide-react-native';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { ScrollHeader } from '@/components/ui/scroll-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { sleep } from '@/lib/utils';

const ReanimatedFlashList = Animated.createAnimatedComponent(FlashList) as unknown as typeof FlashList;

interface DataItem {
  id: number;
  skeletonNum: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<DataItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isNoMore] = useState(false);
  const isRefreshingRef = useRef(false);
  const isLoadingMoreRef = useRef(false);

  const { scrollY, scrollHandler, isDarkStyle, headerHeight } = useScrollHeader();
  const iconColor = isDarkStyle ? '#141413' : '#faf9f5';

  const rightButtons = [
    { icon: <Headphones size={20} color={iconColor} />, onPress: () => router.push('/online-service' as any) },
    { icon: <Bell size={20} color={iconColor} />, onPress: () => router.push('/notice' as any) },
  ];

  const idCounter = useRef(0);

  const getData = useCallback(() => {
    const originalData = [
      { skeletonNum: 1 },
      { skeletonNum: 3 },
      { skeletonNum: 3 },
      { skeletonNum: 1 },
      { skeletonNum: 2 },
      { skeletonNum: 3 },
    ];

    const newData = originalData.map((item) => ({
      ...item,
      id: ++idCounter.current,
      skeletonNum: item.skeletonNum,
    }));
    return newData;
  }, []);

  const loadData = useCallback(async () => {
    if (isRefreshingRef.current || isLoadingMoreRef.current || isNoMore) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      await sleep(1500);
      const newData = getData();
      setData((prevData) => [...prevData, ...newData]);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [getData, isNoMore]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setRefreshing(true);

    try {
      await sleep(1500);
      const initData = getData();
      setData(initData);
    } finally {
      isRefreshingRef.current = false;
      setRefreshing(false);
    }
  }, [getData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderFooter = () => {
    if (!isLoadingMore && !isNoMore) return null;

    return (
      <View className="py-4">
        {isNoMore ? (
          <Text className="text-center text-sm text-muted-foreground">没有更多了</Text>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: DataItem }) => {
    return (
      <View className="px-1 pt-2">
        <View className="w-full overflow-hidden rounded-xl border border-primary/20 p-3">
          <View className="w-full aspect-square bg-primary/20 rounded-md" style={{ height: 150 }} />

          {Array.from({ length: item.skeletonNum }).map((_, index) => (
            <View key={index}>
              <Skeleton className="w-full h-5 mt-1" />
              <Skeleton className="w-3/5 h-5 mt-1" />
            </View>
          ))}
        </View>
      </View>
    );
  }, []);

  return (
    <View className="flex-1">
      <ScrollHeader
        title="首页"
        scrollY={scrollY}
        backgroundImageSource={require('@/assets/images/home-header-bg.jpg')}
        rightButtons={rightButtons}
        gradientColors={['#c96442', '#d97757']}
      />
      <ReanimatedFlashList
        keyExtractor={(item: any) => item.id.toString()}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadData}
        onEndReachedThreshold={0.5}
        progressViewOffset={headerHeight}
        data={data}
        masonry
        numColumns={2}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={
          <View className="w-full rounded-xl overflow-hidden pt-5 pb-1 px-1">
            <Image
              className="rounded-xl h-[120px]"
              source={require('@/assets/images/home-header-bg.jpg')}
              contentFit="cover"
            />
          </View>
        }
        ListEmptyComponent={null}
        contentContainerStyle={{ paddingTop: headerHeight + 12, paddingHorizontal: 20, paddingBottom: 20 }}
      />
    </View>
  );
}
