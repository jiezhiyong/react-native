import { Image } from 'expo-image';
import { Hand, Move, Trash } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { create } from 'zustand';

import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Text } from '~/components/ui/text';

// 定义手势状态
interface GestureState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetGestures: () => void;
}

// 使用 zustand 创建状态管理
const useGestureStore = create<GestureState>((set) => ({
  activeTab: 'tap',
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  resetGestures: () => {
    // 这里只更新状态，具体的重置操作在组件内部处理
    set({ activeTab: 'tap' });
  },
}));

// 拖拽手势示例
const DraggableCard: React.FC = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const scale = useSharedValue(1);

  // 定义拖拽手势
  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
    })
    .onEnd(() => {
      // 当拖拽结束时添加弹性效果
      if (Math.abs(translateX.value) > 150) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  // 定义双击手势
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = scale.value === 1 ? withSpring(1.5) : withSpring(1);
    });

  // 组合多个手势
  const composedGestures = Gesture.Exclusive(doubleTapGesture, panGesture);

  // 创建动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    };
  });

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View
        className="w-[150px] h-[100px] bg-white rounded-[10px] items-center justify-center p-5 shadow-md"
        style={animatedStyle}
      >
        <View className="flex-row items-center justify-center">
          <Move size={40} className="text-primary" />
        </View>
        <Text className="text-sm text-center mt-2 text-secondary-foreground">双击可放大/缩小</Text>
      </Animated.View>
    </GestureDetector>
  );
};

// 点击手势示例
const TapCard: React.FC = () => {
  const [taps, setTaps] = useState(0);
  const scale = useSharedValue(1);

  // 定义单击手势
  const singleTap = Gesture.Tap().onEnd(() => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
    runOnJS(setTaps)(taps + 1);
  });

  // 定义双击手势
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSpring(0.9, {}, () => {
        scale.value = withSpring(1);
      });
      runOnJS(setTaps)(0);
    });

  // 组合单击和双击手势
  const tapGesture = Gesture.Exclusive(doubleTap, singleTap);

  // 创建动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[animatedStyle]}>
        <Card className="p-4 items-center justify-center">
          <CardContent className="p-6 items-center">
            <Hand size={40} />
            <Text className="text-lg font-bold text-center mt-4">点击手势示例（单击增加，双击重置）</Text>
            <Text className="text-base text-center mt-2 text-secondary-foreground">点击次数: {taps}</Text>
          </CardContent>
        </Card>
      </Animated.View>
    </GestureDetector>
  );
};

// 缩放旋转手势示例
const PinchRotateCard: React.FC = () => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  // 定义缩放手势
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    });

  // 定义旋转手势
  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      savedRotation.value = rotation.value;
    })
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    });

  // 组合缩放和旋转手势
  const composedGestures = Gesture.Simultaneous(pinchGesture, rotationGesture);

  // 创建动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotateZ: `${rotation.value}rad` }],
    };
  });

  return (
    <GestureDetector gesture={composedGestures}>
      <Animated.View style={[animatedStyle, { alignItems: 'center' }]}>
        <Image
          source={require('~/assets/images/icon.png')}
          style={{ width: 200, height: 200, borderRadius: 10 }}
          contentFit="cover"
        />
        <Text className="text-sm text-center mt-2 text-secondary-foreground">使用两指进行缩放和旋转</Text>
      </Animated.View>
    </GestureDetector>
  );
};

// 长按手势示例
const COLORS = ['#b58df1', '#fa7f7c', '#ffe780', '#82cab2'];

