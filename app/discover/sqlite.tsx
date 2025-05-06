// import { Ionicons } from '@expo/vector-icons';
// import * as SQLite from 'expo-sqlite';
// import { useEffect, useState } from 'react';
// import { FlatList, View } from 'react-native';

// import { Button } from '~/components/ui/button';
// import { Text } from '~/components/ui/text';

// interface Todo {
//   id: number;
//   text: string;
//   completed: boolean;
// }

// export default function ExpoSQLiteScreen() {
//   const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     initDatabase();
//   }, []);

//   const initDatabase = async () => {
//     try {
//       // 打开数据库连接
//       const database = await SQLite.openDatabaseAsync('todos.db');
//       setDb(database);

//       // 检查表是否已存在
//       const tableExists = await checkTableExists(database, 'todos');
//       if (!tableExists) {
//         // 表不存在，创建新表
//         await database.execAsync(`
//           PRAGMA journal_mode = WAL;
//           CREATE TABLE IF NOT EXISTS todos (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             text TEXT NOT NULL,
//             completed INTEGER DEFAULT 0
//           );
//         `);
//         console.log('创建todos表成功');
//       } else {
//         // 表已存在，只设置journal_mode
//         await database.execAsync('PRAGMA journal_mode = WAL;');
//         console.log('todos表已存在，跳过创建步骤');
//       }

//       // 确保数据库已初始化后再加载数据
//       await loadTodos(database);
//     } catch (error) {
//       setError('initDatabase error, ' + (error as Error).message);
//     }
//   };

//   // 检查表是否存在
//   const checkTableExists = async (database: SQLite.SQLiteDatabase, tableName: string): Promise<boolean> => {
//     try {
//       const result = await database.getFirstAsync<{ count: number }>(
//         `SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name=?`,
//         tableName
//       );
//       if (result && typeof result.count === 'number') {
//         return result.count > 0;
//       }
//       return false;
//     } catch (error) {
//       setError('检查表是否存在时出错: ' + (error as Error).message);
//       return false;
//     }
//   };

//   const loadTodos = async (database?: SQLite.SQLiteDatabase) => {
//     const dbToUse = database || db;
//     if (!dbToUse) {
//       setError('loadTodos error, 数据库未初始化');
//       return;
//     }

//     try {
//       const result = await dbToUse.getAllAsync<Todo>('SELECT * FROM todos ORDER BY id DESC');
//       setTodos(result);
//     } catch (error) {
//       setError('loadTodos error, ' + (error as Error).message);
//     }
//   };

//   const addTodo = async () => {
//     try {
//       const dbToUse = db;
//       if (!dbToUse) {
//         setError('addTodo error, 数据库未初始化');
//         return;
//       }
//       await dbToUse.runAsync('INSERT INTO todos (text, completed) VALUES (?, ?)', '数据库用户表脏数据清理', 0);
//       loadTodos();
//     } catch (error) {
//       setError('addTodo error, ' + (error as Error).message);
//     }
//   };

//   const toggleTodo = async (id: number) => {
//     const dbToUse = db;
//     if (!dbToUse) {
//       setError('toggleTodo error, 数据库未初始化');
//       return;
//     }

//     try {
//       await dbToUse.runAsync('UPDATE todos SET completed = 1 - completed WHERE id = ?', id);
//       loadTodos();
//     } catch (error) {
//       setError('toggleTodo error, ' + (error as Error).message);
//     }
//   };

//   const deleteTodo = async (id: number) => {
//     const dbToUse = db;
//     if (!dbToUse) {
//       setError('deleteTodo error, 数据库未初始化');
//       return;
//     }

//     try {
//       await dbToUse.runAsync('DELETE FROM todos WHERE id = ?', id);
//       loadTodos();
//     } catch (error) {
//       setError('deleteTodo error, ' + (error as Error).message);
//     }
//   };

//   const renderTodo = ({ item, index }: { item: Todo; index: number }) => (
//     <View className="flex-row items-center justify-between bg-white rounded-lg mb-2 gap-2">
//       <Button className="flex-row items-center flex-1 gap-2" onPress={() => toggleTodo(item.id)} variant="outline">
//         <Ionicons
//           name={item.completed ? 'checkbox' : 'square-outline'}
//           size={20}
//           color={item.completed ? '#10B981' : '#6B7280'}
//         />
//         <Text className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
//           {index + 1}. {item.text}
//         </Text>
//       </Button>
//       <Button onPress={() => deleteTodo(item.id)} variant="outline">
//         <Ionicons name="trash" size={18} color="red" />
//       </Button>
//     </View>
//   );

//   return (
//     <View className="flex-1 px-6 pt-6">
//       <View className="mb-6">
//         <Text className="text-2xl font-bold mb-2">SQLite 数据库</Text>
//         <Text className="text-muted-foreground">在应用中使用 SQLite 进行结构化数据存储。</Text>
//       </View>

//       {/* 添加新任务 */}
//       <View>
//         <Text className="font-medium mb-2">添加任务</Text>
//         <Button onPress={addTodo} className="mb-6">
//           <Text>添加</Text>
//         </Button>
//       </View>

//       {/* 错误提示 */}
//       {error ? (
//         <View className="bg-destructive/10 rounded-lg p-4 mb-6">
//           <Text className="text-destructive">{error}</Text>
//         </View>
//       ) : null}

//       {/* 任务列表 */}
//       <View className="flex-1">
//         <Text className="font-medium mb-2">任务列表</Text>
//         <FlatList
//           data={todos}
//           renderItem={renderTodo}
//           keyExtractor={(item) => item.id.toString()}
//           scrollEnabled={true}
//           contentContainerStyle={{ paddingBottom: 0 }}
//         />
//       </View>
//     </View>
//   );
// }
