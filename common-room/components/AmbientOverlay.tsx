import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

export function AmbientOverlay() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="ivoryGlow" cx="50" cy="34" r="78" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <Stop offset="55%" stopColor="#F6F3EE" stopOpacity="0.02" />
            <Stop offset="100%" stopColor="#EDE8E0" stopOpacity="0.07" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#ivoryGlow)" />
      </Svg>
    </View>
  );
}
