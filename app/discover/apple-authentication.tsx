import * as AppleAuthentication from 'expo-apple-authentication';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

// 定义用户信息类型
interface UserInfo {
  user: string;
  email?: string;
  fullName?: {
    familyName?: string;
    givenName?: string;
  };
}

export default function AppleAuthenticationScreen() {
  // 身份验证状态
  const [credentialState, setCredentialState] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 检查 Apple 身份验证是否可用
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState<boolean | null>(null);

  // 组件加载时检查 Apple 身份验证是否可用
  React.useEffect(() => {
    async function checkAvailability() {
      try {
        const available = await AppleAuthentication.isAvailableAsync();
        setIsAppleAuthAvailable(available);
      } catch (error) {
        console.error('检查 Apple 身份验证可用性出错:', error);
        setIsAppleAuthAvailable(false);
      }
    }
    checkAvailability();
  }, []);

  // 处理使用 Apple 登录
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // 转换 AppleAuthentication 返回的 fullName 格式到我们的格式
      const formattedFullName = credential.fullName
        ? {
            familyName: credential.fullName.familyName || undefined,
            givenName: credential.fullName.givenName || undefined,
          }
        : undefined;

      // 保存凭证信息
      setUserInfo({
        user: credential.user,
        email: credential.email || undefined,
        fullName: formattedFullName,
      });

      // 验证凭证状态
      const credState = await AppleAuthentication.getCredentialStateAsync(credential.user);

      // 转换状态为文本显示
      switch (credState) {
        case AppleAuthentication.AppleAuthenticationCredentialState.REVOKED:
          setCredentialState('已撤销');
          break;
        case AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED:
          setCredentialState('已授权');
          break;
        case AppleAuthentication.AppleAuthenticationCredentialState.NOT_FOUND:
          setCredentialState('未找到');
          break;
        case AppleAuthentication.AppleAuthenticationCredentialState.TRANSFERRED:
          setCredentialState('已转移');
          break;
        default:
          setCredentialState('未知状态');
      }
    } catch (error: any) {
      // 错误处理
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        console.error('Apple 登录失败:', error);
        Alert.alert('错误', JSON.stringify(error));
      }
    }
  };

  return (
    <View className="flex-1 px-5 pt-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Apple 登录</Text>
        <Text className="text-muted-foreground">集成 Apple 的身份验证服务，为用户提供安全便捷的登录方式。</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="mb-6 bg-muted rounded-lg p-4 gap-3">
          <Text className="text-foreground">
            身份验证状态: {isAppleAuthAvailable === null ? '检查中...' : isAppleAuthAvailable ? '可用' : '不可用'}
          </Text>

          <Text className="text-foreground">登录凭证状态: {credentialState || '未登录'}</Text>
        </View>

        {/* 用户信息显示 */}
        {userInfo && (
          <>
            <Text className="text-lg font-medium mb-2">用户信息</Text>
            <ScrollView className="bg-muted rounded-lg p-4 mb-6" horizontal>
              <Text>{JSON.stringify(userInfo, null, 2)}</Text>
            </ScrollView>
          </>
        )}

        <Text className="text-lg font-medium mb-2">说明</Text>
        <Text className="bg-yellow-100 rounded-lg p-4 mb-6">
          Apple 登录在模拟器上可能无法正常工作，需要在真机上测试。 首次登录时会提供全名和邮箱，后续登录可能不再提供。
        </Text>

        {isAppleAuthAvailable && (
          <View className="items-center mb-6">
            {/* 苹果原生按钮 */}
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
              cornerRadius={5}
              style={{ width: 200, height: 40 }}
              onPress={handleAppleSignIn}
            />
          </View>
        )}
      </ScrollView>

      {/* 苹果登录按钮 - 自定义样式 */}
      <Button onPress={handleAppleSignIn}>
        <Text>使用Apple登录 (自定义按钮)</Text>
      </Button>
    </View>
  );
}
