import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import HeatMapBackground from "../components/HeatMapBackground";

const IVORY = "#F6F3EE";

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: "" }} />
      <HeatMapBackground />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IVORY,
  },
});
