import { useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, RefreshControl, View } from 'react-native';
import { ResponsiveGrid } from 'react-native-flexible-grid';

import { BREAK_POINT } from '~/components/ui/custom-header';
import { sleep } from '~/lib/utils';
import { useTabsScrollStore } from '~/store/scroll';

interface DataProp {
  id: number;
  widthRatio?: number;
  heightRatio?: number;
  imageUrl?: string;
}

export default function HomeScreen() {
  const [data, setData] = useState<DataProp[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { homeScrollY, updateHomeScroll, activeTab } = useTabsScrollStore();

  let idCounter = useRef(0);

  // 处理下拉刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await sleep(1500);
    const initData = getData(1);
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
  const getData = (repeatedTimes: number) => {
    const originalData = [
      { widthRatio: 1, heightRatio: 4 },
      { widthRatio: 1, heightRatio: 3 },
      { widthRatio: 1, heightRatio: 4 },
      { widthRatio: 1, heightRatio: 5 },
      { widthRatio: 1, heightRatio: 5 },
      { widthRatio: 1, heightRatio: 3 },
    ];

    let clonedData: DataProp[] = [];
    for (let i = 0; i < repeatedTimes; i++) {
      const newData = originalData.map((item) => ({
        ...item,
        id: ++idCounter.current,
      }));
      clonedData = [...clonedData, ...newData];
    }

    return clonedData;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    await sleep(1500);
    const newData = getData(1);
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

  const renderItem = ({ item }: { item: DataProp }) => {
    return (
      <View className="flex-1 w-full px-1 pt-2">
        <Image
          source={require('~/assets/images/home-header-bg.jpg')}
          className="w-full h-full rounded-xl border border-border p-1"
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <ResponsiveGrid
      keyExtractor={(item: DataProp) => item.id.toString()}
      onScroll={handleScroll}
      scrollEventInterval={16}
      maxItemsPerColumn={2}
      data={data}
      renderItem={renderItem}
      itemUnitHeight={80}
      HeaderComponent={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      FooterComponent={renderFooter}
      onEndReached={loadData}
      onEndReachedThreshold={0.2}
      style={{
        paddingTop: 16,
        paddingHorizontal: 16,
      }}
    />
  );
}
