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