const LongPressCard: React.FC = () => {
  const colorIndex = useSharedValue(0);
  const scale = useSharedValue(1);

  const longPress = Gesture.LongPress()
    // 使用runOnJS让所有回调在JS线程上运行，避免worklet限制
    .runOnJS(true)
    .onBegin(() => {
      scale.value = withTiming(1.2, {
        duration: 500,
      });
    })
    .onStart(() => {
      colorIndex.value = withTiming((colorIndex.value + 1) % COLORS.length, { duration: 200 });
    })
    .onFinalize(() => {
      scale.value = withTiming(1, {
        duration: 250,
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    const index = Math.round(colorIndex.value) % COLORS.length;
    return {
      backgroundColor: COLORS[index],
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View className="items-center">
      <GestureDetector gesture={longPress}>
        <Animated.View style={[styles.box, animatedStyle]}></Animated.View>
      </GestureDetector>
      <Text className="text-sm text-center mt-2 text-secondary-foreground">长按方块改变颜色</Text>
    </View>
  );
};

// 滑动删除手势示例
const SwipeToDeleteCard: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, name: '项目 1' },
    { id: 2, name: '项目 2' },
    { id: 3, name: '项目 3' },
    { id: 4, name: '项目 4' },
  ]);

  // 删除项目
  const removeItem = (item: { id: number }) => {
    setItems((current) => current.filter((i) => i.id !== item.id));
  };

  return (
    <View className="w-full">
      {items.map((item) => (
        <SwipeableItem key={item.id} item={item} onDelete={() => removeItem(item)} />
      ))}
      {items.length === 0 && (
        <View className="items-center py-6">
          <Text className="text-secondary-foreground">所有项目已删除</Text>
          <Button
            className="mt-4"
            onPress={() =>
              setItems([
                { id: 1, name: '项目 1' },
                { id: 2, name: '项目 2' },
                { id: 3, name: '项目 3' },
                { id: 4, name: '项目 4' },
              ])
            }
          >
            <Text>重置</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

// 可滑动删除的单个项目
const SwipeableItem: React.FC<{ item: { id: number; name: string }; onDelete: () => void }> = ({ item, onDelete }) => {
  const translateX = useSharedValue(0);
  const itemHeight = 60;
  const SWIPE_THRESHOLD = -120;

  // 定义滑动手势
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // 只允许向左滑动删除
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd(() => {
      const shouldDelete = translateX.value < SWIPE_THRESHOLD;
      if (shouldDelete) {
        translateX.value = withTiming(-500, undefined, (finished) => {
          if (finished) {
            runOnJS(onDelete)();
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  // 创建动画样式
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // 背景删除按钮的动画样式
  const deleteButtonStyle = useAnimatedStyle(() => {
    // 计算不透明度，基于滑动距离
    const opacity = Math.min(1, Math.abs(translateX.value) / 100);
    return {
      opacity: opacity,
      width: translateX.value < SWIPE_THRESHOLD ? Math.abs(translateX.value) : 'auto',
    };
  });

  return (
    <View className="w-full my-1 overflow-hidden">
      {/* 背景删除按钮 */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            right: 0,
            height: itemHeight,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: '#ef4444',
            borderRadius: 8,
          },
          deleteButtonStyle,
        ]}
      >
        <View className="flex-row items-center">
          <Text className="text-white mr-2">删除</Text>
          <Trash size={20} color="white" />
        </View>
      </Animated.View>

      {/* 可滑动的项目 */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle]}>
          <Card className="p-4 flex-row items-center" style={{ height: itemHeight }}>
            <Text>{item.name}</Text>
          </Card>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

// 主组件
export default function GestureHandlerScreen() {
  const { activeTab, setActiveTab, resetGestures } = useGestureStore();

  // 切换标签页
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <GestureHandlerRootView className="flex-1 p-6">
      <Button onPress={resetGestures} className="mb-4">
        <Text>重置所有手势</Text>
      </Button>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="mb-4 flex-row justify-start">
          <TabsTrigger value="tap">
            <Text>点击</Text>
          </TabsTrigger>
          <TabsTrigger value="drag">
            <Text>拖拽</Text>
          </TabsTrigger>
          <TabsTrigger value="pinch">
            <Text>缩放旋转</Text>
          </TabsTrigger>
          <TabsTrigger value="longpress">
            <Text>长按</Text>
          </TabsTrigger>
          <TabsTrigger value="swipe">
            <Text>滑动删除</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tap">
          <TapCard />
        </TabsContent>

        <TabsContent value="drag">
          <View className="items-center">
            <DraggableCard />
          </View>
        </TabsContent>

        <TabsContent value="pinch">
          <View className="items-center">
            <PinchRotateCard />
          </View>
        </TabsContent>

        <TabsContent value="longpress">
          <View className="items-center">
            <LongPressCard />
          </View>
        </TabsContent>

        <TabsContent value="swipe">
          <SwipeToDeleteCard />
        </TabsContent>
      </Tabs>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    cursor: 'pointer',
  },
});
