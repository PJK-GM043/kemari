import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        "brand-light": "var(--brand-light)",
        "brand-dark": "var(--brand-dark)",
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        border: "var(--border)",
        accent: "var(--accent)",
        positive: "var(--positive)",
        neutral: "var(--neutral)",
        negative: "var(--negative)",
        amber: "var(--amber)",
        cream: "var(--cream)",
      },
      fontFamily: {
        sans: ["DM Sans", "Arial", "sans-serif"],
      },
      fontSize: {
        display: ["72px", { lineHeight: "1.1", fontWeight: "700" }],
        hero: ["48px", { lineHeight: "1.15", fontWeight: "700" }],
        heading: ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        title: ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        label: ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "1.3", fontWeight: "500" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        "4xl": "96px",
      },
      borderRadius: {
        button: "8px",
        card: "12px",
        panel: "16px",
        hero: "20px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.04)",
        card: "0 4px 20px rgba(0,0,0,0.06)",
        elevated: "0 8px 30px rgba(0,0,0,0.08)",
        level0: "none",
        level1: "0 1px 2px rgba(0,0,0,0.05)",
        level2: "0 1px 1px rgba(0,0,0,0.1)",
        level3: "0 4px 12px rgba(0,0,0,0.1)",
        level4: "0 8px 24px rgba(0,0,0,0.12)",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
};
export default config;
