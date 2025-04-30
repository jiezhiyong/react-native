// import {
//   confirmPlatformPayPayment,
//   isPlatformPaySupported,
//   PlatformPay,
//   PlatformPayButton,
//   StripeProvider,
//   useStripe,
// } from '@stripe/stripe-react-native';
// import { useState } from 'react';
// import { ActivityIndicator, Alert, View } from 'react-native';

// import { Button } from '~/components/ui/button';
// import { Text } from '~/components/ui/text';
// import { useEffectAsync } from '~/hooks/use-effect-async';

// export default function ExpoStripeScreen() {
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();

//   const [publishableKey, setPublishableKey] = useState('');
//   const [isApplePaySupported, setIsApplePaySupported] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const fetchPublishableKey = async () => {
//     const response = await fetch('/create-payment-intent+api', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     const res = await response.json();
//     setPublishableKey(res.publishableKey);
//   };

//   useEffectAsync(async () => {
//     fetchPublishableKey();
//     const status = await isPlatformPaySupported();
//     setIsApplePaySupported(status);
//   }, []);

//   const initializePaymentSheet = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/create-payment-intent+api', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           some: 'value',
//         }),
//       });

//       const { paymentIntent, ephemeralKey, customer } = await response.json();

//       const { error } = await initPaymentSheet({
//         merchantDisplayName: 'Your App Name',
//         customerId: customer,
//         customerEphemeralKeySecret: ephemeralKey,
//         paymentIntentClientSecret: paymentIntent,
//         allowsDelayedPaymentMethods: true,
//       });

//       if (error) {
//         Alert.alert('错误', error.message);
//       }
//     } catch (error) {
//       Alert.alert('错误', (error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePayment = async () => {
//     try {
//       setLoading(true);
//       const { error } = await presentPaymentSheet();

//       if (error) {
//         Alert.alert('错误', error.message);
//       } else {
//         Alert.alert('成功', '支付成功！');
//       }
//     } catch (error) {
//       Alert.alert('错误', (error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPaymentIntentClientSecret = async () => {
//     const response = await fetch('/create-payment-intent+api', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         some: 'value',
//       }),
//     });
//     const { clientSecret } = await response.json();

//     return clientSecret;
//   };

//   const pay = async () => {
//     const clientSecret = await fetchPaymentIntentClientSecret();
//     const { error } = await confirmPlatformPayPayment(clientSecret, {
//       applePay: {
//         cartItems: [
//           {
//             label: 'Example item name',
//             amount: '14.00',
//             paymentType: PlatformPay.PaymentType.Immediate,
//           },
//           {
//             label: 'Total',
//             amount: '12.75',
//             paymentType: PlatformPay.PaymentType.Immediate,
//           },
//         ],
//         merchantCountryCode: 'CN',
//         currencyCode: 'CNY',
//         requiredShippingAddressFields: [PlatformPay.ContactField.PostalAddress],
//         requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
//       },
//     });
//     if (error) {
//       Alert.alert('错误', error.message);
//     } else {
//       Alert.alert('Success', 'Check the logs for payment intent details.');
//       console.log(JSON.stringify(paymentIntent, null, 2));
//     }
//   };

//   return (
//     <StripeProvider publishableKey={publishableKey} merchantIdentifier="merchant.com.jiezhiyong.qachat">
//       <View className="flex-1 p-5">
//         <View className="mb-6">
//           <Text className="text-2xl font-bold mb-2">Stripe 支付</Text>
//           <Text className="text-muted-foreground">使用 Stripe 进行支付</Text>
//         </View>

//         <View className="gap-3">
//           <PlatformPayButton
//             // disabled={!isApplePaySupported}
//             onPress={pay}
//             type={PlatformPay.ButtonType.Order}
//             appearance={PlatformPay.ButtonStyle.Black}
//             borderRadius={4}
//             style={{
//               width: '100%',
//               height: 50,
//             }}
//           />

//           <Button onPress={initializePaymentSheet} disabled={loading}>
//             {loading ? <ActivityIndicator /> : <Text>初始化支付</Text>}
//           </Button>

//           <Button onPress={handlePayment} disabled={loading}>
//             {loading ? <ActivityIndicator /> : <Text>确认支付 (0.01 RMB)</Text>}
//           </Button>
//         </View>
//       </View>
//     </StripeProvider>
//   );
// }
