export const theme = {
  colors: {
    primary: '#0066CC',
    secondary: '#2C3E50',
    emergency: '#DC2626',
    success: '#059669',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      disabled: '#CBD5E1'
    }
  },
  typography: {
    fontFamily: {
      primary: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, sans-serif',
      header: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif'
    },
    fontSize: {
      h1: '24px',
      h2: '20px',
      h3: '18px',
      body: '16px',
      small: '14px'
    },
    lineHeight: {
      h1: '32px',
      h2: '28px',
      h3: '24px',
      body: '24px',
      small: '20px'
    }
  },
  spacing: {
    base: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '32px',
    xxlarge: '48px'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px'
  },
  shadows: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  breakpoints: {
    mobile: '640px',
    tablet: '1024px'
  }
} as const;

export type Theme = typeof theme; 