import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "riffic-free": ["var(--font-riffic-bold)", "monospace"],
        "playfair": ["var(--font-playfair)", "serif"],
        "cormorant": ["var(--font-cormorant)", "serif"],
        "lora": ["var(--font-lora)", "serif"],
        "montserrat": ["var(--font-montserrat)", "sans-serif"],
        "rufina": ["var(--font-rufina)", "serif"],
        "fraunces": ["var(--font-fraunces)", "serif"],
        "merriweather": ["var(--font-merriweather)", "serif"],
        "outfit": ["var(--font-outfit)", "sans-serif"],
        "recoleta": ["var(--font-recoleta)", "serif"],
        "ibm-plex-mono": ["var(--font-ibm-plex-mono)", "monospace"],
        "space-grotesk-bold": ["var(--font-space-grotesk-bold)", "sans-serif"],
      },
      boxShadow: {
        retro: "0 5px 0 0 rgba(0, 0, 0, 1)",
        "retro-thin": "0 3px 0 0 rgba(0, 0, 0, 1)",
        "retro-right": "3px 4px 0 0 rgba(0, 0, 0, 1)",
        "retro-left": "-3px 4px 0 0 rgba(0, 0, 0, 1)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        black: {
          DEFAULT: "hsl(var(--black))",
          foreground: "hsl(var(--foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-50px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        progress: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "50%": {
            transform: "translateX(0%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards var(--animation-delay, 0ms)",
        "fade-left": "fade-left 0.7s ease-out forwards var(--animation-delay, 0ms)",
        "progress": "progress 2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addBase, addComponents }) {
      addComponents({
        ".shadow-retro-thin": {
          boxShadow: "3px 3px 0 0 rgba(0, 0, 0, 1)",
        },
        ".shadow-retro-thin-hover": {
          "&:hover": {
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
            transform: "translate(1px, 1px)",
          },
        },
        ".shadow-retro-thin-add": {
          boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
        },
        ".shadow-retro-thin-add-hover": {
          "&:hover": {
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            boxShadow: "0 3px 0 0 rgba(0, 0, 0, 1)",
            transform: "translate(1px, 1px)",
          },
        },
        ".shadow-retro-right": {
          boxShadow: "4px 4px 0 0 rgba(0, 0, 0, 1)",
        },
        ".shadow-retro-right-hover": {
          "&:hover": {
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
            transform: "translate(2px, 2px)",
          },
        },
        ".shadow-retro-left": {
          boxShadow: "-4px 4px 0 0 rgba(0, 0, 0, 1)",
        },
        ".shadow-retro-left-hover": {
          "&:hover": {
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
            transform: "translate(2px, 2px)",
          },
        },
      });
    }),
  ],
} satisfies Config;

export default config;
