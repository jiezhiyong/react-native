import { useRouter } from 'expo-router';
import { setStatusBarStyle } from 'expo-status-bar';
import * as React from 'react';
import { Animated, View } from 'react-native';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { BREAK_POINT } from '~/components/ui/custom-header';
import { Text } from '~/components/ui/text';
import { useI18nContext } from '~/i18n/i18n-react';
import { useScrollStore } from '~/store/scroll';

export default function HomeScreen() {
  const router = useRouter();

  const { homeScrollY, updateHomeScroll, activeTab } = useScrollStore();
  const { LL, locale } = useI18nContext();

  // 设置滚动监听
  React.useEffect(() => {
    const id = homeScrollY.addListener(({ value }) => {
      updateHomeScroll(value);
      if (activeTab === 'home') {
        setStatusBarStyle(value > BREAK_POINT ? 'dark' : 'light');
      }
    });

    return () => homeScrollY.removeListener(id);
  }, [activeTab]);

  return (
    <Animated.ScrollView
      className="flex-1"
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: homeScrollY } } }], { useNativeDriver: false })}
      scrollEventThrottle={16}
    >
      <View className="px-5 mt-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <Card key={item} className="mb-4">
            <CardHeader>
              <CardTitle>内容卡片 {item}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground">
                这是一个示例卡片，用于演示滚动效果。当你向上滚动时，Header的背景图片会逐渐变为白色。
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </Animated.ScrollView>
  );
}
