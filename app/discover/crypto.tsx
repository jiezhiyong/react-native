import * as Crypto from 'expo-crypto';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { toast } from '~/components/ui/sonner';

import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Text } from '../../components/ui/text';

export default function ExpoCryptoScreen() {
  // 状态管理
  const [inputText, setInputText] = useState<string>('有内鬼，终止交易');
  const [results, setResults] = useState<{
    md5: string;
    sha512: string;
    randomUUID: string;
    randomBytes: string;
  }>({
    md5: '',
    sha512: '',
    randomUUID: '',
    randomBytes: '',
  });

  const generateMD5 = async () => {
    try {
      const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, inputText);
      setResults((prev) => ({ ...prev, md5: digest }));
      toast.success('MD5 哈希计算完成');
    } catch (error) {
      console.error('MD5 哈希计算失败:', error);
      toast.error('MD5 哈希计算失败');
    }
  };

  // 使用SHA-512加密字符串
  const generateSHA512 = async () => {
    try {
      const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, inputText);
      setResults((prev) => ({ ...prev, sha512: digest }));
      toast.success('SHA-512 哈希计算完成');
    } catch (error) {
      console.error('SHA-512 哈希计算失败:', error);
      toast.error('SHA-512 哈希计算失败');
    }
  };

  // 生成随机UUID
  const generateRandomUUID = () => {
    try {
      const uuid = Crypto.randomUUID();
      setResults((prev) => ({ ...prev, randomUUID: uuid }));
      toast.success('随机UUID生成完成');
    } catch (error) {
      console.error('随机UUID生成失败:', error);
      toast.error('随机UUID生成失败');
    }
  };

  // 生成随机字节
  const generateRandomBytes = async () => {
    try {
      // 生成16个随机字节
      const randomBytes = Crypto.getRandomBytes(16);
      // 将字节数组转换为十六进制字符串显示
      const hexString = Array.from(randomBytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

      setResults((prev) => ({ ...prev, randomBytes: hexString }));
      toast.success('随机字节生成完成');
    } catch (error) {
      console.error('随机字节生成失败:', error);
      toast.error('随机字节生成失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">加密功能</Text>
        <Text className="text-secondary-foreground">在应用中使用加密算法保护敏感数据。</Text>
      </View>

      {/* 输入区域 */}
      <Card className="p-4 mb-4">
        <Text className="font-medium mb-2">输入文本</Text>
        <Input value={inputText} onChangeText={setInputText} placeholder="输入需要加密的文本..." />
      </Card>

      <Card className="p-4 mb-4">
        <Text className="font-medium mb-2">MD5</Text>
        <Button className="mb-2" onPress={generateMD5}>
          <Text>MD5 哈希</Text>
        </Button>
        <Text className="text-secondary-foreground text-sm">{results.md5 || '-'}</Text>
      </Card>

      <Card className="p-4 mb-4">
        <Text className="font-medium mb-2">SHA-512</Text>
        <Button className="mb-2" onPress={generateSHA512}>
          <Text>SHA-512 哈希</Text>
        </Button>
        <Text className="text-secondary-foreground text-sm">{results.sha512 || '-'}</Text>
      </Card>

      <Card className="p-4 mb-4">
        <Text className="font-medium mb-2">随机UUID</Text>
        <Button className="mb-2" onPress={generateRandomUUID}>
          <Text>生成随机UUID</Text>
        </Button>
        <Text className="text-secondary-foreground text-sm">{results.randomUUID || '-'}</Text>
      </Card>

      <Card className="p-4 mb-4">
        <Text className="font-medium mb-2">随机字节(十六进制)</Text>
        <Button className="mb-2" onPress={generateRandomBytes}>
          <Text>生成随机字节</Text>
        </Button>
        <Text className="text-secondary-foreground text-sm">{results.randomBytes || '-'}</Text>
      </Card>
    </ScrollView>
  );
}
