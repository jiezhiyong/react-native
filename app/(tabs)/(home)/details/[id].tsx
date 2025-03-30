import { View, Text, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';

export default function DetailsScreen() {
  const { id, name } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <ThemedText>Details of user {id} {name}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
