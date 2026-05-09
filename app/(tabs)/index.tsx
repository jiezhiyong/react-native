import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, Headphones } from 'lucide-react-native';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type NativeScrollEvent, type NativeSyntheticEvent, Platform, RefreshControl, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { LanguageMenuToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScrollHeader } from '@/components/ui/scroll-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { useI18nContext } from '@/i18n/i18n-react';
import { sleep } from '@/lib/utils';

interface DataItem {
  id: number;
  skeletonNum: number;
}

function getEstimatedItemHeight(item: DataItem) {
  return 180 + item.skeletonNum * 24;
}

function splitIntoMasonryColumns(items: DataItem[]) {
  const columns: [DataItem[], DataItem[]] = [[], []];
  const heights = [0, 0];

  items.forEach((item) => {
    const columnIndex = heights[0] <= heights[1] ? 0 : 1;
    columns[columnIndex].push(item);
    heights[columnIndex] += getEstimatedItemHeight(item);
  });

  return columns;
}

export default function HomeScreen() {
  const router = useRouter();
  const { LL } = useI18nContext();
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
    { element: <LanguageMenuToggle iconColor={iconColor} /> },
    { element: <ThemeToggle iconColor={iconColor} /> },
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
          <Text className="text-center text-sm text-muted-foreground">{LL.home.noMore()}</Text>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: DataItem }) => {
    return (
      <View className="px-1 pt-2">
        <View className="w-full overflow-hidden rounded-xl border border-primary/20 p-3 bg-card">
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

  const masonryColumns = useMemo(() => splitIntoMasonryColumns(data), [data]);

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromEnd = contentSize.height - (contentOffset.y + layoutMeasurement.height);

      if (distanceFromEnd < 300) {
        loadData();
      }
    },
    [loadData]
  );

  return (
    <>
      <Animated.ScrollView
        className="flex-1 bg-background"
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentInset={Platform.OS === 'ios' ? { top: headerHeight / 2 } : undefined}
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: -headerHeight } : undefined}
        scrollIndicatorInsets={Platform.OS === 'ios' ? { top: headerHeight } : undefined}
        contentContainerStyle={{
          paddingTop: Platform.OS === 'ios' ? 0 : headerHeight,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <View className="w-full rounded-xl overflow-hidden pt-5 pb-1 px-1">
          <Image
            className="rounded-xl h-[120px]"
            source={require('@/assets/images/home-header-bg.jpg')}
            contentFit="cover"
          />
        </View>
        <View className="flex-row">
          {masonryColumns.map((column, columnIndex) => (
            <View key={columnIndex} className="flex-1">
              {column.map((item) => (
                <React.Fragment key={item.id}>{renderItem({ item })}</React.Fragment>
              ))}
            </View>
          ))}
        </View>
        {renderFooter()}
      </Animated.ScrollView>
      <ScrollHeader
        title={LL.tabs.home()}
        scrollY={scrollY}
        backgroundImageSource={require('@/assets/images/home-header-bg.jpg')}
        rightButtons={rightButtons}
        gradientColors={['#c96442', '#d97757']}
      />
    </>
  );
}
