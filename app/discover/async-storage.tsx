import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 定义存储键名
const STORAGE_KEYS = {
  USER_NAME: 'user_name',
  USER_THEME: 'user_theme',
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

// 获取数据封装函数
async function getData(key: string): Promise<string | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log(`[AsyncStorage] 获取 ${key}: ${value}`);
    return value;
  } catch (error) {
    console.error(`[AsyncStorage] 获取 ${key} 失败:`, error);
    Alert.alert('获取失败', `无法获取数据: ${error instanceof Error ? error.message : String(error)}`);
    return null;
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
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userTheme, setUserTheme] = useState('light');
  const [lastVisit, setLastVisit] = useState<string>('');
  const [allItems, setAllItems] = useState<[string, string | null][]>([]);
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');

  // 加载保存的数据
  useEffect(() => {
    const loadData = async () => {
      // 获取用户名
      const savedName = await getData(STORAGE_KEYS.USER_NAME);
      if (savedName) setUserName(savedName);

      // 获取主题
      const savedTheme = await getData(STORAGE_KEYS.USER_THEME);
      if (savedTheme) setUserTheme(savedTheme);

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

  // 处理保存用户名
  const handleSaveUserName = async () => {
    if (await storeData(STORAGE_KEYS.USER_NAME, userName)) {
      Alert.alert('保存成功', '用户名已保存');
      // 刷新所有数据
      const items = await getAllData();
      setAllItems(items);
    }
  };

  // 处理切换主题
  const handleToggleTheme = async () => {
    const newTheme = userTheme === 'light' ? 'dark' : 'light';
    if (await storeData(STORAGE_KEYS.USER_THEME, newTheme)) {
      setUserTheme(newTheme);
      // 刷新所有数据
      const items = await getAllData();
      setAllItems(items);
    }
  };

  // 处理自定义键值对保存
  const handleSaveCustomItem = async () => {
    if (!inputKey.trim()) {
      Alert.alert('错误', '请输入键名');
      return;
    }

    if (await storeData(inputKey, inputValue)) {
      Alert.alert('保存成功', `已保存键 "${inputKey}" 的值`);
      setInputKey('');
      setInputValue('');
      // 刷新所有数据
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
            // 更新状态数据
            if (key === STORAGE_KEYS.USER_NAME) setUserName('');
            if (key === STORAGE_KEYS.USER_THEME) setUserTheme('light');

            // 刷新所有数据
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
            setUserName('');
            setUserTheme('light');
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* 头部导航 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AsyncStorage 示例</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* 用户名示例 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 保存用户名</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} value={userName} onChangeText={setUserName} placeholder="输入用户名" />
            <TouchableOpacity style={styles.button} onPress={handleSaveUserName}>
              <Text style={styles.buttonText}>保存</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.valueText}>保存的用户名: {userName || '(无)'}</Text>
        </View>

        {/* 主题切换示例 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. 主题切换</Text>
          <View style={[styles.themeContainer, { backgroundColor: userTheme === 'light' ? '#f5f5f5' : '#333' }]}>
            <Text style={[styles.themeText, { color: userTheme === 'light' ? '#333' : '#fff' }]}>
              当前主题: {userTheme}
            </Text>
          </View>
          <TouchableOpacity style={[styles.button, styles.themeButton]} onPress={handleToggleTheme}>
            <Text style={styles.buttonText}>切换主题</Text>
          </TouchableOpacity>
        </View>

        {/* 访问时间示例 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. 最后访问时间</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>上次访问: {lastVisit}</Text>
          </View>
        </View>

        {/* 自定义键值对 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. 添加自定义键值对</Text>
          <View style={styles.customInputContainer}>
            <TextInput
              style={[styles.input, styles.keyInput]}
              value={inputKey}
              onChangeText={setInputKey}
              placeholder="键名"
            />
            <TextInput
              style={[styles.input, styles.valueInput]}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="值"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSaveCustomItem}>
            <Text style={styles.buttonText}>保存键值对</Text>
          </TouchableOpacity>
        </View>

        {/* 所有存储数据 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>5. 所有存储的数据</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={async () => {
                const items = await getAllData();
                setAllItems(items);
              }}
            >
              <Text style={styles.refreshButtonText}>刷新</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.storageList}>
            {allItems.length > 0 ? (
              allItems.map(([key, value], index) => (
                <View key={index} style={styles.storageItem}>
                  <View style={styles.storageItemContent}>
                    <Text style={styles.storageItemKey}>{key}</Text>
                    <Text style={styles.storageItemValue} numberOfLines={2}>
                      {value || '(空)'}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveItem(key)}>
                    <Text style={styles.deleteButtonText}>删除</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>没有存储的数据</Text>
            )}
          </View>

          {allItems.length > 0 && (
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClearAll}>
              <Text style={styles.buttonText}>清除所有数据</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 使用说明 */}
        <View style={styles.codeContainer}>
          <Text style={styles.sectionTitle}>代码示例</Text>
          <Text style={styles.codeText}>
            {`// 1. 引入 AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// 2. 存储字符串值
await AsyncStorage.setItem('user_name', 'Test User');

// 3. 读取字符串值
const value = await AsyncStorage.getItem('user_name');

// 4. 存储对象 (需要先转为 JSON 字符串)
const user = { id: 1, name: 'Test User' };
await AsyncStorage.setItem('user_data', JSON.stringify(user));

// 5. 读取对象 (需要解析 JSON 字符串)
const userData = await AsyncStorage.getItem('user_data');
const parsedUser = userData ? JSON.parse(userData) : null;

// 6. 删除特定键
await AsyncStorage.removeItem('user_name');

// 7. 获取所有键
const keys = await AsyncStorage.getAllKeys();

// 8. 批量获取多个键的值
const values = await AsyncStorage.multiGet(['key1', 'key2']);

// 9. 批量存储多个键值对
await AsyncStorage.multiSet([['key1', 'value1'], ['key2', 'value2']]);

// 10. 清除所有存储
await AsyncStorage.clear();`}
          </Text>
        </View>

        {/* 项目使用指南 */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>项目使用指南</Text>
          <Text style={styles.infoText}>
            1. 安装依赖：
            {`\npnpm add @react-native-async-storage/async-storage`}
          </Text>
          <Text style={styles.infoText}>
            2. 最佳实践：
            {`\n• 使用常量定义键名\n• 封装存取函数\n• 异常处理\n• 避免存储大量数据\n• 敏感数据考虑加密`}
          </Text>
          <Text style={styles.infoText}>
            3. 优缺点：
            {`\n• 优点：简单易用，跨平台一致性好\n• 缺点：只适合小数据量，异步操作`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    padding: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  refreshButtonText: {
    fontSize: 12,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginRight: 8,
  },
  customInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  keyInput: {
    flex: 1,
    marginRight: 8,
  },
  valueInput: {
    flex: 2,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButton: {
    marginTop: 12,
    backgroundColor: '#673AB7',
  },
  clearButton: {
    backgroundColor: '#F44336',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  valueText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  themeContainer: {
    padding: 16,
    borderRadius: 4,
    marginBottom: 12,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#e1f5fe',
    padding: 12,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  storageList: {
    marginTop: 8,
  },
  storageItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
    alignItems: 'center',
  },
  storageItemContent: {
    flex: 1,
  },
  storageItemKey: {
    fontWeight: '600',
    marginBottom: 4,
  },
  storageItemValue: {
    color: '#666',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 16,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    padding: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    fontSize: 12,
  },
  codeContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  infoContainer: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
});
