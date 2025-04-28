import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function ExpoSQLiteScreen() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('todos.db');
      setDb(database);

      // 创建表
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed INTEGER DEFAULT 0
        );
      `);

      loadTodos();
    } catch (error) {
      setError('数据库初始化失败: ' + (error as Error).message);
    }
  };

  const loadTodos = async () => {
    if (!db) return;

    try {
      const result = await db.getAllAsync<Todo>('SELECT * FROM todos ORDER BY id DESC');
      setTodos(result);
    } catch (error) {
      setError('加载数据失败: ' + (error as Error).message);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim() || !db) return;

    try {
      const result = await db.runAsync('INSERT INTO todos (text, completed) VALUES (?, ?)', newTodo, 0);
      setNewTodo('');
      loadTodos();
    } catch (error) {
      setError('添加失败: ' + (error as Error).message);
    }
  };

  const toggleTodo = async (id: number) => {
    if (!db) return;

    try {
      await db.runAsync('UPDATE todos SET completed = 1 - completed WHERE id = ?', id);
      loadTodos();
    } catch (error) {
      setError('更新失败: ' + (error as Error).message);
    }
  };

  const deleteTodo = async (id: number) => {
    if (!db) return;

    try {
      await db.runAsync('DELETE FROM todos WHERE id = ?', id);
      loadTodos();
    } catch (error) {
      setError('删除失败: ' + (error as Error).message);
    }
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <View className="flex-row items-center justify-between bg-white p-4 rounded-lg mb-2">
      <TouchableOpacity className="flex-row items-center flex-1" onPress={() => toggleTodo(item.id)}>
        <Ionicons
          name={item.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.completed ? '#10B981' : '#6B7280'}
        />
        <Text className={`ml-2 flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {item.text}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTodo(item.id)} className="ml-2">
        <Ionicons name="trash" size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">SQLite 数据库</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何使用 Expo 的 SQLite 数据库功能。</Text>
      </View>

      {/* 添加新任务 */}
      <View className="mb-8">
        <View className="flex-row">
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3 mr-2"
            placeholder="输入新任务"
            value={newTodo}
            onChangeText={setNewTodo}
          />
          <TouchableOpacity className="bg-blue-500 rounded-lg p-3" onPress={addTodo}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 任务列表 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">任务列表</Text>
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* 错误提示 */}
      {error ? (
        <View className="bg-red-100 rounded-lg p-4 mb-8">
          <Text className="text-red-500">{error}</Text>
        </View>
      ) : null}

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 支持创建 SQLite 数据库
          {'\n'}2. 支持增删改查操作
          {'\n'}3. 支持事务处理
          {'\n'}4. 数据持久化存储
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 expo-sqlite
          {'\n'}2. 数据库文件存储在应用目录
          {'\n'}3. 支持事务和错误处理
          {'\n'}4. 支持异步操作
        </Text>
      </View>
    </ScrollView>
  );
}
