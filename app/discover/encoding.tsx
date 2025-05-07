import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { toast } from '~/components/ui/sonner';
import { Textarea } from '~/components/ui/textarea';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Text } from '../../components/ui/text';

export default function EncodingScreen() {
  // 状态管理：输入文本
  const [inputText, setInputText] = useState<string>('有内鬼，终止交易');
  // 状态管理：编码结果
  const [encodedResult, setEncodedResult] = useState<string>('');
  // 状态管理：解码结果
  const [decodedResult, setDecodedResult] = useState<string>('');
  // 状态管理：解码输入（十六进制格式）
  const [decodeInput, setDecodeInput] = useState<string>('');

  // 使用TextEncoder进行编码
  const encodeText = () => {
    try {
      if (!inputText.trim()) {
        toast.error('请输入要编码的文本');
        return;
      }

      // 创建TextEncoder实例
      const encoder = new TextEncoder();

      // 编码文本为Uint8Array
      const encoded = encoder.encode(inputText);

      // 将Uint8Array转换为十六进制字符串以便显示
      const hexString = Array.from(encoded)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ');

      // 更新状态并自动填充解码输入
      setEncodedResult(hexString);
      setDecodeInput(hexString);
    } catch (error) {
      console.error('编码时出错:', error);
      toast.error('编码失败');
    }
  };

  // 使用TextDecoder解码
  const decodeBytes = () => {
    try {
      if (!decodeInput.trim()) {
        toast.error('请输入要解码的十六进制字符串');
        return;
      }

      // 将十六进制字符串转换为字节数组
      const bytes = decodeInput
        .split(' ')
        .filter((s) => s.trim() !== '')
        .map((hex) => parseInt(hex, 16));

      if (bytes.some(isNaN)) {
        toast.error('输入格式不正确，请使用有效的十六进制格式');
        return;
      }

      // 创建Uint8Array
      const uint8Array = new Uint8Array(bytes);

      // 创建TextDecoder实例
      const decoder = new TextDecoder();

      // 解码字节数组为字符串
      const decoded = decoder.decode(uint8Array);

      // 更新状态
      setDecodedResult(decoded);
    } catch (error) {
      console.error('解码时出错:', error);
      toast.error('解码失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">编码工具</Text>
        <Text className="text-muted-foreground">在应用中进行各种数据编码和解码操作。</Text>
      </View>

      {/* 编码区域 */}
      <Text className="text-lg font-medium">文本编码 - TextEncoder</Text>
      <Text className="text-muted-foreground text-sm mb-2">将输入的文本编码为UTF-8字节序列，显示为十六进制字符串</Text>
      <Input
        value={inputText}
        onChangeText={(text) => setInputText(text)}
        placeholder="输入要编码的文本"
        className="mb-3"
      />
      <Button onPress={encodeText} className="mb-3">
        <Text>编码为UTF-8</Text>
      </Button>

      {encodedResult ? (
        <View>
          <Text className="text-lg font-medium mb-2">编码结果:</Text>
          <View className="bg-card-foreground/5 p-3 rounded-lg">
            <Text className="text-muted-foreground break-all text-xs">{encodedResult}</Text>
          </View>
        </View>
      ) : null}

      {/* 解码区域 */}
      <Text className="text-lg font-medium mt-6">字节解码 - TextDecoder</Text>
      <Text className="text-muted-foreground text-sm mb-2">将十六进制字符串解码为文本</Text>
      <Textarea
        value={decodeInput}
        onChangeText={(text) => setDecodeInput(text)}
        placeholder="输入十六进制字节序列，用空格分隔"
        className="mb-3"
      />
      <Button onPress={decodeBytes} className="mb-3">
        <Text>解码为文本</Text>
      </Button>

      {decodedResult ? (
        <View>
          <Text className="text-lg font-medium mb-2">解码结果:</Text>
          <View className="bg-card-foreground/5 p-3 rounded-lg">
            <Text className="text-muted-foreground">{decodedResult}</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
