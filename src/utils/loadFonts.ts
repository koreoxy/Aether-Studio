/**
 * Loads the three production fonts via @remotion/fonts.
 * Called once at module scope; render is blocked until fonts resolve.
 *
 * Montserrat      — primary graphic typography (variable, 100–900)
 * Architects Da.  — handwritten editorial accents
 * Poppins         — spoken-word karaoke subtitles only
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const registerProductionFonts = (): void => {
  // Montserrat variable font — covers Medium through Black
  loadFont({
    family: "Montserrat",
    url: staticFile("assets/fonts/Montserrat-VariableFont_wght.ttf"),
    weight: "100 900",
    display: "block",
    format: "truetype",
  }).catch((err) => console.error("Montserrat failed to load", err));

  // Architects Daughter — handwritten accents
  loadFont({
    family: "Architects Daughter",
    url: staticFile("assets/fonts/ArchitectsDaughter-Regular.ttf"),
    weight: "400",
    display: "block",
    format: "truetype",
  }).catch((err) => console.error("Architects Daughter failed to load", err));

  // Poppins — subtitle family (3 weights)
  loadFont({
    family: "Poppins",
    url: staticFile("assets/fonts/Poppins-Medium.ttf"),
    weight: "500",
    display: "block",
    format: "truetype",
  }).catch((err) => console.error("Poppins Medium failed to load", err));

  loadFont({
    family: "Poppins",
    url: staticFile("assets/fonts/Poppins-SemiBold.ttf"),
    weight: "600",
    display: "block",
    format: "truetype",
  }).catch((err) => console.error("Poppins SemiBold failed to load", err));

  loadFont({
    family: "Poppins",
    url: staticFile("assets/fonts/Poppins-Bold.ttf"),
    weight: "700",
    display: "block",
    format: "truetype",
  }).catch((err) => console.error("Poppins Bold failed to load", err));
};
