import { MasonryFlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { setStatusBarStyle } from 'expo-status-bar';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl, View } from 'react-native';

import { BREAK_POINT } from '~/components/ui/custom-header';
import { Skeleton } from '~/components/ui/skeleton';
import { Text } from '~/components/ui/text';
import { sleep } from '~/lib/utils';
import { useTabsScrollStore } from '~/store/scroll';

interface DataItem {
  id: number;
  skeletonNum: number;
}

export default function HomeScreen() {
  const [data, setData] = useState<DataItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { homeScrollY, updateHomeScroll, activeTab } = useTabsScrollStore();

  let idCounter = useRef(0);

  // 处理下拉刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await sleep(1500);
    const initData = getData();
    setData(initData);
    setRefreshing(false);
  }, []);

  // 设置滚动监听
  useEffect(() => {
    const id = homeScrollY.addListener(({ value }) => {
      updateHomeScroll(value);
      if (activeTab === 'home') {
        setStatusBarStyle(value > BREAK_POINT ? 'dark' : 'light');
      }
    });

    return () => homeScrollY.removeListener(id);
  }, [activeTab, homeScrollY, updateHomeScroll]);

  // 检测滚动
  const handleScroll = useCallback(
    (event: any) => {
      Animated.event([{ nativeEvent: { contentOffset: { y: homeScrollY } } }], {
        useNativeDriver: false,
      })(event);
    },
    [homeScrollY]
  );

  // 获取 Mock 数据
  const getData = () => {
    const originalData = [
      { skeletonNum: 1 },
      { skeletonNum: 3 },
      { skeletonNum: 3 },
      { skeletonNum: 1 },
      { skeletonNum: 2 },
      { skeletonNum: 3 },
    ];

    let clonedData: DataItem[] = [];
    const newData = originalData.map((item) => ({
      ...item,
      id: ++idCounter.current,
      skeletonNum: item.skeletonNum,
    }));
    clonedData = [...clonedData, ...newData];

    return clonedData;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    await sleep(1500);
    const newData = getData();
    setData((prevData) => [...prevData, ...newData]);
    setIsLoadingMore(false);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator />
      </View>
    );
  };

  const renderItem = ({ item }: { item: DataItem }) => {
    return (
      <View className="px-1 pt-2">
        <View className="flex-1 w-full overflow-hidden rounded-xl border border-border p-3">
          <View className="w-full aspect-square">
            <Image
              source={require('~/assets/images/home-header-bg.jpg')}
              className="w-full h-auto"
              style={{ aspectRatio: 1, borderRadius: 6 }}
              contentFit="cover"
            />
          </View>

          {Array.from({ length: item.skeletonNum }).map((_, index) => (
            <View key={index}>
              <Skeleton className="w-full h-5 rounded-md mt-2" />
              <Skeleton className="w-3/5 h-5 rounded-md mt-2" />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <MasonryFlashList
      keyExtractor={(item) => item.id.toString()}
      onScroll={handleScroll}
      refreshing={refreshing}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      onEndReached={loadData}
      data={data}
      numColumns={2}
      renderItem={renderItem}
      ListFooterComponent={renderFooter}
      ListHeaderComponent={
        <View className="w-full rounded-xl overflow-hidden pt-5 pb-1 px-1">
          <Image
            source={require('~/assets/images/home-header-bg.jpg')}
            style={{ height: 120, borderRadius: 6 }}
            contentFit="cover"
          />
        </View>
      }
      ListEmptyComponent={null}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      optimizeItemArrangement={false}
    />
  );
}
