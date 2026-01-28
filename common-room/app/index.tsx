import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Common Room</Text>
      <Text style={styles.subtitle}>
        A quiet place to be together.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: "center",
  },
});
