import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#0c101b", // Institutional card fill
        slate: {
          50: "#070b13",  // Canvas background
          100: "#111625", // Container hover/well background
          200: "#1e293b", // Panel borders
          300: "#334155", // Interactive borders
          400: "#64748b", // Muted text
          500: "#94a3b8", // Secondary text
          600: "#cbd5e1", // Subtle accent text
          700: "#e2e8f0", // Medium-bold text
          800: "#f1f5f9", // Heavy titles
          900: "#f8fafc", // Absolute white text
        },
        brand: {
          50: "rgba(59, 130, 246, 0.12)",
          100: "rgba(59, 130, 246, 0.2)",
          200: "#3b82f6",
          300: "#60a5fa",
          400: "#93c5fd",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        surface: {
          0: "#0c101b",
          50: "#070b13",
          100: "#111625",
          200: "#1e293b",
          300: "#334155",
        },
        gain: "#10b981",
        loss: "#f43f5e",
        // Translucent glow states matching screenshot
        "emerald-50": "rgba(16, 185, 129, 0.12)",
        "rose-50": "rgba(244, 63, 94, 0.12)",
        "blue-50": "rgba(59, 130, 246, 0.12)",
        "indigo-50": "rgba(99, 102, 241, 0.12)",
        "amber-50": "rgba(245, 158, 11, 0.12)",
        "green-50": "rgba(16, 185, 129, 0.12)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)",
        elevated: "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.05)",
        panel: "0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -4px rgba(0,0,0,0.04)",
      },
      animation: {
        "flash-green": "flash-green 300ms ease-out",
        "flash-red": "flash-red 300ms ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in-right 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
