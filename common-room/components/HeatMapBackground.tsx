// components/HeatMapBackground.tsx
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, Rect, Ellipse, RadialGradient, Stop, G } from "react-native-svg";

const IVORY = "#F6F3EE";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  const to2 = (x: number) => x.toString(16).padStart(2, "0");
  return `#${to2(clamp(Math.round(r), 0, 255))}${to2(
    clamp(Math.round(g), 0, 255)
  )}${to2(clamp(Math.round(b), 0, 255))}`;
}

function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const tt = clamp(t, 0, 1);
  return rgbToHex(
    A.r + (B.r - A.r) * tt,
    A.g + (B.g - A.g) * tt,
    A.b + (B.b - A.b) * tt
  );
}

function makeRng(seedStart: number) {
  let seed = seedStart;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function getDayProgress01(date: Date) {
  const seconds =
    date.getHours() * 3600 +
    date.getMinutes() * 60 +
    date.getSeconds() +
    date.getMilliseconds() / 1000;
  return seconds / 86400;
}

function getDriftPalette(p01: number) {
  const base = {
    ivory: IVORY,
    coolA: "#BFD6FF",
    coolB: "#A9C6FF",
    coolC: "#B7E1FF",
    teal: "#9AD9D0",
    green: "#BDE7C5",
    amber: "#F2C78B",
    rose: "#F3B7C3",
    violet: "#C9B7F6",
  };

  const nightCurve = Math.sin((p01 + 0.15) * Math.PI * 2) * 0.5 + 0.5;
  const night = clamp(nightCurve * 0.22, 0, 0.22);

  const warmCurve = Math.sin((p01 - 0.1) * Math.PI * 2) * 0.5 + 0.5;
  const warm = clamp(warmCurve * 0.12, 0, 0.12);

  const coolTarget = "#B7C7F2";
  const warmTarget = "#F0D1A8";

  return {
    ...base,
    coolA: mixHex(base.coolA, coolTarget, night),
    coolB: mixHex(base.coolB, coolTarget, night),
    coolC: mixHex(base.coolC, coolTarget, night),
    teal: mixHex(base.teal, coolTarget, night * 0.7),
    green: mixHex(base.green, coolTarget, night * 0.55),
    violet: mixHex(base.violet, coolTarget, night * 0.85),
    rose: mixHex(base.rose, warmTarget, warm * 0.6),
    amber: mixHex(base.amber, warmTarget, warm * 0.9),
  };
}

type Field = {
  key: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rot: number;
  opacity: number;
};

export default function HeatMapBackground() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const dayProgress = getDayProgress01(now);
  const palette = useMemo(() => getDriftPalette(dayProgress), [dayProgress]);

  const rainbowDrift = useMemo(() => {
    const phase = dayProgress * Math.PI * 2;
    return {
      dx: Math.sin(phase) * 4,
      dy: Math.cos(phase * 0.85) * 3,
    };
  }, [dayProgress]);

  const fields = useMemo<Field[]>(() => {
    const rng = makeRng(42);

    const specs: Field[] = [
      {
        key: "wallGlow",
        cx: 64 + rng() * 10,
        cy: 12 + rng() * 10,
        rx: 92 + rng() * 18,
        ry: 74 + rng() * 16,
        rot: -10 + rng() * 10,
        opacity: 0.145,
      },
      {
        key: "floorGlow",
        cx: 58 + rng() * 10,
        cy: 90 + rng() * 10,
        rx: 98 + rng() * 18,
        ry: 76 + rng() * 16,
        rot: 8 + rng() * 10,
        opacity: 0.125,
      },
      {
        key: "rainbowSweep",
        cx: 82 + rng() * 12,
        cy: 54 + rng() * 12,
        rx: 88 + rng() * 18,
        ry: 72 + rng() * 18,
        rot: -18 + rng() * 12,
        // ✅ stronger so you can actually see it
        opacity: 0.22,
      },
      {
        key: "cornerLift",
        cx: 8 + rng() * 10,
        cy: 10 + rng() * 14,
        rx: 84 + rng() * 14,
        ry: 66 + rng() * 16,
        rot: 22 + rng() * 10,
        opacity: 0.095,
      },
    ];

    return specs.map((s, i) => {
      const r1 = rng();
      const r2 = rng();
      const r3 = rng();
      return {
        ...s,
        cx: s.cx + (r1 - 0.5) * 6,
        cy: s.cy + (r2 - 0.5) * 6,
        rx: s.rx * (0.95 + r3 * 0.1),
        ry: s.ry * (0.95 + r1 * 0.1),
        // Allow a slightly higher cap than before
        opacity: clamp(s.opacity * (0.92 + r2 * 0.16), 0.06, 0.24),
        key: `${s.key}-${i}`,
      };
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="gWall" cx="62" cy="18" r="62" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={palette.ivory} stopOpacity="0.46" />
            <Stop offset="34%" stopColor={palette.coolB} stopOpacity="0.36" />
            <Stop offset="68%" stopColor={palette.coolA} stopOpacity="0.16" />
            <Stop offset="100%" stopColor={palette.ivory} stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="gFloor" cx="60" cy="82" r="70" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={palette.ivory} stopOpacity="0.42" />
            <Stop offset="44%" stopColor={palette.teal} stopOpacity="0.32" />
            <Stop offset="78%" stopColor={palette.coolC} stopOpacity="0.14" />
            <Stop offset="100%" stopColor={palette.ivory} stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="gRainbow" cx="76" cy="52" r="62" gradientUnits="userSpaceOnUse">
            {/* keep core restrained so it stays "light" */}
            <Stop offset="0%" stopColor={palette.coolA} stopOpacity="0.44" />
            <Stop offset="18%" stopColor={palette.violet} stopOpacity="0.62" />
            {/* ✅ stronger mid-spectrum */}
            <Stop offset="36%" stopColor={palette.rose} stopOpacity="0.52" />
            <Stop offset="54%" stopColor={palette.amber} stopOpacity="0.40" />
            <Stop offset="72%" stopColor={palette.green} stopOpacity="0.36" />
            <Stop offset="88%" stopColor={palette.teal} stopOpacity="0.32" />
            <Stop offset="100%" stopColor={palette.ivory} stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="gLift" cx="10" cy="10" r="62" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={palette.ivory} stopOpacity="0.34" />
            <Stop offset="55%" stopColor={palette.coolC} stopOpacity="0.14" />
            <Stop offset="100%" stopColor={palette.ivory} stopOpacity="0" />
          </RadialGradient>

          {/* subtle cool veil to keep everything airy without whitening it out */}
          <RadialGradient id="gCoolVeil" cx="55" cy="45" r="85" gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor={palette.coolC} stopOpacity="0.10" />
            <Stop offset="100%" stopColor={palette.ivory} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Base */}
        <Rect x="0" y="0" width="100" height="100" fill={palette.ivory} />

        <G>
          <Ellipse
            cx={fields[0].cx}
            cy={fields[0].cy}
            rx={fields[0].rx}
            ry={fields[0].ry}
            fill="url(#gWall)"
            opacity={fields[0].opacity}
            transform={`rotate(${fields[0].rot} ${fields[0].cx} ${fields[0].cy})`}
          />
          <Ellipse
            cx={fields[1].cx}
            cy={fields[1].cy}
            rx={fields[1].rx}
            ry={fields[1].ry}
            fill="url(#gFloor)"
            opacity={fields[1].opacity}
            transform={`rotate(${fields[1].rot} ${fields[1].cx} ${fields[1].cy})`}
          />
          <Ellipse
            cx={fields[2].cx + rainbowDrift.dx}
            cy={fields[2].cy + rainbowDrift.dy}
            rx={fields[2].rx}
            ry={fields[2].ry}
            fill="url(#gRainbow)"
            opacity={fields[2].opacity}
            transform={`rotate(${fields[2].rot} ${fields[2].cx} ${fields[2].cy})`}
          />
          <Ellipse
            cx={fields[3].cx}
            cy={fields[3].cy}
            rx={fields[3].rx}
            ry={fields[3].ry}
            fill="url(#gLift)"
            opacity={fields[3].opacity}
            transform={`rotate(${fields[3].rot} ${fields[3].cx} ${fields[3].cy})`}
          />

          {/* gentle overall cool air (doesn't erase color like an ivory veil did) */}
          <Rect x="0" y="0" width="100" height="100" fill="url(#gCoolVeil)" opacity="0.55" />
        </G>
      </Svg>
    </View>
  );
}
