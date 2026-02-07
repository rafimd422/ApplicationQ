export const theme = {
  colors: {
    primary: "#4F46E5",
    primaryLight: "#818CF8",
    primaryDark: "#3730A3",
    primaryFaded: "rgba(79, 70, 229, 0.1)",

    background: "#F7F8FA",
    surface: "#FFFFFF",
    surfaceHover: "#F3F4F6",

    text: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",

    success: "#10B981",
    successLight: "rgba(16, 185, 129, 0.1)",
    warning: "#F59E0B",
    warningLight: "rgba(245, 158, 11, 0.1)",
    error: "#EF4444",
    errorLight: "rgba(239, 68, 68, 0.1)",
    info: "#3B82F6",
    infoLight: "rgba(59, 130, 246, 0.1)",

    border: "#E5E7EB",
    borderDark: "#D1D5DB",
  },

  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
  },

  radii: {
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Fira Code', 'Consolas', monospace",
  },

  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  transitions: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "350ms ease",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },

  zIndices: {
    dropdown: 100,
    modal: 200,
    toast: 300,
  },
} as const;

export type Theme = typeof theme;
