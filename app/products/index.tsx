import { Stack, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

function LogoTitle() {
  return <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />;
}

export default function ProductsIndex() {
  const router = useRouter();
  const navigation = useNavigation();
  const [count, setCount] = useState(0);

  // 配置路由选项
  // useEffect(() => {
  //   navigation.setOptions({ headerShown: false });
  // }, [navigation]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My home',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitle: (props) => <LogoTitle {...props} />,
          headerRight: () => <Button onPress={() => setCount((c) => c + 1)} title="Update count" />,
        }}
      />

      <Text>ProductsIndex</Text>
      <Text>Count: {count}</Text>
      <Button title="Go to first screen" onPress={() => router.dismiss(1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
});
