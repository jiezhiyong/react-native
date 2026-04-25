import { useRouter } from 'expo-router';
import { Bell, Search, Terminal, X } from 'lucide-react-native';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { ScrollHeader } from '@/components/ui/scroll-header';
import { Text } from '@/components/ui/text';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { cn } from '@/lib/utils';

const demos: { name: string; desc: string; supports: string }[] = [
  // 设备信息等
  {
    name: 'application',
    desc: '原生应用 ID、应用名称和构建版本等信息',
    supports: 'Android, iOS, Web',
  },
  { name: 'device', desc: '物理设备系统信息', supports: 'Android, iOS, Web' },

  // 新增功能 Demo
  { name: 'app-state', desc: 'AppState 和 Appearance 监听，应用状态与主题变化', supports: 'Android, iOS, Web' },
  { name: 'websocket', desc: 'WebSocket 实时通信，消息收发与重连', supports: 'Android, iOS, Web' },
  { name: 'file-download', desc: '文件下载进度监控，支持取消和重试', supports: 'Android, iOS, Web' },
  { name: 'vibration', desc: '震动与触觉反馈，Vibration API 和 Haptics 对比', supports: 'Android, iOS' },
  { name: 'maps', desc: '地图显示，当前位置标记，自定义标记和地图类型切换', supports: 'Android, iOS, Web' },
  { name: 'file-upload', desc: '文件上传进度监控，支持取消和重试', supports: 'Android, iOS, Web' },
  { name: 'network-info', desc: '网络状态监听，连接类型和网络详细信息', supports: 'Android, iOS, Web' },

  // 监控与分析
  { name: 'sentry', desc: 'Sentry 错误监控与性能分析演示', supports: 'Android, iOS, Web' },

  // 常用
  { name: 'webview', desc: 'WebView', supports: 'Android, iOS' },
  { name: 'keyboard', desc: '键盘', supports: 'Android, iOS, Web' },
  { name: 'async-storage', desc: '异步、未加密、持久化键值存储', supports: 'Android, iOS, Web' },
  { name: 'camera', desc: '渲染设备前后摄像头的预览', supports: 'Android (device), iOS (device), Web' },
  { name: 'contacts', desc: '访问手机系统联系人', supports: 'Android, iOS' },
  { name: 'accelerometer', desc: '访问设备加速度计传感器', supports: 'Android, iOS (device), Web' },
  { name: 'clipboard', desc: '获取和设置剪贴板', supports: 'Android, iOS, Web' },
  { name: 'gesture-handler', desc: '处理复杂手势', supports: 'Android, iOS, Web' },
  { name: 'haptics', desc: '访问 Android 系统振动效果和 iOS 触觉引擎', supports: 'Android, iOS' },
  { name: 'location', desc: '访问读取地理位置', supports: 'Android, iOS, Web' },
  { name: 'safe-area-context', desc: '安全区域上下文', supports: 'Android, iOS, Web' },
  { name: 'notifications', desc: '推送通知', supports: 'Android (device), iOS (device)' },
  { name: 'screen-capture', desc: '屏幕保护', supports: 'Android, iOS' },
  { name: 'status-bar', desc: '状态栏', supports: 'Android, iOS, Web' },
  { name: 'stripe', desc: '支付', supports: 'Android, iOS' },
  { name: 'updates', desc: '更新', supports: 'Android, iOS' },
  { name: 'web-browser', desc: '系统网络浏览器', supports: 'Android, iOS, Web' },
  { name: 'background-task', desc: '运行后台任务', supports: 'Android, iOS' },
  { name: 'task-manager', desc: '任务管理器', supports: 'Android, iOS' },

  // UI组件
  { name: 'image-picker', desc: '从手机相册选择图片和视频或使用相机拍照', supports: 'Android, iOS, Web' },
  { name: 'flash-list', desc: '快速且性能优异的渲染列表方式', supports: 'Android, iOS, Web' },
  { name: 'reanimated', desc: '创建平滑、强大和可维护动画', supports: 'Android, iOS, Web' },
  { name: 'date-time-picker', desc: '选择日期和时间的组件', supports: 'Android, iOS' },
  { name: 'document-picker', desc: '从用户设备上的可用提供者中选择文档', supports: 'Android, iOS, Web' },
  { name: 'blur', desc: '模糊视图效果', supports: 'Android, iOS, Web' },
  { name: 'captureRef', desc: '捕获视图', supports: 'Android, iOS' },
  { name: 'calendar', desc: '与日历、事件、提醒及其相关记录交互', supports: 'Android, iOS' },
  { name: 'checkbox', desc: '基本复选框', supports: 'Android, iOS, Web' },
  { name: 'linear-gradient', desc: '渲染渐变视图', supports: 'Android, iOS, Web' },
  { name: 'masked-view', desc: '显示与遮罩元素中渲染的视图重叠的像素', supports: 'Android, iOS' },
  { name: 'view-pager', desc: '视图页', supports: 'Android, iOS' },
  { name: 'slider', desc: '滑块控件', supports: 'Android, iOS, Web' },
  { name: 'segmented-control', desc: '分段控制', supports: 'Android, iOS, Web' },
  { name: 'linking', desc: '创建和打开通用深链', supports: 'Android, iOS, Web' },
  { name: 'router', desc: '路由器', supports: 'Android, iOS, Web' },
  { name: 'router-ui', desc: '路由 UI', supports: 'Android, iOS, Web' },
  { name: 'picker', desc: '在多个选项之间进行选择', supports: 'Android, iOS, Web' },

  // 工具方法
  { name: 'secure-store', desc: '在设备上加密和本地安全存储键值对', supports: 'Android, iOS' },
  { name: 'crypto', desc: '使用 `crypto` API, 对数据进行哈希处理', supports: 'Android, iOS, Web' },
  { name: 'encoding', desc: 'TextEncoder 和 TextDecoder API', supports: 'Android, iOS, Web' },
  { name: 'SQLite', desc: '通过 SQLite API 查询数据库', supports: 'Android, iOS, Web' },

  // 其他原生功能
  { name: 'screen-orientation', desc: '屏幕方向', supports: 'Android, iOS, Web' },
  { name: 'sms', desc: '短信', supports: 'Android, iOS' },
  { name: 'speech', desc: '语音', supports: 'Android, iOS, Web' },
  { name: 'print', desc: '打印', supports: 'Android, iOS, Web' },
  { name: 'brightness', desc: '获取和设置屏幕亮度', supports: 'Android, iOS' },
  { name: 'battery', desc: '访问物理设备电池信息，以及相应的事件监听器', supports: 'Android, iOS (device), Web' },
  { name: 'barometer', desc: '访问设备加气压计传感器', supports: 'Android, iOS (device)' },
  { name: 'keep-awake', desc: '保持屏幕唤醒', supports: 'Android, iOS, Web' },
  { name: 'pedometer', desc: '访问设备计步传感器', supports: 'Android, iOS' },

  // 资源、文件操作
  { name: 'sharing', desc: '文件共享', supports: 'Android, iOS, Web' },
  { name: 'asset', desc: '资源加载和管理', supports: 'Android, iOS, Web' },
  { name: 'audio', desc: '音频播放和录音', supports: 'Android, iOS, Web' },
  { name: 'font', desc: '在运行时加载字体', supports: 'Android, iOS, Web' },
  { name: 'image', desc: '访问 Android 系统振动效果和 iOS 触觉引擎', supports: 'Android, iOS, Web' },
  { name: 'image-manipulator', desc: '操作本地文件系统上图像', supports: 'Android, iOS, Web' },
  { name: 'media-library', desc: '访问设备媒体库', supports: 'Android, iOS' },
  { name: 'video', desc: '视频', supports: 'Android, iOS, Web' },
  { name: 'video-thumbnails', desc: '视频缩略图', supports: 'Android, iOS' },
  { name: 'file-system', desc: '访问设备本地文件系统', supports: 'Android, iOS' },
  { name: 'gl', desc: '渲染 2D 和 3D 图形', supports: 'Android, iOS, Web' },
  { name: 'svg', desc: 'SVG', supports: 'Android, iOS, Web' },

  // 其他
  { name: 'cellular', desc: '用户蜂窝服务提供商的信息', supports: 'Android, iOS, Web' },
  { name: 'tracking-transparency', desc: '跟踪', supports: 'Android, iOS' },
  { name: 'network', desc: '访问设备网络信息', supports: 'Android, iOS, Web' },
  { name: 'constants', desc: '常量', supports: 'Android, iOS, Web' },
  { name: 'apple-authentication', desc: '为 iOS 提供 Apple 身份验证', supports: 'iOS' },
  { name: 'auth-session', desc: '基于浏览器的身份验证', supports: 'Android, iOS, Web' },
  { name: 'local-authentication', desc: '通过面部或指纹扫描验证用户', supports: 'Android, iOS' },
  { name: 'mail-composer', desc: '使用系统特定 UI 来编写和发送电子邮件', supports: 'Android, iOS (device), Web' },
  { name: 'store-review', desc: '应用内评论', supports: 'Android, iOS' },
  { name: 'intent-launcher', desc: '意图启动器', supports: 'Android' },
  { name: 'navigation-bar', desc: '访问 Android 原生导航栏各种交互', supports: 'Android' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredDemos, setFilteredDemos] = React.useState(demos);

  const { scrollY, scrollHandler, isDarkStyle, headerHeight } = useScrollHeader();
  const c = isDarkStyle ? '#141413' : '#faf9f5';

  const rightButtons = [{ icon: <Bell size={20} color={c} />, onPress: () => router.push('/notice' as any) }];

  React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDemos(demos);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = demos.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.supports.toLowerCase().includes(query)
    );
    setFilteredDemos(filtered);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <View className="flex-1">
      <ScrollHeader
        title="发现"
        scrollY={scrollY}
        gradientColors={['#c96442', '#d9b9a5']}
        rightButtons={rightButtons}
      />
      <Animated.FlatList
        className="flex-1 bg-background"
        data={filteredDemos}
        keyExtractor={(item) => item.name}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: headerHeight + 20, paddingHorizontal: 20 }}
        ListHeaderComponent={
          <View className="mb-4">
            <View className="flex-row items-center bg-card rounded-xl border border-input">
              <View className="pl-3">
                <Search size={18} color="#87867f" />
              </View>
              <Input
                className="flex-1 border-0 bg-transparent"
                placeholder="搜索功能、描述或平台..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity className="pr-3" onPress={handleClearSearch}>
                  <X size={18} color="#87867f" />
                </TouchableOpacity>
              )}
            </View>
            {filteredDemos.length === 0 && (
              <Text className="text-center mt-4 text-muted-foreground">没有找到匹配的项目</Text>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            className={cn('mb-2', index === filteredDemos.length - 1 && 'mb-5')}
            onPress={() => router.navigate(`/discover/${item.name}` as any)}
          >
            <Alert icon={Terminal}>
              <AlertTitle className="capitalize">
                <Text>
                  {index + 1}. {item.name}
                </Text>
                <Text className="text-primary text-sm"> - {item.supports}</Text>
              </AlertTitle>
              <AlertDescription className="text-muted-foreground">{item.desc}</AlertDescription>
            </Alert>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
