import { useEffect, useMemo, useState } from "react";
import * as Location from "expo-location";
import SunCalc from "suncalc";

type SunDir = {
  dx: number; // -1..1
  dy: number; // -1..1
  ok: boolean;
};

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function useSunDirection(): SunDir {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [headingDeg, setHeadingDeg] = useState<number | null>(null);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    (async () => {
      // Location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });

      // Heading (compass)
      // On some devices this needs location services enabled; handle null gracefully.
      sub = await Location.watchHeadingAsync((h) => {
        if (typeof h.trueHeading === "number" && h.trueHeading >= 0) setHeadingDeg(h.trueHeading);
        else if (typeof h.magHeading === "number") setHeadingDeg(h.magHeading);
      });
    })();

    return () => {
      sub?.remove();
    };
  }, []);

  return useMemo(() => {
    // Fallback: pretty default direction (top-left -> bottom-right)
    if (!coords || headingDeg == null) return { dx: 0.7, dy: 0.7, ok: false };

    const now = new Date();
    const sunPos = SunCalc.getPosition(now, coords.lat, coords.lon);

    // SunCalc azimuth is radians from south, clockwise, negative west; we’ll convert to degrees-from-north style.
    // A simple working conversion:
    const azimuthRad = sunPos.azimuth;
    const azFromNorthRad = azimuthRad + Math.PI; // shift to 0..2pi-ish

    // Relative to where the phone is facing:
    const phoneHeadingRad = degToRad(headingDeg);
    const rel = azFromNorthRad - phoneHeadingRad;

    // Convert angle to a vector. We want “light coming FROM the sun”, i.e. direction from edge toward center.
    // In screen coords: +x right, +y down. So:
    const dx = Math.cos(rel);
    const dy = Math.sin(rel);

    // Normalize and clamp a bit
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { dx: clamp(dx / len, -1, 1), dy: clamp(dy / len, -1, 1), ok: true };
  }, [coords, headingDeg]);
}
