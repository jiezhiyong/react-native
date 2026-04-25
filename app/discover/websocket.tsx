import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { InfoItemRow } from '@/components/InfoItem';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

interface Message {
  id: string;
  timestamp: Date;
  type: 'sent' | 'received' | 'system';
  content: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export default function WebSocketScreen() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);
  const [autoReconnect, setAutoReconnect] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // WebSocket 服务器地址 (使用公共的 echo 服务)
  const WS_URL = 'wss://echo.websocket.events';
  // 备用地址：'wss://ws.postman-echo.com/raw'

  useEffect(() => {
    return () => {
      // 组件卸载时清理连接
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // 添加系统消息
  const addSystemMessage = (content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'system',
      content,
    };
    setMessages((prev) => [message, ...prev]);
  };

  // 添加消息
  const addMessage = (type: 'sent' | 'received', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      content,
    };
    setMessages((prev) => [message, ...prev]);
  };

  // 连接 WebSocket
  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionStatus('connecting');
    addSystemMessage('正在连接到 WebSocket 服务器...');

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        addSystemMessage('WebSocket 连接已建立');
      };

      ws.onmessage = (event) => {
        addMessage('received', event.data);
      };

      ws.onclose = (event) => {
        setConnectionStatus('disconnected');
        addSystemMessage(`连接已断开 (代码: ${event.code}, 原因: ${event.reason || '未知'})`);

        // 自动重连逻辑
        if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 10000); // 指数退避
          addSystemMessage(`${delay / 1000} 秒后尝试重连... (第 ${reconnectAttempts + 1}/${maxReconnectAttempts} 次)`);

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connectWebSocket();
          }, delay);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          addSystemMessage('已达到最大重连次数，请手动重连');
        }
      };

      ws.onerror = (error) => {
        setConnectionStatus('error');
        addSystemMessage('WebSocket 连接发生错误');
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      setConnectionStatus('error');
      addSystemMessage('创建 WebSocket 连接失败');
      console.error('WebSocket connection error:', error);
    }
  };

  // 断开连接
  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, '用户主动断开连接');
      wsRef.current = null;
    }

    setConnectionStatus('disconnected');
    setReconnectAttempts(0);
    addSystemMessage('用户主动断开连接');
  };

  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.trim()) {
      Alert.alert('提示', '请输入消息内容');
      return;
    }

    if (connectionStatus !== 'connected' || !wsRef.current) {
      Alert.alert('错误', 'WebSocket 未连接');
      return;
    }

    try {
      wsRef.current.send(inputMessage);
      addMessage('sent', inputMessage);
      setInputMessage('');
    } catch (error) {
      Alert.alert('发送失败', '消息发送失败，请检查连接状态');
      console.error('Send message error:', error);
    }
  };

  // 清空消息记录
  const clearMessages = () => {
    setMessages([]);
  };

  // 获取连接状态文本
  const getStatusText = (status: ConnectionStatus) => {
    const statusMap: Record<ConnectionStatus, string> = {
      disconnected: '已断开',
      connecting: '连接中',
      connected: '已连接',
      error: '错误',
    };
    return statusMap[status];
  };

  // 获取连接状态颜色
  const getStatusColor = (status: ConnectionStatus) => {
    const colorMap: Record<ConnectionStatus, string> = {
      disconnected: 'text-muted-foreground',
      connecting: 'text-yellow-600',
      connected: 'text-green-600',
      error: 'text-red-600',
    };
    return colorMap[status];
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 获取消息样式
  const getMessageStyle = (type: Message['type']) => {
    switch (type) {
      case 'sent':
        return 'bg-primary/10 border-primary/20 self-end';
      case 'received':
        return 'bg-green-100 border-green-200 self-start';
      case 'system':
        return 'bg-muted border-border self-center';
      default:
        return 'bg-muted border-border';
    }
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">WebSocket 实时通信</Text>
        <Text className="text-muted-foreground">演示 WebSocket 连接、消息发送接收、断线重连等功能</Text>
      </View>

      {/* 连接状态 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">连接状态</Text>
        <InfoItemRow label="服务器地址" value={WS_URL} />
        <InfoItemRow label="连接状态" value={getStatusText(connectionStatus)} />
        <InfoItemRow label="重连次数" value={`${reconnectAttempts}/${maxReconnectAttempts}`} />
        <InfoItemRow label="自动重连" value={autoReconnect ? '开启' : '关闭'} />
      </Card>

      {/* 连接控制 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">连接控制</Text>
        <View className="flex-row gap-3 mb-3">
          <Button
            className="flex-1"
            onPress={connectWebSocket}
            disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
          >
            <Text>{connectionStatus === 'connecting' ? '连接中...' : '连接'}</Text>
          </Button>
          <Button
            className="flex-1"
            variant="destructive"
            onPress={disconnectWebSocket}
            disabled={connectionStatus === 'disconnected'}
          >
            <Text>断开</Text>
          </Button>
        </View>
        <Button
          variant="outline"
          onPress={() => {
            setAutoReconnect(!autoReconnect);
            addSystemMessage(`自动重连已${!autoReconnect ? '开启' : '关闭'}`);
          }}
        >
          <Text>{autoReconnect ? '关闭' : '开启'}自动重连</Text>
        </Button>
      </Card>

      {/* 消息发送 */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-medium mb-3">发送消息</Text>
        <View className="flex-row gap-3 mb-2">
          <Input
            className="flex-1"
            placeholder="输入消息内容..."
            value={inputMessage}
            onChangeText={setInputMessage}
            onSubmitEditing={sendMessage}
            editable={connectionStatus === 'connected'}
          />
          <Button onPress={sendMessage} disabled={connectionStatus !== 'connected' || !inputMessage.trim()}>
            <Text>发送</Text>
          </Button>
        </View>
        <Text className="text-sm text-muted-foreground">提示：此服务器会回显您发送的消息</Text>
      </Card>

      {/* 消息记录 */}
      <Card className="p-4 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-medium">消息记录 ({messages.length})</Text>
          <Button variant="outline" size="sm" onPress={clearMessages} disabled={messages.length === 0}>
            <Text>清空</Text>
          </Button>
        </View>

        {messages.length > 0 ? (
          <View className="space-y-2 max-h-80">
            {messages.slice(0, 20).map((message) => (
              <View key={message.id} className={`p-3 rounded-lg border ${getMessageStyle(message.type)}`}>
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-xs text-muted-foreground">
                    {message.type === 'sent' ? '发送' : message.type === 'received' ? '接收' : '系统'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</Text>
                </View>
                <Text className="text-sm">{message.content}</Text>
              </View>
            ))}
            {messages.length > 20 && (
              <Text className="text-center text-sm text-muted-foreground py-2">
                显示最近 20 条消息，共 {messages.length} 条
              </Text>
            )}
          </View>
        ) : (
          <Text className="text-center text-muted-foreground py-8">暂无消息记录</Text>
        )}
      </Card>

      {/* 使用说明 */}
      <Card className="p-4 mb-6">
        <Text className="text-lg font-medium mb-3">功能说明</Text>
        <View className="space-y-2">
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">连接管理</Text>：手动连接/断开 WebSocket
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">消息通信</Text>：发送消息并接收服务器回显
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">自动重连</Text>：网络中断时自动尝试重连
          </Text>
          <Text className="text-sm text-muted-foreground">
            • <Text className="font-medium">状态监控</Text>：实时显示连接状态和重连次数
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}
