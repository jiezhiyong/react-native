import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAuth } from '~/store/auth';

// GitHub OAuth 配置
const githubClientId = 'Ov23li3LwycXQxfxkQGv';
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: `https://github.com/settings/connections/applications/${githubClientId}`,
};

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
  const handleFormLogin = async () => {
    if (!username || !password) {
      alert('请输入用户名和密码');
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ username, password });
      router.replace('/(protected)/bill');
    } catch (error) {
      console.error('登录失败:', error);
      alert('登录失败，请检查用户名和密码');
    } finally {
      setIsLoading(false);
    }
  };

  const isPresented = router.canGoBack();
  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <TextInput style={styles.input} placeholder="用户名" value={username} onChangeText={setUsername} />

      <TextInput style={styles.input} placeholder="密码" secureTextEntry value={password} onChangeText={setPassword} />

      <Button onPress={handleFormLogin} className="w-full">
        <Text>{isLoading ? '登录中...' : '登录'}</Text>
      </Button>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>或</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button disabled={!request || isLoading} onPress={() => promptAsync()} className="w-full" variant="outline">
        <Text>GitHub 登录</Text>
      </Button>

      {isPresented && (
        <Link href="../" asChild>
          <Button variant="ghost">
            <Text>Dismiss</Text>
          </Button>
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oauthButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
  },
});
