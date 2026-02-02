import React from "react";
import { View, StyleSheet } from "react-native";
import HeatMapBackground from "../components/HeatMapBackground";

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <HeatMapBackground />
      </View>

      {/* Foreground content goes here */}
      <View style={styles.content} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
