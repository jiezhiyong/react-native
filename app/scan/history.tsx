import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, CheckCircle, Copy, FileX, Trash2 } from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

import { type ScanHistoryItem, useScanHistoryStore } from '../../store/scan-history';

export default function HistoryScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const history = useScanHistoryStore((state) => state.history);
  const removeHistory = useScanHistoryStore((state) => state.removeHistory);
  const removeMultipleHistory = useScanHistoryStore((state) => state.removeMultipleHistory);

  // 用于引用当前打开的Swipeable组件
  const openedRowRef = useRef<Swipeable | null>(null);

  // 复制内容到剪贴板
  const copyToClipboard = async (content: string) => {
    await Clipboard.setStringAsync(content);
    Alert.alert('复制成功', '内容已复制到剪贴板');
  };

  // 打开URL
  const openUrl = useCallback(
    (url: string) => {
      router.push({
        pathname: '/webview',
        params: { url },
      });
    },
    [router]
  );

  // 删除单个历史记录
  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('删除确认', '确定要删除这条记录吗？', [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          onPress: () => {
            removeHistory(id);
            if (openedRowRef.current) {
              openedRowRef.current.close();
              openedRowRef.current = null;
            }
          },
          style: 'destructive',
        },
      ]);
    },
    [removeHistory, openedRowRef]
  );

  // 批量删除选中的历史记录
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) {
      Alert.alert('提示', '请先选择要删除的记录');
      return;
    }

    Alert.alert('删除确认', `确定要删除选中的 ${selectedItems.length} 条记录吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        onPress: () => {
          removeMultipleHistory(selectedItems);
          setSelectedItems([]);
          // 如果删除后没有记录了，退出编辑模式
          if (history.length === selectedItems.length) {
            setIsEditing(false);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  // 切换选中状态
  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.length === history.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(history.map((item) => item.id));
    }
  };

  // 渲染右滑删除按钮
  const renderRightActions = useCallback(
    (id: string) => {
      return (
        <Animated.View className="flex-row" entering={FadeInRight} exiting={FadeOutRight}>
          <TouchableOpacity
            className="bg-red-500 w-20 h-full justify-center items-center"
            onPress={() => handleDelete(id)}
          >
            <Trash2 color="white" size={24} />
            <Text className="text-white mt-1">删除</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [handleDelete]
  );

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, 'yyyy-MM-dd', { locale: zhCN });
  };

  // 单个记录项目的渲染函数
  const renderItem = useCallback(
    ({ item }: { item: ScanHistoryItem }) => {
      // 编辑模式下禁用滑动删除
      if (isEditing) {
        return (
          <View className="bg-background border-b border-gray-100 p-4">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={() => toggleSelect(item.id)} className="mr-3">
                {selectedItems.includes(item.id) ? (
                  <CheckCircle size={24} color="#3b82f6" fill="#3b82f6" />
                ) : (
                  <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
                )}
              </TouchableOpacity>

              <View className="flex-1">
                <Text className="text-gray-800 font-medium" numberOfLines={1}>
                  {item.content}
                </Text>
                <Text className="text-muted-foreground text-xs mt-1">{formatDate(item.timestamp)}</Text>
              </View>
            </View>
          </View>
        );
      }

      // 正常模式下支持滑动删除
      return (
        <Swipeable
          renderRightActions={() => renderRightActions(item.id)}
          onSwipeableOpen={() => {
            if (openedRowRef.current && openedRowRef.current !== null) {
              openedRowRef.current.close();
            }
          }}
          ref={(ref) => {
            if (ref) {
              openedRowRef.current = ref;
            }
          }}
        >
          <TouchableOpacity
            className="bg-background border-b border-gray-100 p-4"
            onPress={() => {
              if (item.isUrl) {
                openUrl(item.content);
              } else {
                copyToClipboard(item.content);
              }
            }}
          >
            <Text className="text-gray-800 font-medium" numberOfLines={1}>
              {item.content}
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-muted-foreground text-xs">{formatDate(item.timestamp)}</Text>
              {item.isUrl ? (
                <Text className="text-blue-500 text-xs">链接</Text>
              ) : (
                <TouchableOpacity onPress={() => copyToClipboard(item.content)} className="flex-row items-center">
                  <Copy size={12} color="#6b7280" />
                  <Text className="text-muted-foreground text-xs ml-1">复制</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Swipeable>
      );
    },
    [isEditing, selectedItems, openedRowRef, openUrl, renderRightActions]
  );

  // 空状态渲染
  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center p-5">
      <FileX size={120} color="#6b7280" />
      <Text className="text-muted-foreground text-center mt-4">暂无扫描记录</Text>
      <Text className="text-gray-400 text-center mt-2 text-sm">扫描二维码后会自动保存在这里</Text>
      <TouchableOpacity onPress={() => router.push('/scan')} className="mt-6 bg-blue-500 py-3 px-6 rounded-full">
        <Text className="text-white font-medium">去扫描</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      {/* 头部导航栏 */}
      <View className="bg-background pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-center px-4">
          <TouchableOpacity onPress={() => router.back()} className="absolute left-4 top-1">
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-black font-medium text-lg">历史记录</Text>

          {history.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setSelectedItems([]);
                } else {
                  setIsEditing(true);
                }
              }}
              className="absolute right-4 top-1"
            >
              <Text className="text-blue-500 font-medium">{isEditing ? '取消' : '编辑'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 列表内容 */}
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={renderEmptyState}
      />

      {/* 编辑模式下的底部工具栏 */}
      {isEditing && history.length > 0 && (
        <View className="bg-background border-t border-gray-200 p-4 flex-row justify-between items-center">
          <TouchableOpacity onPress={toggleSelectAll} className="flex-row items-center">
            {selectedItems.length === history.length ? (
              <CheckCircle size={20} color="#3b82f6" fill="#3b82f6" />
            ) : (
              <View className="w-5 h-5 rounded-full border-2 border-gray-300" />
            )}
            <Text className="ml-2 text-gray-700">全选</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBatchDelete}
            className={`px-6 py-2 rounded-full ${selectedItems.length > 0 ? 'bg-red-500' : 'bg-gray-300'}`}
            disabled={selectedItems.length === 0}
          >
            <Text className="text-white font-medium">删除</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
