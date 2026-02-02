import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width: W, height: H } = Dimensions.get("window");

type Props = {
  /** Direction of light in screen space (-1..1). Defaults feel like sun from upper-left */
  sunDx?: number;
  sunDy?: number;

  /** Overall intensity (0..1). Keep restrained. */
  intensity?: number;
};

/**
 * PrismLightOverlay
 *
 * Renders discrete, projected stained-glass light patches
 * that sit ON TOP of an ivory surface.
 *
 * This is NOT a background wash or gradient.
 * Think: cathedral window sunlight on stone.
 */
export function PrismLightOverlay({
  sunDx = 0.75,
  sunDy = 0.55,
  intensity = 0.75,
}: Props) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 220_000, // very slow
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [t]);

  /** Directional sweep */
  const sweep = t.interpolate({
    inputRange: [0, 1],
    outputRange: [-1, 1],
  });

  const sweepX = Animated.multiply(sweep, sunDx * 140);
  const sweepY = Animated.multiply(sweep, sunDy * 140);

  /** Tiny shimmer so patches don’t feel static */
  const shimmer = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.96, 1.02, 0.96],
  });

  /** Deterministic pseudo-random */
  function rand(seed: number) {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  }

  /** Build light patches once */
  const patches = useMemo(() => {
    const COLORS = [
      "rgba(255, 240, 210, 1)", // warm sun
      "rgba(255, 190, 120, 1)", // amber
      "rgba(160, 210, 255, 1)", // blue
      "rgba(200, 170, 255, 1)", // violet
      "rgba(170, 255, 215, 1)", // green
    ];

    const count = 8; // fewer = more sacred

    return Array.from({ length: count }).map((_, i) => {
      const r1 = rand(i + 1);
      const r2 = rand(i * 13 + 7);
      const r3 = rand(i * 29 + 11);

      const base = W * (0.22 + r1 * 0.18);
      const w = base * (1.15 + r2 * 0.5);
      const h = base * (0.55 + r3 * 0.25);

      const x = W * (0.15 + r1 * 0.7) - w / 2;
      const y = H * (0.18 + r2 * 0.6) - h / 2;

      const rot = -20 + r3 * 40;

      const color = COLORS[i % COLORS.length];

      return {
        key: i,
        x,
        y,
        w,
        h,
        rot,
        color,
        opacity: 0.22 * intensity,
        coreOpacity: 0.18 * intensity,
        shardOpacity: 0.14 * intensity,
      };
    });
  }, [intensity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          transform: [{ translateX: sweepX }, { translateY: sweepY }],
        },
      ]}
    >
      {patches.map((p) => (
        <Animated.View
          key={p.key}
          style={[
            styles.patchWrap,
            {
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.h,
              transform: [{ rotate: `${p.rot}deg` }, { scale: shimmer }],
            },
          ]}
        >
          {/* Base stained glass color */}
          <View
            style={[
              styles.patch,
              {
                backgroundColor: p.color,
                opacity: p.opacity,
              },
            ]}
          />

          {/* Refracted shard */}
          <View
            style={[
              styles.shard,
              {
                backgroundColor: p.color,
                opacity: p.shardOpacity,
                left: p.w * 0.12,
                top: p.h * 0.52,
                width: p.w * 0.45,
                height: p.h * 0.32,
              },
            ]}
          />

          {/* Sun hot core */}
          <View
            style={[
              styles.core,
              {
                opacity: p.coreOpacity,
                left: p.w * 0.34,
                top: p.h * 0.28,
                width: p.w * 0.28,
                height: p.h * 0.38,
              },
            ]}
          />
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },

  patchWrap: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 999,
  },

  patch: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },

  shard: {
    position: "absolute",
    borderRadius: 999,
  },

  core: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 250, 235, 1)",
  },
});
