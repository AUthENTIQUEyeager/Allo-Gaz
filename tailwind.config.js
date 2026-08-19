/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        flame: {
          50: "#FFF4ED",
          100: "#FFE4D2",
          200: "#FFC199",
          300: "#FF9B5C",
          400: "#FF6B35",
          500: "#F2540E",
          600: "#C93E08",
          700: "#9A2F09",
          800: "#6E220B",
          900: "#421506"
        },
        ember: {
          400: "#FFB627",
          500: "#F2A007"
        },
        ink: {
          800: "#221D1A",
          900: "#151210"
        },
        cyan: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
          800: "#155E75",
          900: "#164E63"
        },
        violet: {
          50: "#F5F3FF",
          100: "#EEE0FF",
          200: "#D8B4FE",
          300: "#B48CFF",
          400: "#9333EA",
          500: "#7E3AF2",
          600: "#6B21A8",
          700: "#581C87",
          800: "#4B1D76",
          900: "#3B0B69"
        },
        emerald: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B"
        }
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 12px rgba(34, 29, 26, 0.06)",
        card: "0 4px 20px rgba(34, 29, 26, 0.08)"
      }
    }
  },
  plugins: []
};
