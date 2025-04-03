import { StyleSheet } from "react-native";

import { ThemedText } from "~/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { ThemedView } from "~/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsScreen() {
  const { id, name } = useLocalSearchParams();
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText>
          Details of user {id} {name}
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
