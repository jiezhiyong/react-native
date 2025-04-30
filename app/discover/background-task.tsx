import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

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

    // 返回成功状态 - 在新版API中直接返回 undefined 即可表示成功
    return undefined;
  } catch (error) {
    console.error('[后台任务] 执行失败:', error);
    return {
      error: new Error(error instanceof Error ? error.message : String(error)),
    };
  }
});

// 模拟网络请求的函数
async function simulateNetworkRequest() {
  return new Promise((resolve) => {
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

    <View className="mb-6">
      <Text className="text-2xl font-bold mb-2">后台任务</Text>
      <Text className="text-muted-foreground">在应用进入后台时执行特定任务和操作。</Text>
    </View>;
  }, []);

  // 处理注册任务
  const handleRegisterTask = async () => {
    if (await registerBackgroundTask()) {
      const status = await getTaskStatus();
      setTaskStatus(status);
      Alert.alert('注册成功', `后台任务 ${BACKGROUND_TASK_NAME} 已成功注册`);
    }
  };

  // 处理取消注册任务
  const handleUnregisterTask = async () => {
    if (await unregisterBackgroundTask()) {
      const status = await getTaskStatus();
      setTaskStatus(status);
      Alert.alert('取消注册成功', `后台任务 ${BACKGROUND_TASK_NAME} 已取消注册`);
    }
  };

  return (
    <View className="flex-1 p-5">
      {/* 状态信息 */}
      <View className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 gap-3">
        <Text className="text-lg font-bold">当前状态</Text>
        <View className="flex-row gap-3">
          <Text className="font-medium w-[90px]">任务名称:</Text>
          <Text className="flex-1">{taskStatus.taskName}</Text>
        </View>
        <View className="flex-row gap-3">
          <Text className="font-medium w-[90px]">是否已注册:</Text>
          <Text className="flex-1">{taskStatus.isRegistered ? '已注册' : '未注册'}</Text>
        </View>
        <View className="flex-row gap-3">
          <Text className="font-medium w-[90px]">最后检查时间:</Text>
          <Text className="flex-1">{lastUpdateTime.toLocaleString()}</Text>
        </View>
      </View>

      {/* 操作按钮 */}
      <View className="flex-col gap-4">
        {taskStatus.isRegistered ? (
          <Button variant="destructive" onPress={handleUnregisterTask}>
            <Text>取消注册任务</Text>
          </Button>
        ) : (
          <Button onPress={handleRegisterTask}>
            <Text>注册后台任务</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
