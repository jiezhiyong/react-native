import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

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
        // TODO: 实现实际的 OAuth 令牌交换逻辑
        const { accessToken } = await exchangeAuthCode(code);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>登录</Text>

      <TextInput style={styles.input} placeholder="用户名" value={username} onChangeText={setUsername} />

      <TextInput style={styles.input} placeholder="密码" secureTextEntry value={password} onChangeText={setPassword} />

      <Pressable style={styles.loginButton} onPress={handleFormLogin}>
        <Text style={styles.buttonText}>{isLoading ? '登录中...' : '登录'}</Text>
      </Pressable>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>或</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={styles.oauthButton} disabled={!request || isLoading} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>GitHub 登录</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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

// 服务器端代码示例（不要在客户端实现）
async function exchangeAuthCode(code: string) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: githubClientId,
      client_secret: 'd041c1e5e4cc546e992a8ca2d630fa112b167dd6', // 敏感信息，只在服务器端使用
      code,
    }),
  });

  const { accessToken } = await response.json();
  console.log('accessToken', accessToken);
  // TODO: 调用 GitHub API 获取用户信息
  // TODO: 返回 accessToken、用户信息
  return { accessToken };
}
