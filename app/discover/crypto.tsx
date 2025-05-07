import * as Crypto from 'expo-crypto';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

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
    } catch (error) {
      console.error('MD5 哈希计算失败:', error);
    }
  };

  // 使用SHA-512加密字符串
  const generateSHA512 = async () => {
    try {
      const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, inputText);
      setResults((prev) => ({ ...prev, sha512: digest }));
    } catch (error) {
      console.error('SHA-512 哈希计算失败:', error);
    }
  };

  // 生成随机UUID
  const generateRandomUUID = () => {
    try {
      const uuid = Crypto.randomUUID();
      setResults((prev) => ({ ...prev, randomUUID: uuid }));
    } catch (error) {
      console.error('随机UUID生成失败:', error);
    }
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">加密功能</Text>
        <Text className="text-muted-foreground">在应用中使用加密算法保护敏感数据。</Text>
      </View>

      {/* 输入区域 */}
      <Input className="mb-6" value={inputText} onChangeText={setInputText} placeholder="输入需要加密的文本..." />

      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">MD5</Text>
        <Button className="mb-2" onPress={generateMD5}>
          <Text>MD5 哈希</Text>
        </Button>
        <Text className="text-muted-foreground text-sm">{results.md5 || '-'}</Text>
      </Card>

      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">SHA-512</Text>
        <Button className="mb-2" onPress={generateSHA512}>
          <Text>SHA-512 哈希</Text>
        </Button>
        <Text className="text-muted-foreground text-sm">{results.sha512 || '-'}</Text>
      </Card>

      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-2">随机UUID</Text>
        <Button className="mb-2" onPress={generateRandomUUID}>
          <Text>生成随机UUID</Text>
        </Button>
        <Text className="text-muted-foreground text-sm">{results.randomUUID || '-'}</Text>
      </Card>
    </ScrollView>
  );
}
