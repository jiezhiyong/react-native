import { Ionicons } from '@expo/vector-icons';
import { NavigationBar, type NavigationBarStyle } from 'expo-navigation-bar';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ExpoNavigationBarScreen() {
  const [hidden, setHidden] = useState(false);
  const [style, setStyle] = useState<NavigationBarStyle>('light');

  const toggleVisibility = () => {
    setHidden((current) => !current);
  };

  const changeStyle = (nextStyle: NavigationBarStyle) => {
    setStyle(nextStyle);
  };

  return (
    <>
      <NavigationBar hidden={hidden} style={style} />

      <ScrollView className="flex-1 p-5">
        <View className="mb-6">
          <Text className="text-2xl font-bold mb-2">导航栏 (仅限 Android)</Text>
          <Text className="text-muted-foreground">使用声明式 API 控制设备导航栏的样式与可见性。</Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">可见性控制</Text>
          <Button onPress={toggleVisibility} className="flex-row">
            <Ionicons name={hidden ? 'eye' : 'eye-off'} size={20} color="white" />
            <Text className="text-white ml-2">{hidden ? '显示导航栏' : '隐藏导航栏'}</Text>
          </Button>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">按钮样式</Text>
          <View className="flex-row gap-3 flex-wrap">
            {(['auto', 'light', 'dark', 'inverted'] as const).map((item) => (
              <Button key={item} variant={style === item ? 'default' : 'outline'} onPress={() => changeStyle(item)}>
                <Text className={style === item ? 'text-white' : 'text-muted-foreground'}>{item}</Text>
              </Button>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">当前配置</Text>
          <Text className="text-muted-foreground">hidden: {hidden ? 'true' : 'false'}</Text>
          <Text className="text-muted-foreground">style: {style}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">样式预览标记</Text>
          <View className="flex-row justify-between">
            {(['light', 'dark'] as const).map((item) => (
              <TouchableOpacity
                key={item}
                className="size-14 rounded-full border justify-center items-center"
                style={{ backgroundColor: item === 'light' ? '#ffffff' : '#000000' }}
                onPress={() => changeStyle(item)}
              >
                {style === item ? <Check /> : null}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
