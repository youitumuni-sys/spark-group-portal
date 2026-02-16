export const colors = {
  primary: {
    DEFAULT: '#D4AF37',
    light: '#E8C547',
    dark: '#B8942E',
  },
  surface: {
    background: '#0A0A0F',
    DEFAULT: '#15151F',
    hover: '#1F1F2E',
    border: '#2A2A3A',
  },
  text: {
    DEFAULT: '#F5F5FA',
    muted: '#9CA3AF',
    dim: '#6B7280',
  },
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  accent: '#A855F7',
} as const;

export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  hero: '4rem',
} as const;

export const spacing = {
  section: '5rem',
  sectionMobile: '3rem',
  container: '80rem',
  headerHeight: '4rem',
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const duration = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;
