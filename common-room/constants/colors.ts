export const Colors = {
  /**
   * Named hues
   * Used ONLY for visual systems (heatmaps, ambient layers, gradients)
   * Never directly for text, borders, or UI semantics
   */
  palette: {
    deepTeal: "#1E3A35",
    seaGlass: "#6F8F87",
    duskBlue: "#2E4A5A",
    amber: "#B78A4A",
    nocturne: "#0F1413",
    ivory: "#E9EFEA",
  },

  /**
   * Semantic UI colors
   * Components should prefer these via Theme.colors
   */
  light: {
    // Surfaces
    background: "#E9EFEA",
    surface: "rgba(233, 239, 234, 0.6)",

    // Text
    text: "#1E2421",
    textMuted: "rgba(30, 36, 33, 0.6)",
    textSubtle: "rgba(30, 36, 33, 0.4)",

    // Ink variants (used by PresencePill, meta text, etc.)
    inkSoft: "rgba(30, 36, 33, 0.75)",
    inkMeta: "rgba(30, 36, 33, 0.4)",

    // Lines
    hairline: "rgba(30, 36, 33, 0.2)",
    divider: "rgba(30, 36, 33, 0.12)",

    // Ambient overlay tint (used at very low opacity)
    ambient: "#6F8F87",
  },
};
