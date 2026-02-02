export const Theme = {
  colors: {
    background: "#0B0F10",
    surface: "rgba(255,255,255,0.06)",
    ambient: "rgba(180,235,220,0.95)",

    // required by existing components
    ivory: "#F6F4EF",
    hairline: "rgba(255,255,255,0.10)",
    inkSoft: "rgba(255,255,255,0.70)",
    deepTeal: "#0C2A2E",
    seaGlass: "#9FD6C2",
    duskBlue: "#0B3A5A",
    amber: "#7A4A2A",
    nocturne: "#07161B",
  },

  radius: {
    pill: 999,
  },

  type: {
    meta: {
      fontSize: 12,
      letterSpacing: 0.4,
    },
  },
} as const;

// Optional alias if you still use THEME elsewhere
export const THEME = Theme.colors;
