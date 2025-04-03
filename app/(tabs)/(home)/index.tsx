import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />}
    >
      <View className="w-10 h-10 bg-blue-500" />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link
          href={{
            pathname: "/details/[id]",
            params: { id: "bacon", name: "abc" },
          }}
        >
          <ThemedText>View first user details</ThemedText>
        </Link>
        <Link href="/details/2?name=xyz">
          <ThemedText>View second user details</ThemedText>
        </Link>
      </ThemedView>
      <ThemedText type="defaultSemiBold">
        {Platform.select({
          ios: "cmd + d",
          android: "cmd + m",
          web: "F12",
        })}
        &nbsp;to open developer tools.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
