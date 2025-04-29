import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';

const STORAGE_KEYS = {
  LAST_VISIT: 'last_visit',
};

// 存储数据封装函数
async function storeData(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`[AsyncStorage] 存储 ${key} 成功`);
    return true;
  } catch (error) {
    console.error(`[AsyncStorage] 存储 ${key} 失败:`, error);
    Alert.alert('存储失败', `无法存储数据: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// 删除指定项封装函数
async function removeData(key: string) {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`[AsyncStorage] 删除 ${key} 成功`);
    return true;
  } catch (error) {
    console.error(`[AsyncStorage] 删除 ${key} 失败:`, error);
    Alert.alert('删除失败', `无法删除数据: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// 获取所有存储键值对封装函数
async function getAllData(): Promise<[string, string | null][]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log('[AsyncStorage] 获取所有键值对成功', items);
    return [...items]; // 转换为可变数组
  } catch (error) {
    console.error('[AsyncStorage] 获取所有键值对失败:', error);
    Alert.alert('获取失败', `无法获取所有数据: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

// 清除全部存储封装函数
async function clearAllData() {
  try {
    await AsyncStorage.clear();
    console.log('[AsyncStorage] 清除所有数据成功');
    return true;
  } catch (error) {
    console.error('[AsyncStorage] 清除所有数据失败:', error);
    Alert.alert('清除失败', `无法清除数据: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

export default function AsyncStorageScreen() {
  const [lastVisit, setLastVisit] = useState<string>('');
  const [allItems, setAllItems] = useState<[string, string | null][]>([]);
  const [inputKey, setInputKey] = useState('abc');
  const [inputValue, setInputValue] = useState('123');

  // 加载保存的数据
  useEffect(() => {
    const loadData = async () => {
      // 获取所有数据
      const items = await getAllData();
      setAllItems(items);

      // 保存访问时间
      const now = new Date().toLocaleString();
      await storeData(STORAGE_KEYS.LAST_VISIT, now);
      setLastVisit(now);
    };

    loadData();
  }, []);

  // 处理自定义键值对保存
  const handleSaveCustomItem = async () => {
    if (!inputKey.trim()) {
      Alert.alert('错误', '请输入键名');
      return;
    }

    if (await storeData(inputKey, inputValue)) {
      Alert.alert('保存成功', `已保存键 "${inputKey}" 的值`);
      const items = await getAllData();
      setAllItems(items);
    }
  };

  // 处理删除项
  const handleRemoveItem = async (key: string) => {
    Alert.alert('确认删除', `确定要删除 "${key}" 吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          if (await removeData(key)) {
            const items = await getAllData();
            setAllItems(items);
          }
        },
      },
    ]);
  };

  // 处理清除所有数据
  const handleClearAll = async () => {
    Alert.alert('确认清除', '确定要清除所有存储的数据吗？此操作不可撤销。', [
      { text: '取消', style: 'cancel' },
      {
        text: '清除',
        style: 'destructive',
        onPress: async () => {
          if (await clearAllData()) {
            // 重置状态
            setAllItems([]);

            // 设置新的访问时间
            const now = new Date().toLocaleString();
            await storeData(STORAGE_KEYS.LAST_VISIT, now);
            setLastVisit(now);

            // 刷新所有数据
            const items = await getAllData();
            setAllItems(items);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">异步存储</Text>
        <Text className="text-secondary-foreground">使用异步存储来持久化保存应用数据。</Text>
      </View>

      {/* 访问时间示例 */}
      <View className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
        <Text className="text-lg font-bold mb-3">最后访问时间</Text>
        <Text>{lastVisit}</Text>
      </View>

      {/* 自定义键值对 */}
      <View className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
        <Text className="text-lg font-bold mb-3">添加键值对</Text>
        <View className="flex-row mb-3 gap-3">
          <Input className="flex-1" value={inputKey} onChangeText={setInputKey} placeholder="键名" />
          <Input className="flex-[2]" value={inputValue} onChangeText={setInputValue} placeholder="值" />
        </View>
        <Button onPress={handleSaveCustomItem}>
          <Text>保存</Text>
        </Button>
      </View>

      {/* 所有存储数据 */}
      <View className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold">所有存储的数据</Text>
          <Button
            size="icon"
            variant="ghost"
            onPress={async () => {
              const items = await getAllData();
              setAllItems(items);
            }}
          >
            <RefreshCcw size={20} />
          </Button>
        </View>

        <View className="mb-4">
          {allItems.length > 0 ? (
            allItems.map(([key, value], index) => (
              <View key={index} className="flex-row border-b border-gray-100 py-2 items-center">
                <View className="flex-1">
                  <Text className="font-medium">{key}</Text>
                  <Text className="text-secondary-foreground text-sm" numberOfLines={2}>
                    {value || '(空)'}
                  </Text>
                </View>
                <Button size="sm" variant="ghost" onPress={() => handleRemoveItem(key)}>
                  <Text className="!text-destructive text-xs">删除</Text>
                </Button>
              </View>
            ))
          ) : (
            <Text className="text-center text-gray-400 py-4">没有存储的数据</Text>
          )}
        </View>

        {allItems.length > 0 && (
          <Button variant="destructive" onPress={handleClearAll}>
            <Text className="text-white font-medium">清除所有数据</Text>
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
