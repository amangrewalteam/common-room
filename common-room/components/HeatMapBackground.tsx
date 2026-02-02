import React, { useEffect, useMemo, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Defs, Rect, LinearGradient, Stop, G } from "react-native-svg";

const IVORY = "#F6F3EE";

/**
 * Cathedral light overlay (stable + visible)
 * - Numeric viewBox coordinates (consistent on iOS/Android)
 * - Uneven dominance: hero + supports + ghost washes
 * - Multi-stop chroma gradients (stained-glass feel)
 * - Very slow, uneven drift (feels projected, not designed)
 */

export default function HeatMapBackground() {
  // Two independent drifts so it doesn’t feel like one “animation”
  const driftA = useRef(new Animated.Value(0)).current;
  const driftB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.loop(
      Animated.sequence([
        Animated.timing(driftA, {
          toValue: 1,
          duration: 120000, // 2 min
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(driftA, {
          toValue: 0,
          duration: 120000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const b = Animated.loop(
      Animated.sequence([
        Animated.timing(driftB, {
          toValue: 1,
          duration: 180000, // 3 min (different cadence)
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(driftB, {
          toValue: 0,
          duration: 180000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [driftA, driftB]);

  const translateA = driftA.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] });
  const translateB = driftB.interpolate({ inputRange: [0, 1], outputRange: [8, -8] });

  const gradients = useMemo(
    () => [
      // HERO (wide, luminous, slightly warmer)
      {
        id: "gHero",
        stops: [
          { o: "0%", c: "#9EC9FF", a: 0.0 },
          { o: "18%", c: "#BFD7FF", a: 0.34 },
          { o: "46%", c: "#FFD6B0", a: 0.22 },
          { o: "70%", c: "#B4F0D6", a: 0.18 },
          { o: "100%", c: "#9EC9FF", a: 0.0 },
        ],
      },
      // SUPPORT A (sea-glass → pale gold)
      {
        id: "gA",
        stops: [
          { o: "0%", c: "#A8E0C2", a: 0.0 },
          { o: "36%", c: "#D7F7EA", a: 0.22 },
          { o: "62%", c: "#FFF1C1", a: 0.18 },
          { o: "100%", c: "#A8E0C2", a: 0.0 },
        ],
      },
      // SUPPORT B (lavender → cool sky)
      {
        id: "gB",
        stops: [
          { o: "0%", c: "#E6C8FF", a: 0.0 },
          { o: "42%", c: "#F5DEFF", a: 0.20 },
          { o: "74%", c: "#CFE4FF", a: 0.16 },
          { o: "100%", c: "#E6C8FF", a: 0.0 },
        ],
      },
      // SUPPORT C (rose → clear → mint)
      {
        id: "gC",
        stops: [
          { o: "0%", c: "#FFC7D6", a: 0.0 },
          { o: "40%", c: "#FFE2EA", a: 0.16 },
          { o: "62%", c: "#DDF8EE", a: 0.14 },
          { o: "100%", c: "#FFC7D6", a: 0.0 },
        ],
      },
      // GHOST WASH (barely-there warmth)
      {
        id: "gGhost",
        stops: [
          { o: "0%", c: "#FFD6B0", a: 0.0 },
          { o: "55%", c: "#FFE9D6", a: 0.14 },
          { o: "100%", c: "#FFD6B0", a: 0.0 },
        ],
      },
      // MICRO-CAUSTICS (thin shimmer band, super subtle)
      {
        id: "gCaustic",
        stops: [
          { o: "0%", c: "#FFFFFF", a: 0.0 },
          { o: "45%", c: "#FFFFFF", a: 0.08 },
          { o: "55%", c: "#FFFFFF", a: 0.08 },
          { o: "100%", c: "#FFFFFF", a: 0.0 },
        ],
      },
    ],
    []
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base ivory (material) */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: IVORY }]} />

      {/* Drift layer A */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX: translateA }, { translateY: translateB }] },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            {gradients.map((g) => (
              <LinearGradient
                key={g.id}
                id={g.id}
                x1="0"
                y1="0"
                x2="100"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                {g.stops.map((s, i) => (
                  <Stop key={i} offset={s.o} stopColor={s.c} stopOpacity={s.a} />
                ))}
              </LinearGradient>
            ))}
          </Defs>

          {/* HERO beam (dominant) */}
          <G opacity={0.18} transform="rotate(-18 50 50)">
            <Rect x={-55} y={10} width={230} height={20} fill="url(#gHero)" />
          </G>

          {/* Support beams (uneven widths/angles) */}
          <G opacity={0.12} transform="rotate(-30 50 50)">
            <Rect x={-70} y={32} width={260} height={12} fill="url(#gA)" />
          </G>

          <G opacity={0.10} transform="rotate(-9 50 50)">
            <Rect x={-60} y={54} width={230} height={10} fill="url(#gB)" />
          </G>

          <G opacity={0.085} transform="rotate(-22 50 50)">
            <Rect x={-80} y={66} width={280} height={9} fill="url(#gC)" />
          </G>

          {/* Ghost warmth wash (barely visible) */}
          <G opacity={0.06} transform="rotate(-6 50 50)">
            <Rect x={-90} y={72} width={300} height={18} fill="url(#gGhost)" />
          </G>

          {/* Micro-caustics (thin highlight band to break “flatness”) */}
          <G opacity={0.10} transform="rotate(-18 50 50)">
            <Rect x={-40} y={26} width={200} height={3} fill="url(#gCaustic)" />
          </G>
        </Svg>
      </Animated.View>

      {/* Drift layer B (slower, different direction — adds “projected” feel) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateX: translateB }, { translateY: translateA }] },
          { opacity: 0.55 },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Secondary faint beams */}
          <G opacity={0.08} transform="rotate(-14 50 50)">
            <Rect x={-80} y={18} width={280} height={9} fill="url(#gB)" />
          </G>

          <G opacity={0.07} transform="rotate(-34 50 50)">
            <Rect x={-95} y={44} width={320} height={8} fill="url(#gA)" />
          </G>

          <G opacity={0.05} transform="rotate(-4 50 50)">
            <Rect x={-90} y={60} width={300} height={12} fill="url(#gGhost)" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}
