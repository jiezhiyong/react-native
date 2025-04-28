import { useRouter } from 'expo-router';
import { Terminal } from 'lucide-react-native';
import * as React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Text } from '~/components/ui/text';

const demos: { name: string; desc: string; supports: string }[] = [
  { name: 'accelerometer', desc: '访问设备加速度计传感器', supports: 'Android, iOS (device only), Web' },
  { name: 'apple-authentication', desc: '为 iOS 提供 Apple 身份验证', supports: 'iOS' },
  {
    name: 'application',
    desc: '原生应用 ID、应用名称和构建版本等信息',
    supports: 'Android, iOS, Web',
  },
  { name: 'asset', desc: '资源加载和管理', supports: 'Android, iOS, Web' },
  { name: 'async-storage', desc: '异步、未加密、持久化键值存储', supports: 'Android, iOS, Web' },
  { name: 'audio', desc: '音频播放和录音', supports: 'Android, iOS, Web' },
  { name: 'auth-session', desc: '基于浏览器的身份验证', supports: 'Android, iOS, Web' },
  { name: 'background-task', desc: '运行后台任务', supports: 'Android, iOS' },
  { name: 'barometer', desc: '访问设备加速度计传感器', supports: 'Android, iOS (device only)' },
  { name: 'battery', desc: '访问物理设备电池信息，以及相应的事件监听器', supports: 'Android, iOS (device only), Web' },
  { name: 'blur', desc: '模糊视图效果', supports: 'Android, iOS, Web' },
  { name: 'brightness', desc: '获取和设置屏幕亮度', supports: 'Android, iOS' },
  { name: 'calendar', desc: '与日历、事件、提醒及其相关记录交互', supports: 'Android, iOS' },
  { name: 'camera', desc: '渲染设备前后摄像头的预览', supports: 'Android (device only), iOS (device only), Web' },
  { name: 'captureRef', desc: '捕获视图', supports: 'Android, iOS' },
  { name: 'cellular', desc: '用户蜂窝服务提供商的信息', supports: 'Android, iOS, Web' },
  { name: 'checkbox', desc: '基本复选框', supports: 'Android, iOS, Web' },
  { name: 'clipboard', desc: '获取和设置剪贴板', supports: 'Android, iOS, Web' },
  { name: 'constants', desc: '获取和设置剪贴板', supports: 'Android, iOS, Web' },
  { name: 'contacts', desc: '访问手机系统联系人', supports: 'Android, iOS' },
  { name: 'crypto', desc: '使用 `crypto` API, 对数据进行哈希处理', supports: 'Android, iOS, Web' },
  { name: 'date-time-picker', desc: '访问系统 UI 以选择日期和时间的组件', supports: 'Android, iOS' },
  { name: 'device', desc: '物理设备系统信息', supports: 'Android, iOS, Web' },
  { name: 'document-picker', desc: '访问系统 UI 以从用户设备上的可用提供者中选择文档', supports: 'Android, iOS, Web' },
  { name: 'encoding', desc: 'TextEncoder 和 TextDecoder API', supports: 'Android, iOS, Web' },
  { name: 'file-system', desc: '访问设备本地文件系统', supports: 'Android, iOS' },
  { name: 'flash-list', desc: '快速且性能优异的渲染列表方式', supports: 'Android, iOS, Web' },
  { name: 'font', desc: '在运行时加载字体', supports: 'Android, iOS, Web' },
  { name: 'gesture-handler', desc: '处理复杂手势', supports: 'Android, iOS, Web' },
  { name: 'gl', desc: '渲染 2D 和 3D 图形', supports: 'Android, iOS, Web' },
  { name: 'haptics', desc: '访问 Android 系统振动效果和 iOS 触觉引擎', supports: 'Android, iOS' },
  { name: 'image', desc: '访问 Android 系统振动效果和 iOS 触觉引擎', supports: 'Android, iOS, Web' },
  { name: 'image-manipulator', desc: '操作本地文件系统上图像', supports: 'Android, iOS, Web' },
  { name: 'image-picker', desc: '访问系统 UI 以从手机相册选择图片和视频或使用相机拍照', supports: 'Android, iOS, Web' },
  { name: 'intent-launcher', desc: '意图启动器', supports: 'Android' },
  { name: 'keep-awake', desc: '保持屏幕唤醒', supports: 'Android, iOS, Web' },
  { name: 'linear-gradient', desc: '渲染渐变视图', supports: 'Android, iOS, Web' },
  { name: 'linking', desc: '创建和打开通用深链', supports: 'Android, iOS, Web' },
  { name: 'local-authentication', desc: '通过面部或指纹扫描验证用户', supports: 'Android, iOS' },
  { name: 'location', desc: '访问读取地理位置', supports: 'Android, iOS, Web' },
  { name: 'mail-composer', desc: '使用系统特定 UI 来编写和发送电子邮件', supports: 'Android, iOS (device only), Web' },
  { name: 'manifests', desc: '启动', supports: 'Android, iOS, Web' },
  { name: 'masked-view', desc: '启动', supports: 'Android, iOS, Web' },
  { name: 'media-library', desc: '启动', supports: 'Android, iOS, Web' },
  { name: 'navigation-bar', desc: '启动', supports: 'Android, iOS, Web' },
  { name: 'netinfo', desc: '启动', supports: 'Android, iOS, Web' },
  { name: 'network', desc: '启动', supports: 'Android, iOS, Web' },
  { name: 'notifications', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'pedometer', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'picker', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'print', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'reanimated', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'register-root-component', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'route', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'route-ui', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'safe-area-context', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'screen-capture', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'screen-orientation', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'screens', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'securestore', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'segmented-control', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'sharing', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'skia', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'slider', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'sms', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'speech', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'sqlite', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'status-bar', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'store-review', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'stripe', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'svg', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'symbols', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'system-ui', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'task-manager', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'tracking-transparency', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'updates', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'url', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'video', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'video-thumbnails', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'view-pager', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'web-browser', desc: '启动', supports: 'Android, iOS, Web' },
  // { name: 'webview', desc: '启动', supports: 'Android, iOS, Web' },
].reverse();

export default function HomeScreen() {
  const router = useRouter();

  return (
    <FlatList
      className="flex-1 p-6"
      data={demos}
      renderItem={({ item, index }) => (
        <TouchableOpacity className="mb-2" onPress={() => router.navigate(`/discover/${item.name}` as any)}>
          <Alert icon={Terminal}>
            <AlertTitle className="capitalize">
              <Text>
                {index + 1}. {item.name}
              </Text>
              <Text className="text-green-600 text-xs"> - {item.supports}</Text>
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">{item.desc}</AlertDescription>
          </Alert>
        </TouchableOpacity>
      )}
    />
  );
}
