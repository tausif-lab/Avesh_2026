/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./effects/**/*.{js,ts,jsx,tsx}",
    "./Scene.tsx"
  ],
  theme: {
    extend: {
      colors: {
        /* shadcn/ui semantic tokens — map to CSS vars in index.css */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        /* Existing brand palette */
        charcoal: {
          950: "#08090b",
          900: "#0e1014",
          850: "#14161c",
          800: "#171717",
          700: "#1f2229",
          600: "#2a2d36",
          500: "#3d424e",
        },
        sunset: {
          DEFAULT: "#FF642E",
          hover: "#FF7B4D",
          dark: "#E04E1B",
          glow: "rgba(255, 100, 46, 0.4)",
          subtle: "rgba(255, 100, 46, 0.12)",
        },
        coral: "#FF8C66",
        amber: "#FFA843",
        silver: {
          100: "#FFFFFF",
          200: "#F2F4F8",
          300: "#D8DCE3",
          400: "#A7ACB9",
          500: "#7A8090",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        brand: ['Teko', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'sunset-gradient': 'linear-gradient(135deg, #FF642E 0%, #FFA843 60%, #FF8C66 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 30%, #20222a 0%, #0d0e11 80%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
