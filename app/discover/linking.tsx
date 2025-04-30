// https://docs.expo.dev/versions/latest/sdk/linking/
import * as Linking from 'expo-linking';
import { Alert, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

export default function ExpoLinkingScreen() {
  // 打开网页链接
  const openWebUrl = async () => {
    const url = 'https://expo.dev';
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('错误', `无法打开URL: ${url}`);
    }
  };

  // 打开电话
  const openPhone = async () => {
    const phoneNumber = 'tel:+123456789';
    try {
      const supported = await Linking.canOpenURL(phoneNumber);
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        Alert.alert('错误', '设备不支持拨打电话');
      }
    } catch (e) {
      Alert.alert('错误', '无法打开电话应用');
    }
  };

  // 打开邮件
  const openEmail = async () => {
    const email = 'mailto:example@example.com?subject=测试邮件&body=这是一封测试邮件';
    try {
      const supported = await Linking.canOpenURL(email);
      if (supported) {
        await Linking.openURL(email);
      } else {
        Alert.alert('错误', '设备不支持邮件功能');
      }
    } catch (e) {
      Alert.alert('错误', '无法打开邮件应用');
    }
  };

  // 检查URL是否可以打开
  const checkCanOpenUrl = async () => {
    const url = 'https://expo.dev';
    try {
      const supported = await Linking.canOpenURL(url);
      Alert.alert('检查结果', supported ? '可以打开' : '不能打开');
    } catch (e) {
      Alert.alert('错误', '检查URL是否可以打开时出错');
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">链接处理</Text>
        <Text className="text-muted-foreground">处理深层链接和与其他应用的交互。</Text>
      </View>

      <View className="flex-col gap-3">
        <View>
          <Button className="flex-row justify-center items-center space-x-2" onPress={openWebUrl}>
            <Text>打开网页 (expo.dev)</Text>
          </Button>
        </View>

        <View>
          <Button className="flex-row justify-center items-center space-x-2" onPress={openPhone}>
            <Text>拨打电话</Text>
          </Button>
        </View>

        <View>
          <Button className="flex-row justify-center items-center space-x-2" onPress={openEmail}>
            <Text>发送邮件</Text>
          </Button>
        </View>

        <View>
          <Button className="flex-row justify-center items-center space-x-2" onPress={checkCanOpenUrl}>
            <Text>检查URL是否可以打开</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
