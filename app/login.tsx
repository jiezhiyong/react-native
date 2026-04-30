import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { ActivityIndicator } from '@/components/ActivityIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useI18nContext } from '@/i18n/i18n-react';
import { useAuth } from '@/store/auth';

// GitHub OAuth 配置
const githubClientId = 'Ov23li3LwycXQxfxkQGv';
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: `https://github.com/settings/connections/applications/${githubClientId}`,
};

export default function LoginScreen() {
  const router = useRouter();
  const { LL } = useI18nContext();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('goodman@ly.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  // 设置 OAuth 请求
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: githubClientId,
      scopes: ['identity', 'user'],
      redirectUri: makeRedirectUri({
        scheme: 'qachat',
      }),
    },
    discovery
  );

  // 处理 OAuth 登录成功
  const handleOAuthSuccess = useCallback(
    async (code: string) => {
      try {
        const response = await fetch('/exchange-github-auth-code+api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        const res = await response.json();
        console.log(res);
        const { accessToken } = res;

        // 调用登录方法
        await signIn({ accessToken });

        // 登录成功后导航到受保护的页面
        router.replace('/(protected)/bill');
      } catch (error) {
        console.error('OAuth 登录失败:', error);
      }
    },
    [signIn, router]
  );

  // 监听 OAuth 响应
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleOAuthSuccess(code);
    }
  }, [response, handleOAuthSuccess]);

  // 处理表单登录
  const handleLogin = async () => {
    if (!username || !password) {
      alert(LL.login.missingCredentials());
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ username, password });
      router.back();
    } catch (error) {
      console.error('登录失败:', error);
      alert(LL.login.failed());
    } finally {
      setIsLoading(false);
    }
  };

  const isPresented = router.canGoBack();
  return (
    <View className="flex-1 bg-background p-5 gap-5">
      <StatusBar style="dark" />
      <View className="">
        <Text className="text-2xl text-muted-foreground">您好 👋</Text>
        <Text className="text-3xl font-medium mt-1 text-foreground">欢迎回来，请登录～</Text>
      </View>

      <Input placeholder={LL.login.usernamePlaceholder()} value={username} onChangeText={setUsername} />

      <Input placeholder={LL.login.passwordPlaceholder()} secureTextEntry value={password} onChangeText={setPassword} />

      <Button onPress={handleLogin} className="w-full flex-row items-center gap-3" disabled={isLoading}>
        {isLoading ? <ActivityIndicator size="small" color="#faf9f5" /> : <Text>{LL.login.submit()}</Text>}
      </Button>

      <View className="flex-row items-center">
        <View className="flex-1 h-px bg-muted" />
        <Text className="text-sm mx-3 text-muted-foreground">{LL.login.or()}</Text>
        <View className="flex-1 h-px bg-muted" />
      </View>

      <Button
        disabled={!request || isLoading}
        onPress={() => promptAsync()}
        className="w-full border"
        variant="secondary"
      >
        <Text>{LL.login.github()}</Text>
      </Button>

      {isPresented && (
        <Link href="../" asChild>
          <Button variant="ghost">
            <Text className="text-sm">{LL.login.back()}</Text>
          </Button>
        </Link>
      )}
    </View>
  );
}
