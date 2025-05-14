import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import * as Clipboard from 'expo-clipboard';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Circle, CircleCheck, FileX, Trash2 } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

import { type ScanHistoryItem, useScanHistoryStore } from '../../store/scan-history';

// 编辑工具栏组件的属性接口
interface EditToolbarProps {
  selectedItems: string[];
  historyLength: number;
  toggleSelectAll: () => void;
  handleBatchDelete: () => void;
}

// 底部编辑工具栏组件
const EditToolbar: React.FC<EditToolbarProps> = React.memo(
  ({ selectedItems, historyLength, toggleSelectAll, handleBatchDelete }) => {
    // 计算是否全选和是否有选中项
    const isAllSelected = selectedItems.length === historyLength;
    const hasSelectedItems = selectedItems.length > 0;

    return (
      <View className="pl-5 pr-3 pt-3 flex-row justify-between items-center border-t border-gray-100">
        <TouchableOpacity onPress={toggleSelectAll} className="flex-row items-center gap-2">
          {isAllSelected ? (
            <CircleCheck size={20} strokeWidth={1.5} />
          ) : (
            <Circle size={20} strokeWidth={1.5} color="#eaeaea" />
          )}
          <Text>全选</Text>
        </TouchableOpacity>

        <Button
          variant="destructive"
          onPress={handleBatchDelete}
          disabled={!hasSelectedItems}
          className="rounded-full min-w-28"
        >
          <Text className="text-white font-medium">删除</Text>
        </Button>
      </View>
    );
  }
);

// 设置组件的displayName
EditToolbar.displayName = 'EditToolbar';

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
  const copyToClipboard = useCallback(async (content: string) => {
    await Clipboard.setStringAsync(content);
    Alert.alert('复制成功', '内容已复制到剪贴板');
  }, []);

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
  const handleBatchDelete = useCallback(() => {
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
  }, [selectedItems, history.length, removeMultipleHistory]);

  // 切换选中状态
  const toggleSelect = useCallback((id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  // 全选/取消全选
  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === history.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(history.map((item) => item.id));
    }
  }, [selectedItems.length, history]);

  // 格式化时间
  const formatDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, 'yyyy-MM-dd', { locale: zhCN });
  }, []);

  // 单个记录项组件接口
  interface HistoryItemProps {
    item: ScanHistoryItem;
    isEditing: boolean;
    isSelected: boolean;
    onToggleSelect: (id: string) => void;
    onOpen: (content: string, isUrl: boolean) => void;
    onDelete: (id: string) => void;
    formatDateFn: (timestamp: number) => string;
  }

  // 单个记录项组件
  const HistoryItem: React.FC<HistoryItemProps> = React.memo((props) => {
    const { item, isEditing, isSelected, onToggleSelect, onOpen, onDelete, formatDateFn } = props;

    // 处理点击事件
    function handlePress() {
      if (isEditing) {
        onToggleSelect(item.id);
        return;
      }

      onOpen(item.content, item.isUrl);
    }

    // 处理删除事件
    function handleDeleteItem() {
      onDelete(item.id);
    }

    return (
      <View className="flex-row ml-5 mr-3 gap-3 items-center overflow-hidden border-b border-gray-100">
        <TouchableOpacity className="flex-1 py-3 items-center flex-row gap-3 overflow-hidden" onPress={handlePress}>
          {isEditing && (
            <>
              {isSelected ? (
                <CircleCheck size={20} strokeWidth={1.5} />
              ) : (
                <Circle size={20} strokeWidth={1.5} color="#eaeaea" />
              )}
            </>
          )}

          <View>
            <Text className="font-medium" numberOfLines={1}>
              {item.content}
            </Text>
            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-muted-foreground text-xs">{formatDateFn(item.timestamp)}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {isEditing && (
          <Button variant="ghost" onPress={handleDeleteItem} size="icon" className="shrink-0">
            <Trash2 size={18} strokeWidth={1.5} color="red" />
          </Button>
        )}
      </View>
    );
  });

  // 设置单项组件的displayName
  HistoryItem.displayName = 'HistoryItem';

  // 打开内容
  const handleOpenContent = useCallback(
    (content: string, isUrl: boolean) => {
      if (isUrl) {
        openUrl(content);
      } else {
        copyToClipboard(content);
      }
    },
    [openUrl, copyToClipboard]
  );

  // 单个记录项目的渲染函数
  const renderItem = useCallback(
    ({ item }: { item: ScanHistoryItem }) => {
      const isSelected = selectedItems.includes(item.id);
      return (
        <HistoryItem
          item={item}
          isEditing={isEditing}
          isSelected={isSelected}
          onToggleSelect={toggleSelect}
          onOpen={handleOpenContent}
          onDelete={handleDelete}
          formatDateFn={formatDate}
        />
      );
    },
    [isEditing, selectedItems, toggleSelect, handleOpenContent, handleDelete, formatDate, HistoryItem]
  );

  // 空状态渲染
  const renderEmptyState = useCallback(
    () => (
      <View className="flex-1 justify-center items-center p-5">
        <FileX size={120} color="#6b7280" />
        <Text className="text-muted-foreground text-center mt-4">暂无扫描记录</Text>
        <Text className="text-secondary-foreground text-center mt-2 text-sm">扫描二维码后会自动保存在这里</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-blue-500 py-3 px-6 rounded-full">
          <Text className="text-white font-medium">去扫描</Text>
        </TouchableOpacity>
      </View>
    ),
    [router]
  );

  // 编辑切换处理
  const handleToggleEdit = useCallback(() => {
    if (isEditing) {
      setIsEditing(false);
      setSelectedItems([]);
    } else {
      setIsEditing(true);
    }
  }, [isEditing]);

  // 头部编辑按钮
  const headerRight = useMemo(() => {
    // 当历史记录为空时不显示按钮
    if (history.length === 0) return undefined;

    // 定义头部编辑按钮组件
    function HeaderRightButton() {
      return (
        <TouchableOpacity onPress={handleToggleEdit}>
          <Text className="text-blue-500 font-medium">{isEditing ? '取消' : '编辑'}</Text>
        </TouchableOpacity>
      );
    }

    return HeaderRightButton;
  }, [history.length, isEditing, handleToggleEdit]);

  // 缓存FlatList配置
  const flatListProps = useMemo(
    () => ({
      keyExtractor: (item: ScanHistoryItem) => item.id,
      data: history,
      renderItem,
      contentContainerStyle: { flexGrow: 1 } as const,
      ListEmptyComponent: renderEmptyState,
    }),
    [history, renderItem, renderEmptyState]
  );

  // 缓存EditToolbar组件
  const editToolbar = useMemo(() => {
    if (!isEditing || history.length === 0) return null;

    return (
      <EditToolbar
        selectedItems={selectedItems}
        historyLength={history.length}
        toggleSelectAll={toggleSelectAll}
        handleBatchDelete={handleBatchDelete}
      />
    );
  }, [isEditing, history.length, selectedItems, toggleSelectAll, handleBatchDelete]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: '历史记录',
          headerRight: headerRight,
        }}
      />

      {/* 列表内容 */}
      <FlatList {...flatListProps} />

      {/* 编辑模式下的底部工具栏 */}
      {editToolbar}
    </SafeAreaView>
  );
}
