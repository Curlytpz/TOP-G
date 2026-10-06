// Traced from the approved TOP-G logo source (2048px canvas, y-down).
// Array order is the scroll-build order.
export const PIECES = [
  [[429, 784], [539, 914], [751, 914], [831, 786]],
  [[560, 948], [637, 1071], [723, 951]],
  [[875, 779], [658, 1104], [1011, 1649], [1480, 948], [1191, 948], [1118, 1070], [1221, 1074], [1002, 1390], [821, 1135], [1035, 780]],
  [[868, 1138], [953, 1247], [1157, 917], [1505, 917], [1626, 784], [1081, 784], [1007, 911], [1094, 912], [977, 959]],
];

export const CENTER = { x: 1027, y: 1215 };
export const SCALE = 100;
export const DISC_RADIUS = 9;

export const HERO_THEME = {
  dark: {
    background: "#070707",
    gridLine: "rgba(255, 255, 255, 0.03)",
    label: "#666666",
    headline: "#ffffff",
    paragraph: "#aaaaaa",
    ghostOutline: 0x555555,
    wireframeEdge: 0xffffff,
    pieceFill: 0xe31b23,
    discEmissive: 0x2a2a2a,
    discEdge: 0xffffff,
    discEdgeCss: "#ffffff",
    discEdgeOpacity: 0,
    redGlowOpacity: 1,
    shadowOpacity: 0,
    fallbackShadow: "drop-shadow(0 0 50px rgba(227, 27, 35, 0.24))",
    ambientIntensity: 1.73,
    keyIntensity: 2.83,
    rimIntensity: 1.88,
  },
  light: {
    background: "#f6f6f4",
    gridLine: "rgba(0, 0, 0, 0.06)",
    label: "#6b6b6b",
    headline: "#0b0b0b",
    paragraph: "#4b4b4b",
    ghostOutline: 0x8a8a8a,
    wireframeEdge: 0x111111,
    pieceFill: 0xe31b23,
    discEmissive: 0x000000,
    discEdge: 0xd4d4d4,
    discEdgeCss: "#d4d4d4",
    discEdgeOpacity: 1,
    redGlowOpacity: 0,
    shadowOpacity: 0.72,
    fallbackShadow: "drop-shadow(12px 16px 22px rgba(0, 0, 0, 0.26))",
    ambientIntensity: 2.08,
    keyIntensity: 2.5,
    rimIntensity: 0.92,
  },
};