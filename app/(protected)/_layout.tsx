import { Redirect, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { useAuth } from '@/store/auth';

export const unstable_settings = {
  initialRouteName: 'bill',
};

/**
 * 受保护路由的布局组件
 * 该组件会检查用户是否已经认证，如果没有认证则重定向到登录页面
 */
export default function ProtectedLayout() {
  // 获取认证状态
  const { session, isLoading } = useAuth();

  // 如果认证状态正在加载，显示加载指示器
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 如果用户未认证，重定向到登录页面
  if (!session) {
    return <Redirect href="/login" />;
  }

  // 用户已认证，渲染受保护的路由
  return <Stack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f4ed',
  },
});
