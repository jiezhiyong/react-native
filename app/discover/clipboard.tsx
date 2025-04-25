import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { View } from 'react-native';

import { toast } from '~/components/ui/sonner';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Text } from '../../components/ui/text';

export default function ExpoClipboardScreen() {
  const [clipboardText, setClipboardText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('this is a test');

  // 复制文本到剪贴板
  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(inputText);
      toast.success('文本已复制到剪贴板');
    } catch (error) {
      toast.error('复制到剪贴板失败');
      console.error('复制到剪贴板失败:', error);
    }
  };

  // 从剪贴板读取文本
  const getFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      setClipboardText(text);
      toast.success('已从剪贴板读取文本');
    } catch (error) {
      toast.error('从剪贴板读取失败');
      console.error('从剪贴板读取失败:', error);
    }
  };

  // 清空剪贴板
  const clearClipboard = async () => {
    try {
      await Clipboard.setStringAsync('');
      setClipboardText('');
      toast.success('剪贴板已清空');
    } catch (error) {
      toast.error('清空剪贴板失败');
      console.error('清空剪贴板失败:', error);
    }
  };

  return (
    <>
      {/* 复制到剪贴板 */}
      <View className="mb-6">
        <Text className="text-xl font-semibold mb-2">复制到剪贴板</Text>
        <View className="mb-6">
          <Input
            className="border border-input rounded-md p-3 mb-2 text-foreground"
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={3}
            style={{ textAlignVertical: 'top' }}
            placeholder="输入要复制的文本..."
            placeholderTextColor="#9CA3AF"
          />
          <Button onPress={copyToClipboard}>
            <Text>复制到剪贴板</Text>
          </Button>
        </View>
      </View>

      {/* 从剪贴板读取 */}
      <View className="mb-6">
        <Text className="text-xl font-semibold mb-2">从剪贴板读取</Text>
        <View className="mb-2">
          <Button onPress={getFromClipboard} className="mb-2">
            <Text>读取剪贴板内容</Text>
          </Button>

          <View className="border border-input rounded-md p-4 bg-card min-h-[100px]">
            <Text className="text-foreground">{clipboardText ? clipboardText : ''}</Text>
          </View>
        </View>
      </View>

      {/* 清空剪贴板 */}
      <View className="mb-6">
        <Text className="text-xl font-semibold mb-2">高级操作</Text>
        <Button variant="destructive" onPress={clearClipboard}>
          <Text className="text-destructive-foreground">清空剪贴板</Text>
        </Button>
      </View>
    </>
  );
}
