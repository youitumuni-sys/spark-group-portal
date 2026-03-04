import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'Noto Sans JP', 'sans-serif'],
      },
      colors: {
        // 明るいベースカラー
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        // アクセントカラー
        accent: {
          pink: '#FF6B9D',
          purple: '#7C4DFF',
          cyan: '#00BCD4',
          gold: '#FFD700',
          orange: '#FF5722',
          magenta: '#E91E63',
          blue: '#2196F3',
          green: '#4CAF50',
        },
        // 各店舗ブランドカラー
        'spark-shinjuku': '#FF6B9D',
        'spark-shibuya': '#7C4DFF',
        'spark-roppongi': '#00BCD4',
        'spark-ginza': '#FFD700',
        'spark-ikebukuro': '#FF5722',
        'spark-kabukicho': '#E91E63',
        // UIカラー
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#737373',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1E1E1E',
        },
        border: '#E5E7EB',
      },
      keyframes: {
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleUp: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 107, 157, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(124, 77, 255, 0.5)' },
        },
        heartPop: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '15%': { opacity: '1', transform: 'scale(1.2)' },
          '30%': { transform: 'scale(0.95)' },
          '45%': { transform: 'scale(1)' },
          '80%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.4)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        fadeIn: 'fadeIn 0.4s ease-out',
        scaleUp: 'scaleUp 0.3s ease-out',
        shimmer: 'shimmer 3s linear infinite',
        float: 'float 3s ease-in-out infinite',
        glowPulse: 'glowPulse 2s ease-in-out infinite',
        heartPop: 'heartPop 0.8s ease-out forwards',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 107, 157, 0.25)',
        'glow-purple': '0 0 20px rgba(124, 77, 255, 0.25)',
        'glow-cyan': '0 0 20px rgba(0, 188, 212, 0.25)',
        soft: '0 2px 15px rgba(0, 0, 0, 0.06)',
        card: '0 4px 24px rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'gradient-pink-purple': 'linear-gradient(135deg, #FF6B9D, #7C4DFF)',
        'gradient-purple-cyan': 'linear-gradient(135deg, #7C4DFF, #00BCD4)',
        'gradient-rainbow': 'linear-gradient(135deg, #FF6B9D, #7C4DFF, #00BCD4)',
      },
    },
  },
  plugins: [typography],
};

export default config;
