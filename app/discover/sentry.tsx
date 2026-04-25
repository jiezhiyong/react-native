import * as Sentry from '@sentry/react-native';
import { AlertCircle, Bug, Info, Target, Timer, User, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

interface ErrorInfo {
  message?: string;
}

/**
 * Sentry 错误监控与性能分析演示
 * 展示 Sentry SDK 的各种功能
 */
function SentryScreen() {
  const [message, setMessage] = useState('');
  const [tagKey, setTagKey] = useState('feature');
  const [tagValue, setTagValue] = useState('demo');
  const [userId, setUserId] = useState('demo-user-123');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [breadcrumbMessage, setBreadcrumbMessage] = useState('User clicked button');
  const [operationResult, setOperationResult] = useState<string>('');

  // 组件加载时添加初始 breadcrumb
  useEffect(() => {
    Sentry.addBreadcrumb({
      message: 'Sentry Demo Screen loaded',
      category: 'navigation',
      level: 'info',
      data: {
        screen: 'sentry.tsx',
        timestamp: new Date().toISOString(),
      },
    });
  }, []);

  // 1. 手动触发错误
  const triggerError = () => {
    try {
      throw new Error('这是一个演示错误 - 由用户手动触发');
    } catch {
      setOperationResult('✅ 错误已触发并发送到 Sentry');
      // 错误会被 Sentry 自动捕获
    }
  };

  // 2. 手动捕获异常
  const captureException = () => {
    try {
      // 模拟一个异常情况
      const error = new Error('手动捕获的异常示例');
      error.stack = `Error: 手动捕获的异常示例
    at captureException (sentry.tsx:45:19)
    at onPress (sentry.tsx:89:21)`;

      Sentry.captureException(error, {
        tags: {
          section: 'demo',
          action: 'manual_capture',
        },
        extra: {
          userAction: 'clicked capture exception button',
          timestamp: new Date().toISOString(),
        },
      });

      setOperationResult('✅ 异常已手动捕获并发送到 Sentry');
    } catch {
      setOperationResult('❌ 捕获异常失败');
    }
  };

  // 3. 发送自定义消息
  const captureMessage = () => {
    if (!message.trim()) {
      Alert.alert('提示', '请输入要发送的消息');
      return;
    }

    Sentry.captureMessage(message, 'info');
    setOperationResult(`✅ 消息 "${message}" 已发送到 Sentry`);
    setMessage('');
  };

  // 4. 添加 Breadcrumb
  const addBreadcrumb = () => {
    if (!breadcrumbMessage.trim()) {
      Alert.alert('提示', '请输入 Breadcrumb 消息');
      return;
    }

    Sentry.addBreadcrumb({
      message: breadcrumbMessage,
      category: 'user_action',
      level: 'info',
      data: {
        source: 'demo_screen',
        timestamp: new Date().toISOString(),
      },
    });

    setOperationResult(`✅ Breadcrumb "${breadcrumbMessage}" 已添加`);
    setBreadcrumbMessage('');
  };

  // 5. 设置用户上下文
  const setUserContext = () => {
    if (!userId.trim() || !userEmail.trim()) {
      Alert.alert('提示', '请填写用户 ID 和邮箱');
      return;
    }

    Sentry.setUser({
      id: userId,
      email: userEmail,
      username: userId,
      extra: {
        loginTime: new Date().toISOString(),
        demo: true,
      },
    });

    setOperationResult(`✅ 用户信息已设置: ${userId} (${userEmail})`);
  };

  // 6. 设置标签
  const setTag = () => {
    if (!tagKey.trim() || !tagValue.trim()) {
      Alert.alert('提示', '请填写标签键和值');
      return;
    }

    Sentry.setTag(tagKey, tagValue);
    setOperationResult(`✅ 标签已设置: ${tagKey} = ${tagValue}`);
  };

  // 7. 性能追踪示例 - 使用新的 startSpan API
  const performanceTracking = async () => {
    try {
      setOperationResult('⏳ 开始性能追踪...');

      // 使用新的 startSpan API
      await Sentry.startSpan(
        {
          name: 'Demo Performance Test',
          op: 'demo_operation',
        },
        async (span) => {
          // 模拟一些异步操作
          await Sentry.startSpan(
            {
              name: '模拟 API 请求',
              op: 'http',
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          );

          await Sentry.startSpan(
            {
              name: '模拟数据库查询',
              op: 'db',
            },
            async () => {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          );

          span?.setStatus({ code: 2 }); // 2 = OK status
          setOperationResult('✅ 性能追踪完成 (耗时: ~1.5秒)');
        }
      );
    } catch {
      setOperationResult('❌ 性能追踪失败');
    }
  };

  // 8. 清除用户上下文
  const clearUserContext = () => {
    Sentry.setUser(null);
    setOperationResult('✅ 用户上下文已清除');
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Sentry 错误监控演示</Text>
        <Text className="text-muted-foreground">展示 Sentry SDK 的错误捕获、性能监控和上下文管理功能</Text>
      </View>

      {/* 操作结果显示 */}
      {operationResult ? (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm flex-row items-center">
              <Info size={16} className="mr-2" />
              操作结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-sm">{operationResult}</Text>
          </CardContent>
        </Card>
      ) : null}

      {/* 1. 错误触发 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <Bug size={20} className="mr-2" />
            错误触发
          </CardTitle>
          <CardDescription>手动触发错误，测试 Sentry 自动捕获</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onPress={triggerError} variant="destructive" className="w-full">
            <Text>触发错误</Text>
          </Button>
        </CardContent>
      </Card>

      {/* 2. 异常捕获 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <AlertCircle size={20} className="mr-2" />
            异常捕获
          </CardTitle>
          <CardDescription>使用 Sentry.captureException() 手动捕获异常</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onPress={captureException} variant="outline" className="w-full">
            <Text>捕获异常</Text>
          </Button>
        </CardContent>
      </Card>

      {/* 3. 自定义消息 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <Info size={20} className="mr-2" />
            自定义消息
          </CardTitle>
          <CardDescription>使用 Sentry.captureMessage() 发送自定义信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Label>消息内容</Label>
            <Input value={message} onChangeText={setMessage} placeholder="输入要发送的消息..." />
          </View>
          <Button onPress={captureMessage} className="w-full">
            <Text>发送消息</Text>
          </Button>
        </CardContent>
      </Card>

      {/* 4. Breadcrumb 追踪 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <Target size={20} className="mr-2" />
            Breadcrumb 追踪
          </CardTitle>
          <CardDescription>添加用户操作路径记录</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Label>Breadcrumb 消息</Label>
            <Input value={breadcrumbMessage} onChangeText={setBreadcrumbMessage} placeholder="描述用户操作..." />
          </View>
          <Button onPress={addBreadcrumb} variant="secondary" className="w-full">
            <Text>添加 Breadcrumb</Text>
          </Button>
        </CardContent>
      </Card>

      {/* 5. 用户上下文 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <User size={20} className="mr-2" />
            用户上下文
          </CardTitle>
          <CardDescription>设置当前用户信息，便于问题追踪</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Label>用户 ID</Label>
            <Input value={userId} onChangeText={setUserId} placeholder="用户 ID..." />
          </View>
          <View>
            <Label>用户邮箱</Label>
            <Input value={userEmail} onChangeText={setUserEmail} placeholder="用户邮箱..." />
          </View>
          <View className="flex-row space-x-2">
            <Button onPress={setUserContext} className="flex-1">
              <Text>设置用户</Text>
            </Button>
            <Button onPress={clearUserContext} variant="outline" className="flex-1">
              <Text>清除用户</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* 6. 标签设置 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <Target size={20} className="mr-2" />
            标签设置
          </CardTitle>
          <CardDescription>为错误事件添加自定义标签，便于分类和过滤</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <View>
            <Label>标签键</Label>
            <Input value={tagKey} onChangeText={setTagKey} placeholder="标签键..." />
          </View>
          <View>
            <Label>标签值</Label>
            <Input value={tagValue} onChangeText={setTagValue} placeholder="标签值..." />
          </View>
          <Button onPress={setTag} variant="secondary" className="w-full">
            <Text>设置标签</Text>
          </Button>
        </CardContent>
      </Card>

      {/* 7. 性能追踪 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <Timer size={20} className="mr-2" />
            性能追踪
          </CardTitle>
          <CardDescription>使用 startSpan 追踪应用性能</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onPress={performanceTracking} variant="default" className="w-full">
            <Text>开始性能追踪</Text>
          </Button>
        </CardContent>
      </Card>

      {/* ErrorBoundary 演示说明 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <Zap size={20} className="mr-2" />
            ErrorBoundary
          </CardTitle>
          <CardDescription>
            Sentry ErrorBoundary 已在应用根级别配置 (app/_layout.tsx)，会自动捕获 React 组件错误
          </CardDescription>
        </CardHeader>
        <CardContent>
          <View className="p-3 bg-muted rounded-lg">
            <Text className="text-sm text-muted-foreground">export default Sentry.wrap(RootLayout);</Text>
          </View>
        </CardContent>
      </Card>

      {/* 配置信息 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>当前配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <View className="flex-row">
            <Text className="font-medium w-16">DSN:</Text>
            <Text className="flex-1 text-xs text-muted-foreground">
              {process.env.EXPO_PUBLIC_SENTRY_DSN ? '已配置 ✅' : '未配置 ❌'}
            </Text>
          </View>
          <View className="flex-row">
            <Text className="font-medium w-16">Debug:</Text>
            <Text className="flex-1 text-xs text-muted-foreground">
              {process.env.NODE_ENV === 'development' ? '开启 🔍' : '关闭 🔇'}
            </Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}

// 使用 Sentry ErrorBoundary 包装组件
const WrappedSentryScreen = Sentry.withErrorBoundary(SentryScreen, {
  fallback: ({ error, resetError }) => (
    <View className="flex-1 justify-center items-center p-5">
      <AlertCircle size={48} color="#ef4444" />
      <Text className="text-xl font-bold mt-4 mb-2">组件错误</Text>
      <Text className="text-center text-muted-foreground mb-4">
        这个错误已被 Sentry ErrorBoundary 捕获并发送到 Sentry
      </Text>
      <Text className="text-xs text-muted-foreground mb-4 text-center">错误信息: {(error as ErrorInfo)?.message}</Text>
      <Button onPress={resetError}>
        <Text>重新加载</Text>
      </Button>
    </View>
  ),
  beforeCapture: (scope, error, errorInfo) => {
    scope.setTag('errorBoundary', 'demo');
    scope.setContext('errorInfo', { errorInfo });
  },
});

export default WrappedSentryScreen;
