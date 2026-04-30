import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useAuth } from '@/store/auth';

export default function ProtectedBill() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>受保护的主页</Text>
      <Text style={styles.description}>这是一个受保护的页面，只有登录后才能访问。</Text>

      <Pressable
        style={styles.button}
        onPress={() => {
          signOut();
        }}
      >
        <Text style={styles.buttonText}>退出登录</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f4ed',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#141413',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#5e5d59',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#c96442',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: '#faf9f5',
    fontSize: 16,
    fontWeight: '500',
  },
});
