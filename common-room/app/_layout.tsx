import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { AmbientOverlay } from "../components/AmbientOverlay";
import { usePresence } from "../lib/hooks/usePresence";

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

export default function RootLayout() {
  const presence = usePresence("common-room");

  // 🔧 DEBUG: simulate room size here
  // Try: 0, 3, 5, 10, 20
  const DEBUG_FAKE_COUNT = 5;

  // Use fake count in dev, real presence in prod
  const count = __DEV__ ? DEBUG_FAKE_COUNT : presence.count;

  // Full room = 20 people
  const normalized = clamp01(count / 20);

  // Gentle curve so early presence matters more
  const warmth =
    presence.status === "online" || __DEV__
      ? Math.pow(normalized, 0.5)
      : 0;

  return (
    <View style={styles.root}>
      <View style={styles.overlay} pointerEvents="none">
        {/* You can temporarily set intensity={1} while tuning */}
        <AmbientOverlay intensity={0.85} warmth={warmth} />
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