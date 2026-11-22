/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // AMARKALA navy brand colors
        forest: {
          50:  '#eef3fc',
          100: '#dce8f8',
          200: '#bad1f2',
          300: '#8aafe8',
          400: '#5a87d8',
          500: '#3566c8',
          600: '#234eb0',
          700: '#1d3e8f',
          800: '#163075',
          900: '#112560',
          950: '#070e2b',
        },
        // Gold / amber accent
        gold: {
          50:  '#fefae6',
          100: '#faf2cc',
          200: '#f5e49a',
          300: '#edce5e',
          400: '#e4b92a',
          500: '#d4a017',
          600: '#b88010',
          700: '#8f5f0d',
          800: '#6a4510',
          900: '#573912',
        },
        // Neutral
        neutral: {
          50:  '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
        },
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #070e2b 0%, #112560 50%, #163075 100%)',
        'gradient-hero': 'linear-gradient(180deg, #070e2b 0%, #112560 60%, #163075 100%)',
        'gradient-gold': 'linear-gradient(135deg, #b88010 0%, #d4a017 50%, #e4b92a 100%)',
      },
    },
  },
  plugins: [],
};
