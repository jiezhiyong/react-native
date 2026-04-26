import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { useI18nContext } from '@/i18n/i18n-react';

/**
 * 隐私政策页面
 * 展示应用的隐私政策内容
 */
export default function PrivacyPolicyScreen() {
  const { LL } = useI18nContext();

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: LL.routes.privacyPolicy(),
        }}
      />

      <ScrollView className="flex-1 px-5 py-6">
        <Text className="text-2xl font-bold mb-6">{LL.privacy.title()}</Text>

        <Text className="mb-4">{LL.privacy.lastUpdated()}</Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section1()}</Text>
        <Text className="mb-4">
          我们可能收集关于您的各种信息，包括但不限于：
          {'\n'}- 个人识别信息（如姓名、电子邮件地址、电话号码等）
          {'\n'}- 设备信息（如设备ID、操作系统类型和版本）
          {'\n'}- 位置信息（如果您启用了此功能）
          {'\n'}- 使用数据（如应用使用频率、点击情况等）
        </Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section2()}</Text>
        <Text className="mb-4">
          我们使用收集到的信息用于：
          {'\n'}- 提供、维护和改进我们的服务
          {'\n'}- 开发新功能和服务
          {'\n'}- 了解用户如何使用我们的应用
          {'\n'}- 发送通知和更新
          {'\n'}- 防止欺诈行为
        </Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section3()}</Text>
        <Text className="mb-4">
          我们不会出售您的个人信息。我们可能在以下情况下共享您的信息：
          {'\n'}- 经您同意
          {'\n'}- 与我们的合作伙伴和服务提供商共享以完成服务
          {'\n'}- 法律要求
          {'\n'}- 保护我们或他人的权利和安全
        </Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section4()}</Text>
        <Text className="mb-4">
          我们采取合理的技术和组织措施来保护您的个人信息不被未经授权的访问或泄露。然而，没有任何网络或电子存储方法是100%安全的。
        </Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section5()}</Text>
        <Text className="mb-4">
          根据适用法律，您可能有权：
          {'\n'}- 访问您的个人信息
          {'\n'}- 更正不准确的信息
          {'\n'}- 删除您的信息
          {'\n'}- 限制或反对处理
          {'\n'}- 数据可携带性
        </Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section6()}</Text>
        <Text className="mb-4">
          我们的服务不面向13岁以下的儿童。如果您是父母或监护人，发现您的孩子向我们提供了个人信息，请联系我们。
        </Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section7()}</Text>
        <Text className="mb-4">我们可能会不时更新此隐私政策。我们会通过在应用中发布新的隐私政策来通知您任何变更。</Text>

        <Text className="font-medium text-lg mb-2">{LL.privacy.section8()}</Text>
        <Text className="mb-12">
          如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
          {'\n'}电子邮件：privacy@yourcompany.com
        </Text>
      </ScrollView>
    </View>
  );
}
