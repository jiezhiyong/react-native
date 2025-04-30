import * as MailComposer from 'expo-mail-composer';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';

// https://docs.expo.dev/versions/latest/sdk/mail-composer/
export default function ExpoMailComposerScreen() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [subject, setSubject] = useState('测试邮件主题');
  const [body, setBody] = useState('这是邮件正文内容，可以包含简单的格式化文本。');
  const [recipients, setRecipients] = useState('example@example.com');

  // 检查MailComposer是否可用
  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    const isMailAvailable = await MailComposer.isAvailableAsync();
    setIsAvailable(isMailAvailable);
  };

  // 发送简单邮件
  const sendSimpleEmail = async () => {
    if (!isAvailable) {
      Alert.alert('错误', '此设备不支持发送邮件功能');
      return;
    }

    try {
      const result = await MailComposer.composeAsync({
        subject: subject,
        body: body,
        recipients: recipients.split(',').map((email) => email.trim()),
        isHtml: false,
      });

      if (result.status === 'sent') {
        Alert.alert('成功', '邮件已发送');
      } else if (result.status === 'saved') {
        Alert.alert('成功', '邮件已保存为草稿');
      } else if (result.status === 'cancelled') {
        Alert.alert('提示', '已取消发送邮件');
      }
    } catch (error) {
      Alert.alert('错误', '发送邮件时发生错误');
      console.error('发送邮件错误:', error);
    }
  };

  // 发送HTML格式邮件
  const sendHtmlEmail = async () => {
    if (!isAvailable) {
      Alert.alert('错误', '此设备不支持发送邮件功能');
      return;
    }

    try {
      const htmlBody = `
        <h2 style="color: #0066cc;">HTML 格式邮件测试</h2>
        <p>这是一个<b>HTML</b>格式的<i>邮件</i>。</p>
        <p>可以包含<span style="color: red;">不同颜色</span>的文字。</p>
        <ul>
          <li>项目 1</li>
          <li>项目 2</li>
          <li>项目 3</li>
        </ul>
      `;

      const result = await MailComposer.composeAsync({
        subject: subject,
        body: htmlBody,
        recipients: recipients.split(',').map((email) => email.trim()),
        isHtml: true,
      });

      if (result.status === 'sent') {
        Alert.alert('成功', 'HTML邮件已发送');
      }
    } catch (error) {
      Alert.alert('错误', '发送HTML邮件时发生错误');
      console.error('发送HTML邮件错误:', error);
    }
  };

  // 发送带附件的邮件
  const sendEmailWithAttachment = async () => {
    if (!isAvailable) {
      Alert.alert('错误', '此设备不支持发送邮件功能');
      return;
    }

    try {
      // 注意：在实际应用中，您需要处理文件访问和临时文件创建
      // 这里使用的是示例文件路径，实际使用时需要替换为实际文件路径
      const dummyAttachment = [
        Platform.OS === 'ios'
          ? 'file:///var/mobile/Containers/Data/Application/.../sample.pdf' // iOS 示例路径
          : 'file:///storage/emulated/0/Download/.../sample.pdf', // Android 示例路径
      ];

      const result = await MailComposer.composeAsync({
        subject: subject,
        body: body,
        recipients: recipients.split(',').map((email) => email.trim()),
        attachments: dummyAttachment,
      });

      if (result.status === 'sent') {
        Alert.alert('成功', '带附件的邮件已发送');
      }
    } catch (error) {
      Alert.alert('错误', '发送带附件的邮件时发生错误');
      console.error('发送带附件邮件错误:', error);
    }
  };

  return (
    <ScrollView className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">邮件编辑器</Text>
        <Text className="text-muted-foreground">在应用中创建和发送电子邮件。</Text>
      </View>

      {/* 可用性状态 */}
      <View className="mb-4 flex-row items-center">
        <Text className="text-base mr-2">邮件功能状态:</Text>
        {isAvailable === null ? (
          <Text>正在检查...</Text>
        ) : isAvailable ? (
          <Text className="text-green-500">可用</Text>
        ) : (
          <Text className="text-red-500">不可用</Text>
        )}
      </View>

      {/* 邮件设置表单 */}
      <View className="mb-6">
        <View className="mb-4">
          <Text className="mb-1">收件人:</Text>
          <Input value={recipients} onChangeText={setRecipients} placeholder="输入邮箱地址，多个地址用逗号分隔" />
        </View>

        <View className="mb-4">
          <Text className="mb-1">主题:</Text>
          <Input value={subject} onChangeText={setSubject} placeholder="邮件主题" />
        </View>

        <View className="mb-2">
          <Text className="mb-1">正文:</Text>
          <Textarea
            value={body}
            onChangeText={setBody}
            placeholder="邮件正文"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* 操作按钮区 */}
      <View className="flex-col gap-3">
        <Button onPress={sendSimpleEmail} disabled={!isAvailable}>
          <Text>发送普通邮件</Text>
        </Button>

        <Button onPress={sendHtmlEmail} disabled={!isAvailable} variant="secondary">
          <Text>发送HTML格式邮件</Text>
        </Button>

        <Button onPress={sendEmailWithAttachment} disabled={!isAvailable} variant="outline">
          <Text>发送带附件的邮件</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
