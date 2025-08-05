import localFont from "next/font/local";
import { Rufina, Fraunces, Merriweather, Outfit, JetBrains_Mono, Inter, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

export const RifficFreeBold = localFont({ src: "./local/Riffic Free Bold.woff2", variable: "--font-riffic-bold" });

// Custom Recoleta font
export const recoleta = localFont({ 
  src: "./local/Recoleta Alt SemiBold.otf", 
  variable: "--font-recoleta",
  display: "swap"
});

// Elegant serif headline font
export const rufina = Rufina({ 
  subsets: ["latin"],
  variable: "--font-rufina",
  display: "swap",
  weight: ["400", "700"]
});

// Monospace font for numerical data
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "700"]
});

// Sophisticated serif with style variations
export const fraunces = Fraunces({ 
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap" 
});

// Classic serif for body text
export const merriweather = Merriweather({ 
  subsets: ["latin"],
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  display: "swap" 
});

// Modern sans-serif for UI elements
export const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap"
});

// Clean SaaS aesthetic font
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"]
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["400", "700"]
});

export const spaceGroteskBold = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk-bold",
  display: "swap",
  weight: ["700"]
});
