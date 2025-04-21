import * as BackgroundTask from 'expo-background-task';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as TaskManager from 'expo-task-manager';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 定义任务名称常量
const BACKGROUND_TASK_NAME = 'BACKGROUND_SYNC_TASK';

// 定义后台任务 - 必须在模块作用域定义
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log('[后台任务] 开始执行...');

    // 模拟网络请求或数据同步
    await simulateNetworkRequest();

    // 记录执行时间
    const now = new Date();
    console.log(`[后台任务] 在 ${now.toLocaleString()} 成功执行`);

    // 返回成功状态 - 在新版API中直接返回undefined即可表示成功
    return undefined;
  } catch (error) {
    console.error('[后台任务] 执行失败:', error);
    // 在错误情况下，返回错误对象
    return {
      error: new Error(error instanceof Error ? error.message : String(error)),
    };
  }
});

// 模拟网络请求的函数
async function simulateNetworkRequest() {
  return new Promise((resolve) => {
    // 模拟2秒的网络请求
    setTimeout(() => {
      console.log('[后台任务] 数据同步完成');
      resolve(true);
    }, 2000);
  });
}

// 注册后台任务
async function registerBackgroundTask() {
  try {
    // 检查是否已注册
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

    if (isRegistered) {
      console.log(`[后台任务] ${BACKGROUND_TASK_NAME} 已经注册`);
      return true;
    }

    // 注册任务，设置执行频率和条件
    await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 60 * 15, // 最小间隔15分钟（单位：秒）
    });

    console.log(`[后台任务] ${BACKGROUND_TASK_NAME} 注册成功`);
    return true;
  } catch (error) {
    console.error('[后台任务] 注册失败:', error);
    Alert.alert('注册失败', `无法注册后台任务: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// 取消注册后台任务
async function unregisterBackgroundTask() {
  try {
    // 检查是否已注册
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

    if (!isRegistered) {
      console.log(`[后台任务] ${BACKGROUND_TASK_NAME} 未注册`);
      return true;
    }

    // 取消注册任务
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_NAME);
    console.log(`[后台任务] ${BACKGROUND_TASK_NAME} 已取消注册`);
    return true;
  } catch (error) {
    console.error('[后台任务] 取消注册失败:', error);
    Alert.alert('取消注册失败', `无法取消注册后台任务: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

// 获取任务状态信息
async function getTaskStatus() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
  return {
    isRegistered,
    taskName: BACKGROUND_TASK_NAME,
  };
}

export default function ExpoBackgroundTaskScreen() {
  const router = useRouter();
  const [taskStatus, setTaskStatus] = useState({ isRegistered: false, taskName: BACKGROUND_TASK_NAME });
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // 页面加载时获取任务状态
  useEffect(() => {
    const checkStatus = async () => {
      const status = await getTaskStatus();
      setTaskStatus(status);
    };

    checkStatus();

    // 每5秒更新一次状态
    const intervalId = setInterval(() => {
      checkStatus();
      setLastUpdateTime(new Date());
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // 处理注册任务
  const handleRegisterTask = async () => {
    if (await registerBackgroundTask()) {
      // 更新状态
      const status = await getTaskStatus();
      setTaskStatus(status);
      Alert.alert('注册成功', `后台任务 ${BACKGROUND_TASK_NAME} 已成功注册`);
    }
  };

  // 处理取消注册任务
  const handleUnregisterTask = async () => {
    if (await unregisterBackgroundTask()) {
      // 更新状态
      const status = await getTaskStatus();
      setTaskStatus(status);
      Alert.alert('取消注册成功', `后台任务 ${BACKGROUND_TASK_NAME} 已取消注册`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* 标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>expo-background-task 示例</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* 状态信息 */}
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>任务状态</Text>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>任务名称:</Text>
            <Text style={styles.statusValue}>{taskStatus.taskName}</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>注册状态:</Text>
            <Text style={[styles.statusValue, { color: taskStatus.isRegistered ? '#4CAF50' : '#F44336' }]}>
              {taskStatus.isRegistered ? '已注册' : '未注册'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>最后更新时间:</Text>
            <Text style={styles.statusValue}>{lastUpdateTime.toLocaleTimeString()}</Text>
          </View>
        </View>

        {/* 任务说明 */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>后台任务说明</Text>
          <Text style={styles.infoText}>• 此示例演示了如何使用 expo-background-task 在后台执行定期任务</Text>
          <Text style={styles.infoText}>• 后台任务会在应用不活跃时按设定的间隔执行</Text>
          <Text style={styles.infoText}>• 任务执行情况可在控制台日志中查看</Text>
          <Text style={styles.infoText}>• 实际应用中，任务通常用于数据同步、通知更新等</Text>
        </View>

        {/* 操作按钮 */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={handleRegisterTask}
            disabled={taskStatus.isRegistered}
          >
            <Text style={styles.buttonText}>注册后台任务</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.unregisterButton]}
            onPress={handleUnregisterTask}
            disabled={!taskStatus.isRegistered}
          >
            <Text style={styles.buttonText}>取消注册后台任务</Text>
          </TouchableOpacity>
        </View>

        {/* 使用说明 */}
        <View style={styles.codeContainer}>
          <Text style={styles.sectionTitle}>代码示例</Text>
          <Text style={styles.codeText}>
            {`// 1. 引入必要模块
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

// 2. 定义任务名称
const TASK_NAME = 'BACKGROUND_SYNC_TASK';

// 3. 定义任务处理函数（模块作用域）
TaskManager.defineTask(TASK_NAME, async () => {
  try {
    // 执行后台逻辑
    return undefined; // 成功
  } catch (error) {
    // 失败时返回错误对象
    return { error: new Error('任务执行失败') };
  }
});

// 4. 注册任务
await BackgroundTask.registerTaskAsync(TASK_NAME, {
  minimumInterval: 60 * 15, // 15分钟
});

// 5. 检查任务状态
const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);

// 6. 取消注册任务
await BackgroundTask.unregisterTaskAsync(TASK_NAME);`}
          </Text>
        </View>

        {/* 配置说明 */}
        <View style={styles.configContainer}>
          <Text style={styles.sectionTitle}>app.config.ts 配置</Text>
          <Text style={styles.codeText}>
            {`export default {
  // ...其他配置
  plugins: [
    // ...其他插件
    'expo-background-task',
  ],
  ios: {
    infoPlist: {
      UIBackgroundModes: ['fetch', 'processing'],
    },
  },
  android: {
    permissions: [
      'RECEIVE_BOOT_COMPLETED',
      'WAKE_LOCK',
    ],
  },
};`}
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
  statusContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statusLabel: {
    fontWeight: '600',
    width: 120,
  },
  statusValue: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
  },
  unregisterButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  codeContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  configContainer: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
});
