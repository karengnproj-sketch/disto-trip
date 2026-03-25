import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0a',
          secondary: '#1a1a1a',
          tertiary: '#2a2a2a',
        },
        accent: {
          primary: '#39FF14',
          secondary: '#00E676',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          muted: '#666666',
        },
        danger: '#FF4444',
        warning: '#FFB300',
        success: '#00E676',
        border: '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #39FF14, #00E676)',
        'accent-gradient-hover': 'linear-gradient(135deg, #00E676, #39FF14)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #39FF14, 0 0 10px #39FF14' },
          '100%': { boxShadow: '0 0 20px #39FF14, 0 0 40px #39FF14' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
