import React from "react";
import { View, type ViewProps } from "react-native";
import { Theme } from "../constants/theme";

type Props = ViewProps & {
  /**
   * Optional semantic surface:
   * - "background" (default)
   * - "surface" (slightly frosted)
   */
  tone?: "background" | "surface";
};

export function ThemedView({ style, tone = "background", ...props }: Props) {
  const backgroundColor =
    tone === "surface" ? Theme.colors.surface : Theme.colors.background;

  return <View {...props} style={[{ backgroundColor }, style]} />;
}
