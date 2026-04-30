import { Ionicons } from '@expo/vector-icons';
import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const { width } = Dimensions.get('window');

export default function ExpoMaskedViewScreen() {
  const [selectedMask, setSelectedMask] = useState<'circle' | 'gradient' | 'text'>('text');

  const renderMaskedContent = () => {
    switch (selectedMask) {
      case 'circle':
        return (
          <MaskedView
            style={{ width: 200, height: 200, backgroundColor: '#eaeaea', borderRadius: 200 }}
            maskElement={<View className="w-full h-full rounded-full bg-black" />}
          >
            <Image
              source={{ uri: 'https://picsum.photos/200' }}
              style={{ width: 200, height: 200 }}
              contentFit="cover"
            />
          </MaskedView>
        );
      case 'gradient':
        return (
          <MaskedView
            style={{ width: 200, height: 200, backgroundColor: '#eaeaea', borderRadius: 10 }}
            maskElement={
              <LinearGradient
                colors={['transparent', 'black', 'transparent']}
                style={{ width: 200, height: 200 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            }
          >
            <Image
              source={{ uri: 'https://picsum.photos/200' }}
              style={{ width: 200, height: 200, borderRadius: 10 }}
              contentFit="cover"
            />
          </MaskedView>
        );
      case 'text':
        return (
          <MaskedView
            style={{ width: width - 48, height: 100 }}
            maskElement={
              <View className="w-full h-full items-center justify-center">
                <Text className="text-5xl font-bold text-black">MASKED VIEW</Text>
              </View>
            }
          >
            <LinearGradient
              colors={['#FF6B6B', '#4ECDC4']}
              style={{ width: width - 48, height: 100 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </MaskedView>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">遮罩视图</Text>
        <Text className="text-muted-foreground">使用遮罩视图来创建特殊的视觉效果。</Text>
      </View>

      {/* 遮罩类型选择 */}
      <View className="flex-row justify-between mb-6 gap-3">
        <TouchableOpacity
          className={cn('flex-1 p-3 items-center rounded-lg', selectedMask === 'text' ? 'bg-primary' : 'bg-muted')}
          onPress={() => setSelectedMask('text')}
        >
          <Ionicons name="text" size={24} color={selectedMask === 'text' ? 'white' : 'gray'} />
          <Text className={cn('mt-2', selectedMask === 'text' ? 'text-white' : 'text-muted-foreground')}>文字遮罩</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={cn('flex-1 p-3 items-center rounded-lg', selectedMask === 'circle' ? 'bg-primary' : 'bg-muted')}
          onPress={() => setSelectedMask('circle')}
        >
          <Ionicons name="ellipse" size={24} color={selectedMask === 'circle' ? 'white' : 'gray'} />
          <Text className={cn('mt-2', selectedMask === 'circle' ? 'text-white' : 'text-muted-foreground')}>
            圆形遮罩
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={cn('flex-1 p-3 items-center rounded-lg', selectedMask === 'gradient' ? 'bg-primary' : 'bg-muted')}
          onPress={() => setSelectedMask('gradient')}
        >
          <Ionicons name="color-palette" size={24} color={selectedMask === 'gradient' ? 'white' : 'gray'} />
          <Text className={cn('mt-2', selectedMask === 'gradient' ? 'text-white' : 'text-muted-foreground')}>
            渐变遮罩
          </Text>
        </TouchableOpacity>
      </View>

      {/* 遮罩效果展示 */}
      <View className="items-center justify-center">{renderMaskedContent()}</View>
    </View>
  );
}
