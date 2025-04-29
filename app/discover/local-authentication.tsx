import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Text } from '~/components/ui/text';

const securityLevelDesc = {
  [String(LocalAuthentication.SecurityLevel.NONE)]: '无',
  [String(LocalAuthentication.SecurityLevel.SECRET)]: '一般',
  [String(LocalAuthentication.SecurityLevel.BIOMETRIC_STRONG)]: '生物识别（强）',
  [String(LocalAuthentication.SecurityLevel.BIOMETRIC_WEAK)]: '生物识别（弱）',
};

export default function LocalAuthenticationScreen() {
  const [isCompatible, setIsCompatible] = useState<boolean>(false);
  const [enrolledLevel, setEnrolledLevel] = useState<LocalAuthentication.SecurityLevel | null>(null);
  const [authTypes, setAuthTypes] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [authResult, setAuthResult] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // 检查设备是否支持指纹或面部识别
  const checkDeviceCompatibility = async () => {
    try {
      // 检查设备是否兼容生物识别
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsCompatible(compatible);

      if (compatible) {
        // 获取已注册的生物识别安全级别
        const level = await LocalAuthentication.getEnrolledLevelAsync();
        setEnrolledLevel(level);

        // 获取可用的身份验证类型
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        setAuthTypes(supportedTypes);
      }
    } catch (error) {
      console.error('检查设备兼容性时出错:', error);
    }
  };

  // 执行身份验证
  const authenticate = async () => {
    try {
      setIsAuthenticating(true);
      setAuthResult('正在认证...');

      // 检查是否已经注册了生物识别
      const hasEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasEnrolled) {
        setAuthResult('设备未注册任何生物识别');
        setIsAuthenticating(false);
        return;
      }

      // 执行认证
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '请验证您的身份',
        cancelLabel: '取消',
        fallbackLabel: '使用备用方式',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setAuthResult('认证成功');
      } else {
        setAuthResult(`认证失败: ${result.error || '用户取消'}`);
      }
    } catch (error) {
      setAuthResult(`认证错误: ${error}`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 组件加载时检查设备兼容性
  useEffect(() => {
    checkDeviceCompatibility();
  }, []);

  // 将认证类型转换为可读字符串
  const getAuthTypeName = (type: LocalAuthentication.AuthenticationType): string => {
    switch (type) {
      case LocalAuthentication.AuthenticationType.FINGERPRINT:
        return '指纹识别';
      case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
        return '面部识别';
      case LocalAuthentication.AuthenticationType.IRIS:
        return '虹膜识别';
      default:
        return '未知类型';
    }
  };

  return (
    <View className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">本地认证</Text>
        <Text className="text-secondary-foreground">使用设备的生物识别或密码进行本地身份验证。</Text>
      </View>

      <Card className="p-4 mb-4 bg-muted">
        <Text className="text-lg font-medium mb-2">支持情况</Text>
        <View className="flex-row items-center mb-2">
          <Text>设备支持生物识别: </Text>
          {isCompatible ? <Text className="text-green-500">支持</Text> : <Text className="text-red-500">不支持</Text>}
        </View>

        {enrolledLevel !== null && (
          <View className="mb-2">
            <Text>已注册的安全级别: {securityLevelDesc[enrolledLevel.toString()]}</Text>
          </View>
        )}

        {authTypes.length > 0 && (
          <View className="flex-row mb-2">
            <Text className="mb-1">支持的认证类型: </Text>
            {authTypes.map((type, index) => (
              <Text key={index}>{getAuthTypeName(type)}</Text>
            ))}
          </View>
        )}
      </Card>

      <Card className="p-4 bg-muted rounded-lg mb-4">
        <Text className="text-lg font-medium mb-2">认证结果</Text>
        <Text>{authResult || '...'}</Text>
      </Card>

      <Button disabled={!isCompatible || isAuthenticating} onPress={authenticate}>
        <Text>{isAuthenticating ? '正在验证...' : '使用生物识别验证'}</Text>
      </Button>
    </View>
  );
}
