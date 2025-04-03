import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/Ov23li3LwycXQxfxkQGv',
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Ov23li3LwycXQxfxkQGv',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'qachat',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
      // TODO: 保存用户信息到本地
      // TODO: 跳转到首页
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}

// 服务器端代码示例（不要在客户端实现）
async function exchangeCodeForToken(code: string) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: 'Ov23li3LwycXQxfxkQGv',
      client_secret: 'd041c1e5e4cc546e992a8ca2d630fa112b167dd6', // 敏感信息，只在服务器端使用
      code,
    }),
  });

  const { access_token } = await response.json();
  console.log('access_token', access_token);
  // TODO: 保存 access_token 到本地
  // TODO: 调用 GitHub API 获取用户信息
  // TODO: 返回用户信息
}
