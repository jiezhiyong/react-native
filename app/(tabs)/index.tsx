import { A } from '@expo/html-elements';
import * as Linking from 'expo-linking';
import { Link, usePathname, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Platform, ScrollView, View } from 'react-native';

import DOMComponents from '~/components/DOMComponents';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import MyModule from '~/modules/my-module';

export default function HomeScreen() {
  const pathname = usePathname();
  const router = useRouter();

  const [containerSize, setContainerSize] = React.useState<{ width: number; height: number } | null>(null);

  // ios 模拟器或设备上打开后一直触发 console ？
  // if (Platform.OS === 'ios') {
  //   console.log('Hello on iOS');
  // }

  // if (process.env.NODE_ENV === 'development') {
  //   console.log('Hello in development');
  // }

  return (
    <ScrollView>
      <View className="flex-1 gap-3 p-5 bg-secondary/30">
        <View style={{ $$css: true, _: 'bg-slate-100 rounded-xl p-3' }}>
          <Text style={{ $$css: true, _: 'text-lg font-medium' }}>Tailwind + React Native web elements</Text>
        </View>

        <DOMComponents
          name="this is a DOMComponents"
          dom={{
            containerStyle: containerSize != null ? { width: containerSize.width, height: containerSize.height } : null,
            matchContents: true,
            scrollEnabled: false,
            style: {},
          }}
          pathname={pathname}
          nativeActions={async (data: string) => {
            console.log('Hello', data);
          }}
          onDOMLayout={async ({ width, height }) => {
            // if (containerSize?.width !== width || containerSize?.height !== height) {
            //   setContainerSize({ width, height });
            // }
          }}
        />

        <Button onPress={() => router.navigate('/discover')}>
          <Text>Go to Discover</Text>
        </Button>

        <Text>登录</Text>
        <Button onPress={() => router.navigate('/login')}>
          <Text>Go to Login</Text>
        </Button>

        <Button onPress={() => router.navigate('/(protected)/bill')}>
          <Text>Go to Protected Page Bill</Text>
        </Button>

        <Text>导航</Text>
        <Button onPress={() => router.navigate('/products')}>
          <Text>Go to Products</Text>
        </Button>

        <Link href={`/products/${20}?name=abc`} asChild withAnchor>
          <Button>
            <Text>view products</Text>
          </Button>
        </Link>

        <Text>使用默认浏览器打开URL</Text>
        <Button onPress={() => Linking.openURL('https://expo.dev')}>
          <Text>expo-linking-api</Text>
        </Button>

        <Link href="https://expo.dev" asChild>
          <Button>
            <Text>expo-routers-link-component</Text>
          </Button>
        </Link>

        <Button variant="outline">
          <A href="https://expo.dev">@expo/html-elements</A>
        </Button>

        <Button onPress={() => WebBrowser.openBrowserAsync('https://expo.dev')}>
          <Text>WebBrowser</Text>
        </Button>

        <Button onPress={() => Linking.openURL('mailto:support@expo.dev')}>
          <Text>mailto</Text>
        </Button>

        <Button onPress={() => Linking.openURL('tel:+123456789')}>
          <Text>tel</Text>
        </Button>

        <Button onPress={() => Linking.openURL('sms:+123456789')}>
          <Text>sms</Text>
        </Button>

        <Text>Expo Modules API</Text>
        <Text>{MyModule.hello()}</Text>
      </View>
    </ScrollView>
  );
}
