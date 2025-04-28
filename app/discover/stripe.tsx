import { Ionicons } from '@expo/vector-icons';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 注意：实际使用时需要替换为你的 Stripe 发布密钥
const STRIPE_PUBLISHABLE_KEY = 'your_publishable_key';

function PaymentForm() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [amount, setAmount] = useState('10');
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      // 这里应该调用你的后端 API 来创建支付会话
      // 示例代码，实际使用时需要替换为你的后端 API
      const response = await fetch('your_backend_api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // 转换为分
          currency: 'usd',
        }),
      });

      const { paymentIntent, ephemeralKey, customer } = await response.json();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Your App Name',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
      });

      if (error) {
        Alert.alert('错误', error.message);
      }
    } catch (error) {
      Alert.alert('错误', '初始化支付失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert('错误', error.message);
      } else {
        Alert.alert('成功', '支付成功！');
      }
    } catch (error) {
      Alert.alert('错误', '支付失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 p-6">
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">Stripe 支付</Text>
        <Text className="text-gray-600 mb-4">此功能展示了如何使用 Stripe 进行支付。</Text>
      </View>

      {/* 支付金额输入 */}
      <View className="mb-8">
        <Text className="text-base font-semibold mb-4">支付金额</Text>
        <View className="flex-row items-center">
          <Text className="text-2xl mr-2">$</Text>
          <TextInput
            className="flex-1 border border-gray-300 rounded-lg p-3"
            placeholder="输入金额"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
      </View>

      {/* 支付按钮 */}
      <View className="mb-8">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={initializePaymentSheet}
          disabled={loading}
        >
          <Ionicons name="card" size={20} color="white" />
          <Text className="text-white ml-2">{loading ? '处理中...' : '初始化支付'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 rounded-lg p-4 flex-row items-center justify-center mt-4"
          onPress={handlePayment}
          disabled={loading}
        >
          <Ionicons name="wallet" size={20} color="white" />
          <Text className="text-white ml-2">{loading ? '处理中...' : '确认支付'}</Text>
        </TouchableOpacity>
      </View>

      {/* 说明区域 */}
      <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-base font-semibold mb-2">使用说明</Text>
        <Text className="text-gray-600">
          1. 支持信用卡支付
          {'\n'}2. 支持 Apple Pay/Google Pay
          {'\n'}3. 支持多种货币
          {'\n'}4. 支持支付状态反馈
        </Text>
      </View>

      <View className="mt-6">
        <Text className="text-sm text-gray-500">
          注意：
          {'\n'}1. 需要安装 @stripe/stripe-react-native
          {'\n'}2. 需要配置 Stripe 密钥
          {'\n'}3. 需要后端 API 支持
          {'\n'}4. 测试时使用测试密钥
        </Text>
      </View>
    </ScrollView>
  );
}

export default function ExpoStripeScreen() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <PaymentForm />
    </StripeProvider>
  );
}
