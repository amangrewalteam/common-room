import React from "react";
import { View, StyleSheet } from "react-native";
import { Theme } from "../constants/theme";

type PresencePillProps = {
  count: number;
};

export function PresencePill({ count }: PresencePillProps) {
  // Clamp count so visuals stay calm
  const visibleCount = Math.max(0, Math.min(count, 12));

  // If only you (or nobody), show nothing
  if (visibleCount <= 1) return null;

  return (
    <View style={styles.container}>
      {Array.from({ length: visibleCount }).map((_, i) => (
        <View key={i} style={styles.dot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Theme.colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.colors.ambient,
    opacity: 0.85,
  },
});
