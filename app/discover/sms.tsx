import { Ionicons } from '@expo/vector-icons';
import * as SMS from 'expo-sms';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExpoSmsScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const sendSMS = async () => {
    try {
      const { result } = await SMS.sendSMSAsync(
        [phoneNumber],
        message
      );

      if (result === 'sent') {
        Alert.alert('成功', '短信已发送');
      } else {
        Alert.alert('提示', '短信发送失败');
      }
    } catch (error) {
      Alert.alert('错误', '发送短信时出错');
      console.error(error);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">发送短信</Text>
        <Text className="text-gray-600 mb-4">
          使用 Expo SMS API 发送短信。请注意，此功能需要设备支持短信功能。
        </Text>
      </View>

      <View className="mb-4">
        <Text className="text-base mb-2">手机号码</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3"
          placeholder="请输入手机号码"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-6">
        <Text className="text-base mb-2">短信内容</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 h-32"
          placeholder="请输入短信内容"
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
        onPress={sendSMS}
      >
        <Ionicons name="send" size={20} color="white" />
        <Text className="text-white ml-2 text-lg">发送短信</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
