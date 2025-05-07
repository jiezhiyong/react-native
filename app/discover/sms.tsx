import * as SMS from 'expo-sms';
import { useState } from 'react';
import { Alert, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';

export default function ExpoSmsScreen() {
  const [phoneNumber, setPhoneNumber] = useState('17302170907');
  const [message, setMessage] = useState('有内鬼，终止交易');

  const sendSMS = async () => {
    try {
      const { result } = await SMS.sendSMSAsync([phoneNumber], message);

      if (result === 'sent') {
        Alert.alert('成功', '短信已发送');
      }
    } catch (error: any) {
      Alert.alert('错误', error?.message);
      console.error(error);
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">短信</Text>
        <Text className="text-muted-foreground">在应用中发送和处理短信。</Text>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">手机号</Text>
        <Input
          placeholder="请输入手机号码"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-6">
        <Text className="text-lg font-medium mb-2">内容</Text>
        <Textarea placeholder="请输入短信内容" value={message} onChangeText={setMessage} />
      </View>

      <Button onPress={sendSMS}>
        <Text>发送短信</Text>
      </Button>
    </View>
  );
}
