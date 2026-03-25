import { View } from 'react-native';
import { KeyboardAwareScrollView, useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';
import { Text } from '~/components/ui/text';

const PADDING_BOTTOM = 20;

const useGradualAnimation = () => {
  const height = useSharedValue(PADDING_BOTTOM);

  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';
        // set height to min 10
        height.value = Math.max(e.height, PADDING_BOTTOM);
      },
      onEnd: (e) => {
        'worklet';
        height.value = e.height;
      },
    },
    []
  );
  return { height };
};

export default function KeyboardScreen() {
  const { height } = useGradualAnimation();
  console.log(height);

  return (
    <View className="flex-1 px-5 pt-5">
      <KeyboardAwareScrollView bottomOffset={10}>
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">键盘</Text>
          <Text className="text-muted-foreground">管理和响应屏幕键盘的显示和隐藏</Text>
        </View>

        <View className="flex-1">
          <Skeleton className="w-full h-10 rounded-lg mb-3" />
          <Skeleton className="w-2/5 h-10 rounded-lg mb-3" />
          <Skeleton className="w-4/5 h-10 rounded-lg mb-6" />

          <Skeleton className="w-full h-10 rounded-lg mb-3" />
          <Skeleton className="w-2/5 h-10 rounded-lg mb-3" />
          <Skeleton className="w-4/5 h-10 rounded-lg mb-6" />

          <Skeleton className="w-full h-10 rounded-lg mb-3" />
          <Skeleton className="w-2/5 h-10 rounded-lg mb-3" />
          <Skeleton className="w-4/5 h-10 rounded-lg mb-6" />

          <Input placeholder="Type a message..." className="mb-3" />
          <Input placeholder="Type a message..." />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
