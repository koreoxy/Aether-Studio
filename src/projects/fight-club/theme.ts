/**
 * Interstellar production — visual theme.
 * Palette follows the Aether-Studio house system:
 * dark mode: background #213057 / typography #C7D7FF, red used selectively.
 * Support colors are extracted from the papercut collage assets used in this video.
 */
export type ThemeMode = "dark" | "light";

export const COLORS = {
  /** house dark-mode background */
  navy: "#213057",
  /** house dark-mode typography / light-mode background */
  cream: "#C7D7FF",
  /** selective accent */
  red: "#E8433A",
  /** support color extracted from the papercut collage assets */
  gold: "#D9A441",
  white: "#FFFFFF",
  black: "#000000",
  /** soft shadow for card elevation on navy */
  shadow: "rgba(10, 18, 40, 0.45)",
} as const;

/** Theme surfaces — switchable per composition. */
export const DARK_THEME = {
  mode: "dark" as ThemeMode,
  /** house navy — same value as background, exposed for card fills/borders */
  navy: COLORS.navy,
  background: COLORS.navy,
  text: COLORS.cream,
  textSecondary: "rgba(199, 215, 255, 0.62)",
  accent: COLORS.red,
  panelAlt: COLORS.cream,
  panelAltText: COLORS.navy,
};

/** Montserrat ExtraBold — primary graphic typography */
export const FONT_PRIMARY = "Montserrat";
/** Architects Daughter — handwritten editorial accents */
export const FONT_SECONDARY = "Architects Daughter";
/** Poppins — spoken-word subtitles only */
export const FONT_SUBTITLE = "Poppins";

export const FONTS = {
  primary: FONT_PRIMARY,
  secondary: FONT_SECONDARY,
  subtitle: FONT_SUBTITLE,
} as const;
