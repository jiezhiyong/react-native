import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

export default function ExpoSecureStoreScreen() {
  const [key, setKey] = useState('password');
  const [value, setValue] = useState('Ads@dafa#fa123456!');
  const [storedValue, setStoredValue] = useState<string | null>(null);

  const saveValue = async () => {
    if (!key || !value) {
      Alert.alert('错误', '请填写键和值');
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
      setStoredValue(value);
    } catch (error) {
      console.error('保存失败:', error);
      Alert.alert('错误', '保存数据失败');
    }
  };

  const getValue = async () => {
    if (!key) {
      Alert.alert('错误', '请填写键');
      return;
    }

    try {
      const result = await SecureStore.getItemAsync(key);
      setStoredValue(result);
      if (result === null) {
        Alert.alert('提示', '未找到对应的值');
      }
    } catch (error) {
      console.error('读取失败:', error);
      Alert.alert('错误', '读取数据失败');
    }
  };

  const deleteValue = async () => {
    if (!key) {
      Alert.alert('错误', '请填写键');
      return;
    }

    try {
      await SecureStore.deleteItemAsync(key);
      setStoredValue(null);
    } catch (error) {
      console.error('删除失败:', error);
      Alert.alert('错误', '删除数据失败');
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">安全存储</Text>
        <Text className="text-muted-foreground">使用安全存储来保存敏感信息，如令牌、密码等。</Text>
      </View>

      {/* 输入区域 */}
      <View className="flex gap-6 mb-6">
        <View>
          <Text className="text-lg font-medium mb-2">键</Text>
          <Input placeholder="输入键名" value={key} onChangeText={setKey} />
        </View>

        <View>
          <Text className="text-lg font-medium mb-2">值</Text>
          <Input placeholder="输入要保存的值" value={value} onChangeText={setValue} secureTextEntry />
        </View>
      </View>

      {/* 操作按钮 */}
      <Text className="text-lg font-medium mb-2">操作</Text>
      <View className="flex gap-3 mb-6">
        <Button onPress={saveValue}>
          <Text>保存</Text>
        </Button>

        <Button onPress={getValue} variant="secondary" className="border">
          <Text>读取</Text>
        </Button>

        <Button onPress={deleteValue} variant="destructive">
          <Text>删除</Text>
        </Button>
      </View>

      {/* 存储的值显示 */}
      {storedValue !== null && (
        <View>
          <Text className="text-lg font-medium mb-2">结果</Text>
          <View className="bg-muted rounded-lg p-4">
            <Text>{storedValue}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
