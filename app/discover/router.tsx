import { Link, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

// 主页面组件
export default function RouteScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">路由示例</Text>
        <Text className="text-muted-foreground">展示路由的基本用法，包括导航、参数传递等。</Text>
      </View>

      <View className="flex gap-3">
        <Button
          onPress={() =>
            // eg:
            // router.push('/discover/router-detail');

            router.push({
              pathname: '/discover/router-detail',
              params: { id: '123', name: '张三' },
            })
          }
        >
          <Text>使用 router.push()</Text>
        </Button>

        <Link href="/discover/router-detail" asChild>
          <Button>
            <Text>使用 Link 组件</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
