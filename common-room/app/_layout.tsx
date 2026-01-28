import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { AmbientOverlay } from "../components/AmbientOverlay";

export default function RootLayout() {
  return (
    <View style={styles.root}>
      <View style={styles.overlay} pointerEvents="none">
        <AmbientOverlay />
      </View>

      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
