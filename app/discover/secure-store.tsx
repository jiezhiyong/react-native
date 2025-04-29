import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoSecureStoreScreen() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [storedValue, setStoredValue] = useState<string | null>(null);

  const saveValue = async () => {
    if (!key || !value) {
      Alert.alert('错误', '请填写键和值');
      return;
    }

    try {
      await SecureStore.setItemAsync(key, value);
      Alert.alert('成功', '数据已安全保存');
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
      } else {
        Alert.alert('成功', '数据已读取');
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
      Alert.alert('成功', '数据已删除');
    } catch (error) {
      console.error('删除失败:', error);
      Alert.alert('错误', '删除数据失败');
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">安全存储</Text>
        <Text className="text-secondary-foreground">安全地存储和访问敏感信息和凭据。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">安全存储</Text>
        <Text className="text-secondary-foreground">使用安全存储来保存敏感信息，如令牌、密码等。</Text>
      </View>

      {/* 输入区域 */}
      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-base font-semibold mb-2">键</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="输入键名"
            value={key}
            onChangeText={setKey}
          />
        </View>

        <View>
          <Text className="text-base font-semibold mb-2">值</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3"
            placeholder="输入要保存的值"
            value={value}
            onChangeText={setValue}
            secureTextEntry
          />
        </View>
      </View>

      {/* 操作按钮 */}
      <View className="space-y-4 mb-6">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={saveValue}
        >
          <Ionicons name="save" size={20} color="white" />
          <Text className="text-white ml-2">保存</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={getValue}
        >
          <Ionicons name="search" size={20} color="white" />
          <Text className="text-white ml-2">读取</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={deleteValue}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text className="text-white ml-2">删除</Text>
        </TouchableOpacity>
      </View>

      {/* 存储的值显示 */}
      {storedValue !== null && (
        <View className="bg-gray-100 rounded-lg p-4 mb-6">
          <Text className="text-base font-semibold mb-2">存储的值</Text>
          <Text className="text-lg">{storedValue}</Text>
        </View>
      )}

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 安全存储用于保存敏感信息
          {'\n'}2. 数据会被加密存储
          {'\n'}3. 即使应用被卸载，数据也会被保留
          {'\n'}4. 建议用于存储令牌、密码等敏感信息
        </Text>
      </View>
    </ScrollView>
  );
}
