import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta principal: tons de azul + branco
        'flex-primary': '#1E40AF',      // Azul principal
        'flex-secondary': '#3B82F6',    // Azul médio  
        'flex-accent': '#60A5FA',       // Azul claro
        'flex-white': '#FFFFFF',        // Branco
        'flex-dark': '#0F172A',         // Azul muito escuro
        'flex-navy': '#1E293B',         // Azul navy
        'flex-slate': '#475569',        // Azul acinzentado
        'flex-light': '#F8FAFC',        // Branco off
        'flex-light-gray': '#F1F5F9',   // Cinza muito claro
        
        // Tons adicionais de azul
        'flex-blue-50': '#EFF6FF',
        'flex-blue-100': '#DBEAFE',
        'flex-blue-200': '#BFDBFE',
        'flex-blue-300': '#93C5FD',
        'flex-blue-400': '#60A5FA',
        'flex-blue-500': '#3B82F6',
        'flex-blue-600': '#2563EB',
        'flex-blue-700': '#1D4ED8',
        'flex-blue-800': '#1E40AF',
        'flex-blue-900': '#1E3A8A',
        'flex-blue-950': '#172554',
      },
      fontFamily: {
        'display': ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        'body': ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'gradient': 'gradient 8s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(30, 64, 175, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      screens: {
        'xs': '475px',
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
        'blue-radial': 'radial-gradient(circle, #1E40AF 0%, #1E293B 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      },
      boxShadow: {
        'blue': '0 4px 14px 0 rgba(30, 64, 175, 0.39)',
        'blue-lg': '0 10px 25px -3px rgba(30, 64, 175, 0.3)',
        'inner-blue': 'inset 0 2px 4px 0 rgba(30, 64, 175, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config